import { createContext, useContext, useEffect, useState } from "react";
import { initialTask } from "../data.js";
import { toast } from "react-toastify";
import { API_TASK_URL } from "../../Api.js";
import axios from "axios";

const TaskContext = createContext(); // Create the context

export const TaskProvider = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userInfo?.token;
  const [lists, setLists] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [taskCounts, setTaskCounts] = useState({
    today: 0,
    upcoming: 0,
    completed: 0,
  });

  const fetchTaskCounts = async () => {
    try {
      const token = userInfo?.token;
      if (!token) {
        toast.error("No token found!");
        return;
      }

      const response = await axios.get(`${API_TASK_URL}/filter-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setTaskCounts(response.data.counts);
        console.log("Updated task counts:", response.data.counts);
      }
    } catch (error) {
      toast.error(
        "Error fetching task counts: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    fetchTaskCounts();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const token = userInfo?.token;
      if (!token) {
        toast.error("No token found");
        return;
      }

      const response = await axios.get(`${API_TASK_URL}/all-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setLists([...response.data]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const updateTask = async (listId, taskId, updatedFields) => {
    try {
      const token = userInfo?.token;
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }
      const response = await axios.put(
        `${API_TASK_URL}/update-tasks/${listId}`,
        { taskId, ...updatedFields },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setLists((prevLists) =>
          prevLists.map((list) => ({
            ...list,
            tasks: list.tasks.map((task) =>
              task._id === taskId ? { ...task, ...updatedFields } : task
            ),
          }))
        );
        toast.success("Task updated successfully");
        await fetchTaskCounts();
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const updateListName = async (listId, newName) => {
    try {
      const token = userInfo?.token;
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }
      const { data } = await axios.put(
        `${API_TASK_URL}/update-listname/${listId}`,
        { name: newName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLists((prevLists) =>
        prevLists.map((list) =>
          list._id === listId ? { ...list, name: data.updatedList.name } : list
        )
      );
      toast.success("Your list updated successfully!");
    } catch (error) {
      toast.error("Error updating list name:", error);
    }
  };

  const deleteList = async (listId) => {
    try {
      const token = userInfo?.token;
      if (!token) {
        toast.error("Authentication token missing");
        return;
      }
      await axios.delete(`${API_TASK_URL}/delete-list/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists((prevLists) => prevLists.filter((list) => list._id !== listId));
      toast.success("List deleted successfully!");
    } catch (error) {
      toast.error("Error deleting list:", error);
    }
  };
  return (
    <TaskContext.Provider
      value={{
        lists,
        setLists,
        updateTask,
        updateListName,
        deleteList,
        taskCounts,
        fetchTaskCounts,
        fetchTasks,
        setSearchQuery,
        searchQuery,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
// Custom hook for using TaskContext
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
