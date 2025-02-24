import { Route } from "react-router-dom";
import { useTaskContext } from "./common/TaskContext";
import ListPage from "./pages/ListPage";

const DynamicRoutes = () => {
  const { lists } = useTaskContext();

  return (
    <>
      {lists.map((list) => (
        <Route key={list} path={`/dashboard/${list}`} element={<ListPage />} />
      ))}
    </>
  );
};

export default DynamicRoutes;
