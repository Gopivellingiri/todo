import Redirect from "./Redirect";
import { useTaskContext } from "../common/TaskContext";
import randomColor from "randomcolor";

const Lists = () => {
  const { lists } = useTaskContext();

  return (
    <div className="w-full">
      <h5 className="text-xl text-[var(--primary-color)] font-semibold">
        Lists :
      </h5>
      <div className="!pt-3">
        {lists?.length > 0 ? (
          lists?.map((list) => {
            const color = randomColor({ luminosity: "bright" }); // Generates a bright color

            return (
              <Redirect
                key={list?._id}
                listId={list?._id}
                to={`/dashboard/${list?.name.split(" ")[0].toLowerCase()}`}
                label={list?.name.split(" ")[0]}
                icon={
                  <span
                    className="w-5 h-5 rounded-sm inline-block"
                    style={{ backgroundColor: color }}
                  ></span>
                }
              />
            );
          })
        ) : (
          <p className="text-gray-500">No lists available</p>
        )}
      </div>
    </div>
  );
};

export default Lists;
