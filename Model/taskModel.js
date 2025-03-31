const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  categories: {
    type: String,
    required: false,
  },
  deadline: {
    type: Date,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const taskModel = mongoose.Schema("Task", taskSchema);

module.exports = taskModel;
