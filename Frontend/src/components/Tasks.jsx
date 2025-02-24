import Redirect from "./Redirect";
import { IoTodaySharp } from "react-icons/io5";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { TiTick } from "react-icons/ti";

const Tasks = () => {
  const predefinedLists = [
    {
      name: "Today",
      path: "today-task",
      icon: <IoTodaySharp className="text-[20px]" />,
    },
    {
      name: "Upcoming",
      path: "upcoming-task",
      icon: <MdKeyboardDoubleArrowRight className="text-[20px]" />,
    },
    {
      name: "Completed",
      path: "completed-task",
      icon: <TiTick className="text-[20px]" />,
    },
  ];
  return (
    <div className="w-full">
      <h5 className="text-xl text-[var(--primary-color)] font-semibold">
        Tasks :
      </h5>
      <div className="!pt-3">
        {predefinedLists.map((item) => (
          <Redirect
            key={item.path}
            to={`/dashboard/${item.path}`}
            label={item.name}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default Tasks;
