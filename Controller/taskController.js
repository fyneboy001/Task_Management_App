const taskModel = require("../Model/taskModel");

//Create Task Function
const createTask = async (req, res) => {
  const { User } = req.cookies;
  const { title, description, categories, deadline } = req.body;

  try {
    const task = new taskModel(User, {
      title,
      description,
      categories,
      deadline,
    });
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
    const {creatorId} = req.cookies
    const {title, }
}
