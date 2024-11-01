const Task = require("../models/TaskModel");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    if (task.title) {
      await task.save();
      res.status(201).json(task);
    } else {
      res.status(400).json({ message: "Title Requred" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Read Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userid: req.params.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ id: req.params.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
