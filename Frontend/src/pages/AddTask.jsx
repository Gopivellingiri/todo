import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useTaskContext } from "../common/TaskContext";
import Select from "react-select";
import moment from "moment";
import axios from "axios";
import { API_TASK_URL } from "../../Api";
import { toast } from "react-toastify";

const AddTask = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userInfo?.token;
  const { lists, fetchTasks } = useTaskContext();
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: null,
    dueTime: "",
    list: null,
  });
  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setTask({ ...task, dueDate: date });
  };

  const handleTimeChange = (e) => {
    let timeValue = e.target.value;
    setTask({ ...task, dueTime: timeValue });
  };

  const handleListChange = (selectedOption) => {
    setTask({ ...task, list: selectedOption });
  };

  const options = lists?.map((list) => ({
    value: list?.name.split(" ")[0],
    label: list?.name.split(" ")[0],
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...task,
      dueDate: task.dueDate ? moment(task.dueDate).format("YYYY-MM-DD") : null,
      dueTime: task.dueTime
        ? moment(task.dueTime, ["HH:mm", "hh:mm A"]).format("HH:mm:ss")
        : null,
      list: task.list?.value || null,
    };

    if (!token) {
      toast.error("token is missing");
    }

    try {
      const response = await axios.post(
        `${API_TASK_URL}/add-tasks`,
        formattedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Task Created:", response.data);
      setTask({
        title: "",
        description: "",
        dueDate: null,
        dueTime: "",
        list: null,
      });
      toast.success("Tasks are added successfully!");
      await fetchTasks();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error("Error adding task:", error);
    }
  };

  return (
    <div className="!pt-5 !px-5 w-full">
      <h2 className="font-semibold text-gray-700 !py-2 text-xl">Add Tasks:</h2>
      <form
        className="flex flex-col gap-4 text-gray-700"
        onSubmit={handleSubmit}
      >
        {/* Title Input */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-base font-semibold !mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            className="bg-gray-200 text-sm !p-2 rounded-md"
            placeholder="Enter your task title here.."
            onChange={handleChange}
          />
        </div>

        {/* Description Input */}
        <div className="flex flex-col">
          <label htmlFor="des" className="text-base font-semibold !mb-2">
            Description
          </label>
          <textarea
            className="bg-gray-200 text-sm !p-2 rounded-md resize-none h-24"
            id="des"
            name="description"
            placeholder="Enter your description here.."
            onChange={handleChange}
            value={task.description}
          ></textarea>
        </div>

        {/* Due Date & Time */}
        <div className="w-full">
          <label className="text-base font-semibold !mb-2">
            Due Date & Time
          </label>
          <div className="flex items-center gap-4 w-full">
            {/* Date Picker for Date Selection */}
            <div className="flex-1">
              <DatePicker
                selected={task.dueDate}
                onChange={handleDateChange}
                className="bg-gray-200 text-sm !p-2 rounded-md w-full"
                dateFormat="MMMM d, yyyy"
                placeholderText="Select due date"
              />
            </div>

            {/* Manual Time Input */}
            <input
              type="time"
              value={task.dueTime}
              onChange={handleTimeChange}
              className="bg-gray-200 text-sm !p-2 rounded-md w-[25%]" // Fixed width
            />
          </div>
        </div>

        {/* Lists Dropdown */}
        <div className="flex flex-col">
          <label className="text-base font-semibold !mb-2">Lists</label>
          <Select
            options={options}
            onChange={handleListChange}
            value={task.list}
            placeholder="Select a list"
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: "rgb(229 231 235)",
                borderRadius: "0.375rem",
                padding: "4px",
                border: "none",
                boxShadow: "none",
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: "white",
                borderRadius: "0.375rem",
              }),
            }}
          />
        </div>
        <button type="submit" className="btn-primary font-semibold">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AddTask;
