import { Outlet, useLocation } from "react-router-dom";
import AnimationWrapper from "../common/PageAnimation";
import AddTask from "./AddTask";
import { FaSearch } from "react-icons/fa";

import Menu from "./Menu";
import { useTaskContext } from "../common/TaskContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { taskCounts, setSearchQuery } = useTaskContext();

  const location = useLocation();
  const pageTitle = location.pathname.split("/").filter(Boolean).pop();
  const formattedTitle =
    pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1).split("-")[0];

  useEffect(() => {
    taskCounts;
  }, [taskCounts]);
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <AnimationWrapper className=" flex justify-between h-screen">
      <div className="bg-[var(--panel-color)] w-[300px]">
        <Menu />
      </div>
      <div className=" flex-1/2 ">
        <div className="!mt-5 !px-5 relative flex items-center justify-between">
          <div>
            <input
              type="text"
              className="border border-[var(--input-stroke)] rounded-md  !py-2 !px-10 "
              placeholder="Search"
              onChange={handleSearch}
            />
            <FaSearch className="absolute top-1/2 left-8 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div>
            <h3 className="flex items-center gap-2 text-xl text-gray-700 font-semibold">
              {formattedTitle}
              {taskCounts[formattedTitle.toLowerCase()] > 0 && (
                <span className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full">
                  {taskCounts[formattedTitle.toLowerCase()]}
                </span>
              )}
            </h3>
          </div>
        </div>
        <div className="h-[500px]">
          <Outlet />
        </div>
      </div>
      <div className="bg-[var(--panel-color)] flex-1/3 ">
        <AddTask />
      </div>
    </AnimationWrapper>
  );
};

export default Dashboard;
