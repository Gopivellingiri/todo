import express from "express";

import {
  addList,
  addTasks,
  allTasks,
  deleteList,
  deleteTask,
  filteredTasks,
  taskComplete,
  updateListName,
  updateTask,
} from "../controllers/taskController.js";
import authentication from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all-tasks", authentication, allTasks);
router.put("/completed", authentication, taskComplete);
router.put("/update-listName/:listId", authentication, updateListName);
router.get("/filter-tasks", authentication, filteredTasks);
router.put("/update-tasks/:listId", authentication, updateTask);
router.delete("/delete-task/:listId/:taskId", authentication, deleteTask);
router.delete("/delete-list/:listId", authentication, deleteList);
router.post("/add-list", authentication, addList);
router.post("/add-tasks", authentication, addTasks);

export default router;
