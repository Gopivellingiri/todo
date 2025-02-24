import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import UserAuthentication from "./pages/UserAuthentication";
import Dashboard from "./pages/Dashboard";
import ListPage from "./pages/ListPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { TaskProvider } from "./common/TaskContext.jsx";
import PrivateRoute from "./Routes/PrivateRoute.jsx";

const App = () => {
  return (
    <>
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/" element={<UserAuthentication type="sign-up" />} />
            <Route
              path="/sign-in"
              element={<UserAuthentication type="sign-in" />}
            />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<Navigate to="today-task" />} />
                <Route path=":listName" element={<ListPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </TaskProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
