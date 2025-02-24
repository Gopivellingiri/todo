import { useLocation, useParams } from "react-router-dom";
import { useTaskContext } from "../common/TaskContext";
import { FaCalendarCheck, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { API_TASK_URL } from "../../Api";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import AnimationWrapper from "../common/PageAnimation";
import { IoTimeSharp } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ListPage = () => {
  const { updateTask, fetchTaskCounts, fetchTasks, searchQuery, selectedTask } =
    useTaskContext();
  console.log(searchQuery);
  const { listName } = useParams();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userInfo?.token;
  // const selectedList = lists?.find(
  //   (list) => list.name.toLowerCase() === listName.toLowerCase()
  // );
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updateDescription, setUpdatedDescription] = useState("");
  const [updateDueDate, setUpdateDueDate] = useState("");
  const [updateTime, setUpdateTime] = useState("");

  const { pathname } = useLocation();

  const fetchTasksByCategory = async () => {
    try {
      if (!token) {
        toast.error("No token found!");
        return;
      }

      let filter = "";
      if (pathname.includes("today-task")) {
        filter = "today";
      } else if (pathname.includes("upcoming-task")) {
        filter = "upcoming";
      } else if (pathname.includes("completed-task")) {
        filter = "completed";
      }

      const response = await axios.get(`${API_TASK_URL}/filter-tasks`, {
        params: { filter, listName, searchQuery },

        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setSelectedTasks(response.data.tasks);
        console.log("This is the response data:", response.data.tasks);
        await fetchTasks();
        await fetchTaskCounts();
      }
    } catch (error) {
      toast.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasksByCategory();
  }, [pathname, searchQuery]);

  //updating status to complted state to true
  const handleTaskCompletion = async (listId, taskId, newStatus) => {
    try {
      if (!token) {
        console.error("No token found!");
        toast.error("Authentication token missing");
        return;
      }
      const response = await axios.put(
        `${API_TASK_URL}/completed`,
        {
          listId,
          taskId,
          completed: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSelectedTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskId === taskId ? { ...task, completed: newStatus } : task
          )
        );
        toast.success("Task updated successfully");
        await fetchTasksByCategory();
        await fetchTasks();
        await fetchTaskCounts();
      } else {
        toast.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleEditTask = (task) => {
    setSelectedTasks(task);
    setUpdatedTitle(task.title);
    setUpdatedDescription(task.description);
    setUpdateDueDate(task.dueDate);
    setUpdateTime(moment(task.time, "HH:mm").format("hh:mm A"));
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (selectedTask && updatedTitle.trim() !== "") {
      const formattedTime = moment(updateTime, "hh:mm A").format("HH:mm");
      await updateTask(selectedTask.listId, selectedTask.taskId, {
        title: updatedTitle,
        description: updateDescription,
        dueDate: updateDueDate,
        time: formattedTime, // Send 24-hour format to backend
      });
      await fetchTasksByCategory();
      setIsModalOpen(false);
    }
  };

  //delete task
  const handleDeleteTask = async (listId, taskId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (!confirmDelete) return;

      const response = await axios.delete(
        `${API_TASK_URL}/delete-task/${listId}/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("Task deleted successfully!");
        await fetchTasksByCategory();
      }
    } catch (error) {
      toast.error("Error deleting task");
      console.error("Delete error:", error);
    }
  };
  console.log(selectedTasks);

  return (
    <div className="!px-5 !py-5">
      {selectedTasks.length > 0 ? (
        selectedTasks?.map((task, index) => (
          <AnimationWrapper
            key={index}
            className="group flex items-center justify-between gap-2 max-w-full text-base !py-5 !px-5 text-gray-700 border-t border-[var(--input-stroke)] hover:bg-[var(--input-color)] transition-all duration-200 cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-4">
                <span className="block text-sm font-semibold !py-1 !px-3 rounded-md bg-green-100 text-green-700 w-max">
                  {task?.title}
                </span>
                <span className=" text-sm font-semibold !py-1 !px-3 rounded-md flex items-center justify-center gap-2 bg-gray-200">
                  <FaCalendarCheck className="text-base" />
                  {moment(task?.dueDate).format("DD-MM-YYYY")}
                </span>
                <span className=" text-sm text-blue-500 font-semibold !py-1 !px-3 rounded-md flex items-center justify-center gap-2 bg-blue-200">
                  <IoTimeSharp className="text-base" />
                  {moment(task?.time, "HH:mm").format("hh:mm A")}
                </span>
              </div>
              <div className="flex items-center gap-4 !pt-2">
                <input
                  type="checkbox"
                  checked={task.completed}
                  className="mr-3 w-5 h-5 cursor-pointer"
                  onChange={() =>
                    handleTaskCompletion(
                      task?.listId,
                      task.taskId,
                      !task.completed
                    )
                  }
                />
                <p
                  className={`${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.description}
                </p>
              </div>
            </div>
            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span
                className="bg-[#CCCCCC] h-10 w-10 rounded-sm flex items-center justify-center"
                onClick={() => handleEditTask(task)}
              >
                <FaEdit className=" cursor-pointer hover:text-white text-xl text-[var(--secondary-color)] transition-all duration-200" />
              </span>
              <span
                className="bg-[#CCCCCC] h-10 w-10 rounded-sm flex items-center justify-center"
                onClick={() => handleDeleteTask(task.listId, task.taskId)}
              >
                <FaTrash className=" cursor-pointer hover:text-white text-xl text-[var(--secondary-color)] transition-all duration-200" />
              </span>
            </div>
          </AnimationWrapper>
        ))
      ) : (
        <p className="text-red-500 !py-2 font-semibold">
          {pathname.includes("completed-task")
            ? "No completed tasks found."
            : "No tasks found for this list."}
        </p>
      )}
      <hr className="border-t border-[var(--input-stroke)]" />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Task"
      >
        <div className="flex flex-col items-center gap-4 !pt-4 w-full">
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="w-full !p-2 border border-[var(--input-stroke)] bg-[var(--input-color)] rounded mt-2"
          />
          <input
            type="text"
            value={updateDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            className="w-full !p-2 border border-[var(--input-stroke)] bg-[var(--input-color)] rounded mt-2"
          />
          <DatePicker
            selected={updateDueDate ? new Date(updateDueDate) : null}
            onChange={(date) => setUpdateDueDate(date)}
            className="w-full !p-2 !px-4.5 border border-[var(--input-stroke)] bg-[var(--input-color)] rounded mt-2"
            dateFormat="dd/MM/yyyy"
          />
          <input
            type="time"
            value={updateTime}
            onChange={(e) => setUpdateTime(e.target.value)}
            className="w-full !p-2 border border-[var(--input-stroke)] bg-[var(--input-color)] rounded mt-2"
          />
          <button
            onClick={handleSave}
            className="block w-full mt-4 !px-4 !py-2 bg-[var(--primary-color)] text-white rounded cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ListPage;
