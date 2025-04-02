const express = require("express");
const route = express.Router();

//importing controller APIs
const {
  createTask,
  getAllUserTask,
  getSingleTask,
  updateTask,
  deleteTask,
} = require("../Controller/taskController");

//CRUD operators
route.post("/task", createTask); //create a task
route.get("/task", getAllUserTask); //get all tasks
route.get("/task/:id", getSingleTask); //get a single task
route.put("/task/:id", updateTask); //update a task
route.delete("/task/:id", deleteTask); //delete a task

module.exports = route;
