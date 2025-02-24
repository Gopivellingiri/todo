import { IoClose } from "react-icons/io5";
import AnimationWrapper from "../common/PageAnimation";
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Don't render if modal is closed

  return (
    <AnimationWrapper className="fixed inset-0 flex items-center justify-center bg-gray-700/50 z-50">
      <div className="bg-white !p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-all duration-200"
          >
            <IoClose className="text-2xl cursor-pointer" />
          </button>
        </div>
        <div className="mt-4">{children}</div> {/* Dynamic Content */}
      </div>
    </AnimationWrapper>
  );
};

export default Modal;
