const userModel = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create a new user function
const createUser = async (req, res) => {
  const { password, ...others } = req.body;

  //salting password for hashing
  const salt = bcrypt.genSaltSync(10);

  //hashing the salted password sent from the frontend
  const hashPassword = await bcrypt.hash(password, salt);
  console.log(hashPassword);

  //validating if the new user email already exist
  const checkNewUserEmail = await userModel.findOne({ email: others.email });
  if (checkNewUserEmail) {
    return res.status(409).json("User Already Exist");
  }
  //if user doesn't, using try and catch, save the user information or catch any error that occurs
  try {
    const newUser = new userModel({ password: hashPassword, ...others });
    await newUser.save();
    return res.status(200).json("Account created Successfully");
  } catch (error) {
    return res.status(400).json("Unable to create account");
  }
};

//function to login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json("Please provide valid credentials");
  }

  //Checking if user exist
  const validateUser = await userModel.findOne({ email });
  if (!validateUser) {
    return res
      .status(200)
      .json("User does not exist: Please create an account");
  }

  //Validate if password matches user password
  const validatePassword = bcrypt.compareSync(password, validateUser.password);
  if (!validatePassword) {
    return res.status(404).json("Invalid Password");
  }

  //authenticating jwt token
  const token = jwt.sign({ id: validateUser.id }, process.env.JWT_SECRET);
  console.log(token);

  //If all validations are met, return the user web page
  return res
    .cookie("token", token, { httpOnly: true })
    .status(200)
    .json(validateUser);
};

//Function to update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, ...others } = req.body;

  try {
    //finding the post to be updated
    const user = await userModel.findByIdAndUpdate(
      id,
      { firstName, ...others },
      { new: true }
    );
    if (!user) {
      return res.status(404).json("User not found");
    }
    return res.status(200).json("User Updated successfully");
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

//Function to Delete a User
const deleteUser = async (req, res) => {
  
}

module.exports = { createUser, loginUser, updateUser };
