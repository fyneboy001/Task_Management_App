const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./Route/userRoute");
const cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(express.json());
app.use(userRoute);

//connecting mongodb database to express application
const { MONGODB_URL } = process.env;
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Application connected to database successfully");
  })
  .catch(() => {
    console.log("Something went wrong");
  });

//listening to application at port 4000
app.listen(4000, () => {
  console.log("application is running properly");
});
