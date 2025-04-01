const taskModel = require("../Model/taskModel");
const categoryModel = require("../Model/categoryModel");
const jwt = require("jsonwebtoken");

//Create Task Function
const createTask = async (req, res) => {
  const { token } = req.cookies;
  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  const { title, description, categoryId, deadline } = req.body;

  try {
    //Checking if category exist
    const category = await categoryModel.findById(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Category not found" });
    }
    const task = new taskModel(
      {
        title,
        description,
        category: categoryId,
        deadline,
      },
      { creatorId: id }
    );
    await task.save();
    res.status(201).json(task, { message: "Task created Successfully" });
  } catch (error) {
    res.status(500).json("Something went Wrong");
  }
};

//Function Read all Task created
const getAllTask = async (req, res) => {
  try {
    const allTask = await taskModel.find();
    res.status(200).json(allTask);
  } catch (error) {
    res.status(500).send("Something went Wrong");
  }
};

//Get a single Task
const getSingleTask = async (req, res) => {
  const { id } = req.params;

  try {
    const singleTask = await taskModel.findById({ taskId: id });
    if (!singleTask) {
      return res.status(404).json("Task not found");
    }
    res.status(200).json(singleTask);
  } catch (error) {
    res.status(500).send("Something went Wrong");
  }
};

//Function to update Task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { creatorId, title, description, categories, deadline } = req.body;

  try {
    const task = await taskModel.findById(id);
    if (!task) return res.status(404).json("Task not found");

    if (task.creatorId !== creatorId) {
      return res.status(403).json("You are not authorized to update this task");
    }

    //Updating the task after all conditions are met
    await taskModel.findByIdAndUpdate(
      id,
      { title, description, categories, deadline },
      { new: true }
    );
    res.status(200).json("Task updated successfully");
  } catch (error) {
    res.status(500).json("Something went Wrong");
  }
};

//Function to delete a Task
const deleteTask = async (req, res) => {
  const { creatorId } = req.body;
  const { id } = req.params;

  try {
    const Task = await taskModel.findById(id);
    if (!Task) {
      return res.status(404).json("Task not found");
    }

    if (Task.creatorId !== creatorId) {
      return res.status(403).json("You are not authorized to delete this task");
    }

    await taskModel.findByIdAndDelete(id);
    res.status(200).json("Task deleted successfully");
  } catch (error) {
    res.status(500).json("Something went Wrong");
  }
};

module.exports = {
  createTask,
  getAllTask,
  getSingleTask,
  updateTask,
  deleteTask,
};
