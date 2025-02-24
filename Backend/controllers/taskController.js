import List from "../models/ListModal.js";

const taskComplete = async (req, res) => {
  try {
    const { listId, taskId, completed } = req.body;

    if (!listId || !taskId) {
      return res.status(400).json({ message: "Missing listId or taskId" });
    }

    const updateResult = await List.updateOne(
      { _id: listId, "tasks._id": taskId },
      { $set: { "tasks.$.completed": completed } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({ message: "Task not found or not updated" });
    }

    // Fetch the updated task separately
    const updatedList = await List.findById(listId);
    const updatedTask = updatedList.tasks.find(
      (task) => task._id.toString() === taskId
    );

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const allTasks = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    const lists = await List.find(
      { userId: userId },
      {
        _id: 1,
        name: 1,
        "tasks._id": 1,
        "tasks.title": 1,
        "tasks.description": 1,
        "tasks.dueDate": 1,
        "tasks.completed": 1,
      }
    );

    if (!lists || lists.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    res.status(200).json(lists);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const filteredTasks = async (req, res) => {
  try {
    const { filter, listName, searchQuery } = req.query;
    const now = new Date();
    let matchCondition = {};

    const specialCategories = ["today-task", "upcoming-task", "completed-task"];
    if (listName && !specialCategories.includes(listName)) {
      matchCondition["name"] = listName;
    }

    if (filter === "completed") {
      matchCondition["tasks.completed"] = true;
    } else if (filter === "today") {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      matchCondition["tasks.dueDate"] = { $gte: startOfDay, $lt: endOfDay };
    } else if (filter === "upcoming") {
      matchCondition["tasks.dueDate"] = { $gt: now };
    }

    if (searchQuery) {
      matchCondition["$or"] = [
        { "tasks.title": { $regex: searchQuery, $options: "i" } },
        { "tasks.dueDate": { $regex: searchQuery, $options: "i" } },
        { "tasks.randomTime": { $regex: searchQuery, $options: "i" } },
      ];
    }

    const lists = await List.aggregate([
      { $unwind: "$tasks" },
      { $match: matchCondition },
      {
        $project: {
          _id: 0,
          listId: "$_id",
          listName: "$name",
          taskId: "$tasks._id",
          title: "$tasks.title",
          description: "$tasks.description",
          dueDate: "$tasks.dueDate",
          completed: "$tasks.completed",
          time: "$tasks.randomTime",
        },
      },
      { $sort: { dueDate: 1, time: 1 } }, // ✅ Sort by dueDate, then time
    ]);

    const totalTodayTasks = await List.aggregate([
      { $unwind: "$tasks" },
      {
        $match: {
          "tasks.dueDate": {
            $gte: new Date(now.setHours(0, 0, 0, 0)),
            $lt: new Date(now.setHours(23, 59, 59, 999)),
          },
        },
      },
      { $count: "count" },
    ]);

    const totalUpcomingTasks = await List.aggregate([
      { $unwind: "$tasks" },
      { $match: { "tasks.dueDate": { $gt: new Date() } } },
      { $count: "count" },
    ]);

    const totalCompletedTasks = await List.aggregate([
      { $unwind: "$tasks" },
      { $match: { "tasks.completed": true } },
      { $count: "count" },
    ]);

    res.status(200).json({
      tasks: lists,
      counts: {
        today: totalTodayTasks[0]?.count || 0,
        upcoming: totalUpcomingTasks[0]?.count || 0,
        completed: totalCompletedTasks[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error("Error filtering tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { listId } = req.params;

    const { taskId, title, description, dueDate, time } = req.body;

    const updatedTask = await List.findOneAndUpdate(
      { _id: listId, "tasks._id": taskId },
      {
        $set: {
          "tasks.$.title": title,
          "tasks.$.description": description,
          "tasks.$.dueDate": dueDate,
          "tasks.$.randomTime": time,
        },
      },
      { new: true }
    );
    if (!updateTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { listId, taskId } = req.params; // Get listId and taskId from request params
    console.log(req.params);
    const updatedList = await List.findByIdAndUpdate(
      listId,
      { $pull: { tasks: { _id: taskId } } }, // Remove the task from tasks array
      { new: true } // Return updated document
    );

    if (!updatedList) {
      return res.status(404).json({ message: "List not found" });
    }

    res.json({ message: "Task deleted successfully", updatedList });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};

const addList = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "List name is required" });
    }
    const newList = new List({
      name,
      userId: req.user?._id,
    });
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateListName = async (req, res) => {
  try {
    const { listId } = req.params;
    const { name } = req.body;
    if (!name.trim()) {
      return res.status(400).json({ message: "List name cannot be empty" });
    }
    const updatedList = await List.findByIdAndUpdate(
      { _id: listId },
      { name: name },
      { new: true }
    );
    if (!updatedList) {
      return res.status(404).json({ message: "List not found" });
    }
    res.status(200).json({ message: "List updated successfully", updatedList });
  } catch (error) {
    console.error("Error updating list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteList = async (req, res) => {
  try {
    const { listId } = req.params;

    const deleteResult = await List.deleteOne({ _id: listId });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ message: "List not found" });
    }

    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addTasks = async (req, res) => {
  const { title, description, dueDate, dueTime, list } = req.body;
  const userId = req.user.id; // FIXED: Correctly extract userId

  // Validate required fields
  if (!title || !dueDate || !dueTime) {
    return res
      .status(400)
      .json({ message: "Title, Due Date, and Time are required!" });
  }

  try {
    // Find the existing list or create a new one
    let existingList = await List.findOne({ name: list, userId });

    if (!existingList) {
      existingList = await List.create({
        name: list,
        userId,
        tasks: [],
      });
    }

    // Add new task to the list's tasks array
    existingList.tasks.push({
      title,
      description,
      dueDate,
      randomTime: dueTime,
    });

    // Save updated list
    await existingList.save();

    res.status(201).json(existingList);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export {
  taskComplete,
  allTasks,
  filteredTasks,
  updateTask,
  deleteTask,
  addList,
  updateListName,
  deleteList,
  addTasks,
};
