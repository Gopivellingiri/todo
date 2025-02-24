import { IoMenu } from "react-icons/io5";
import userIcon from "../assets/userIcon.png";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";
import Tasks from "../components/Tasks";
import Lists from "../components/Lists";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL, API_TASK_URL } from "../../Api";
import { toast } from "react-toastify";
import { useTaskContext } from "../common/TaskContext";
import Modal from "../components/Modal";

const Menu = () => {
  const { lists, setLists } = useTaskContext();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [profileImage, setProfileImage] = useState(
    userInfo.profileImage || userIcon
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listName, setListName] = useState("");

  const token = userInfo.token || "";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfileImage(URL.createObjectURL(file)); // Preview image
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/upload-image`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const updatedUserInfo = { ...userInfo, profileImage: data.imageUrl };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      setProfileImage(data.imageUrl);
      toast.success("Profile image changed successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Upload failed. Please try again."
      );
    }
  };

  const addNewList = async () => {
    if (!listName) {
      toast.error("Please enter a list name");
      return;
    }
    try {
      const { data } = await axios.post(
        `${API_TASK_URL}/add-list`,
        { name: listName },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLists([...lists, data]);
      toast.success("New list added successfully!");
      setListName("");
      setIsModalOpen(false); // Close modal after adding the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add list");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("userInfo"); // Remove user data
    toast.success("Signed out successfully!");
    setTimeout(() => {
      window.location.href = "/sign-in"; // Redirect to login page
    }, 1000);
  };

  return (
    <div className="!pt-5 !px-5 flex flex-col justify-between gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl text-[var(--primary-color)]">
          Taskly.
        </h1>
        <IoMenu size={25} className="text-[var(--secondary-color)]" />
      </div>
      <div className="!pt-5 flex flex-col items-center gap-1.5 text-base">
        <label htmlFor="fileInput" className="cursor-pointer">
          <img
            className="mx-auto w-18 h-18 rounded-full border-white border-4 object-cover"
            src={profileImage}
            alt="User Profile"
          />
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="font-semibold text-[var(--primary-color)]">Krish</span>
        <button
          className="btn-primary font-semibold"
          onClick={() => document.getElementById("fileInput").click()}
        >
          Upload
        </button>
      </div>

      <div className="flex flex-col items-start gap-4 !pt-5 ">
        <Tasks />
        <Lists />
        <button
          className="font-semibold text-gray-700 flex items-center gap-4 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <span>
            <FaPlus />
          </span>
          <span>Add New List</span>
        </button>
      </div>
      <button
        className="font-semibold text-gray-700 flex items-center gap-4 cursor-pointer !py-2"
        onClick={handleSignOut}
      >
        <span>
          <FaSignOutAlt />
        </span>
        <span>Sign Out</span>
      </button>

      {/* Modal for adding a new list */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New List"
      >
        <div className="flex flex-col gap-4 !mt-2">
          <input
            type="text"
            className="border !p-2 rounded w-full"
            placeholder="Enter list name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white !px-4 !py-2 rounded"
            onClick={addNewList}
          >
            Add List
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Menu;
