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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
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
    required: true,
  },
});

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;
