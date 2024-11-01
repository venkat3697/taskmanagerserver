const mongoose = require("mongoose");

// Task Schema
const taskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  datetime: { type: Date, default: Date.now },
  status: { type: String, enum: ["todo", "pending", "done"], default: "todo" },
  userid:{ type: String, required: true },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
