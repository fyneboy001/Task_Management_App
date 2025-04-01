const userModel = require("../Model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleError = (res, message, status = 400) =>
  res.status(status).json({ error: message });

// Create a new user function
const createUser = async (req, res) => {
  try {
    // Destructuring request body to get user input
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return handleError(res, "All fields are required");
    }

    // Check password length
    if (password.length < 8) {
      return handleError(
        res,
        "Password must be at least 8 characters long",
        403
      );
    }

    // Ensure password and confirmPassword match
    if (password !== confirmPassword) {
      return handleError(res, "Passwords do not match");
    }

    // Check if user with the same email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return handleError(res, "User already exists", 409);
    }

    // Hash password before saving it in the database
    const salt = await bcrypt.genSalt(10); // Generate salt for hashing
    // const hashedPassword = await bcrypt.hash(password, salt); // Hash password

    // Create new user instance with hashed password
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    await newUser.save(); // Save user to the database

    return res
      .status(201)
      .json({ message: "User account created successfully" });
  } catch (error) {
    console.error(error);
    return handleError(res, "Unable to create account", 500);
  }
};

//function to login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return handleError(res, "Please provide valid credentials");
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return handleError(res, "User not found: Please create an account", 404);
    }

    // Compare input password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return handleError(res, "Invalid Password", 400);
    }

    // Generate JWT token with user ID as payload
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in HTTP-only cookie for security
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .status(200)
      .json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    return handleError(res, "Something went wrong", 500);
  }
};

//Function to update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, ...others } = req.body;

  try {
    //finding the post to be updated
    const user = await userModel.findByIdAndUpdate(
      { postId: id },
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
  try {
    const { token } = req.cookies; // Extract token from cookies
    if (!token) return handleError(res, "Unauthorized", 401); // Ensure token is present

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token
    if (!decoded.id) return handleError(res, "Invalid token", 401); // Ensure valid user ID

    await userModel.findByIdAndDelete(decoded.id); // Delete user from database

    return res
      .status(200)
      .json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error(error);
    return handleError(res, "Something went wrong", 500);
  }
};

module.exports = { createUser, loginUser, updateUser, deleteUser };
