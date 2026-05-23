//add Users
const Users = require("../model/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//{}=req.body; = object destructuring -- individual variables to be stored

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      city,
      userType,
      state,
      zipCode,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    //storing in the new object called as newUser
    const newUser = {
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      address: address,
      city: city,
      userType: userType,
      state: state,
      zipCode: zipCode,
    };
    await Users.create(newUser);
    res.status(200).json({ message: "Register Successfully" });
  } catch (error) {
    res.status(500).json({ message: "failed to register", err: error });
  }
};

//get all users
const getUsers = async (req, res) => {
  try {
    // .find({}) fetches all documents from the collection
    // Note: If you are using Mongoose, use .find({}). If using raw MongoDB driver, use .find({}).toArray()

    const allUsers = await Users.find();

    res.status(200).json({
      message: "Users fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", err: error });
  }
};

//login handler
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await Users.findOne({ email: username });

    //generate jwt new token
    const token = await jwt.sign(
      {
        id: foundUser._id,
        role: foundUser.userType,
        email: username,
        password: password,
      },
      process.env.SECRETE_KEY,
      { notBefore: "10s", expiresIn: "60M" },
    );
    // console.log("generated Token :", token);
    const hashedPassword = await bcrypt.compare(password, foundUser.password);
    if (!hashedPassword) {
      res.status(401).json({ message: "invalid password" });
    }
    res
      .status(202)
      .json({
        message: "login successfull",
        token,
        id: foundUser._id,
        email: foundUser.email,
        role: foundUser.userType,
      });
  } catch (error) {
    res.status(500).json({ message: "username not found" });
  }
};

//get user based on id
const getUserBasedonId = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    res.status(200).json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", err: error });
  }
};

//update Profile
const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await Users.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json({ message: "update successfully", updatedProfile });
  } catch (error) {
    res.status(500).json({ message: "failed to update profile", err: error });
  }
};

//forget password
const forgetPassword = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    await Users.findOneAndUpdate(
      { email: req.body.email },
      { password: hashedPassword },
      { new: true },
    );
    res.status(200).json({ message: "password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "failed to update password", err: error });
  }
};

module.exports = {
  register,
  getUsers,
  login,
  forgetPassword,
  updateProfile,
  getUserBasedonId,
};
