const express = require("express");
const route = express.Router();

//Importing controller functions
const {
  createUser,
  loginUser,
  updateUser,
} = require("../Controller/userController");

//CRUD operators
route.post("/user", createUser);
route.get("/login", loginUser);
route.put("/user", updateUser);

module.exports = route;
