import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTaskContext } from "../common/TaskContext";
import Modal from "./Modal";
import { useEffect, useState } from "react";

const Redirect = ({ to, label, listId, icon }) => {
  const { lists, updateListName, deleteList } = useTaskContext();
  const [newLabel, setNewLabel] = useState(label);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    await deleteList(listId);
    setIsDeleteModalOpen(false);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (newLabel.trim() && newLabel !== label) {
      await updateListName(listId, newLabel);
    }
    setIsModalOpen(false);
  };

  const matchedList = lists?.find((list) => list.name === label);
  const pendingTaskCount =
    matchedList?.tasks?.filter((task) => !task.completed)?.length ?? 0;

  return (
    <Link
      to={to}
      className="group !py-2 !px-2 rounded-md hover:bg-[var(--panel-button)] block font-semibold transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-4 justify-between">
        {/* Left Side: Icon + Label */}
        <div className="flex items-center gap-4 text-gray-700">
          <span>{icon}</span>
          <span>{label}</span>
        </div>

        {!(
          label === "Today" ||
          label === "Upcoming" ||
          label === "Completed"
        ) && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span
                className="bg-gray-700 !p-1 rounded-[5px]"
                onClick={handleEditClick}
              >
                <FaEdit />
              </span>
              <span
                className="bg-gray-700 !p-1 rounded-[5px]"
                onClick={handleDeleteClick}
              >
                <FaTrash />
              </span>
            </div>

            <span className="flex items-center justify-center bg-gray-700 w-6 h-6 rounded-full text-gray-200">
              {pendingTaskCount}
            </span>
          </div>
        )}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit List"
        >
          <div className="flex flex-col items-center gap-4 !pt-4 w-full">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
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

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete List"
        >
          <div className="flex flex-col items-center gap-4 !pt-4 w-full">
            <p className="text-center text-gray-600">
              Are you sure you want to delete <b>{label}</b>? This action cannot
              be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="block !px-4 !py-2 bg-gray-400 text-white rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="block !px-4 !py-2 bg-red-600 text-white rounded cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Link>
  );
};

export default Redirect;
