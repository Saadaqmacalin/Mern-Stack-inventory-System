const { STATES } = require("mongoose");
const User = require("../Models/user");
const { StatusCodes } = require("http-status-codes");

const registerUser = async (req, res) => {
  try {
    const { name, email, Status, password } = req.body || {};
    if (!name || !email || !Status || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "name email status and passsword must be provided " });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "user already exists" });
    }
    const user = await User.create({ ...req.body });
    const token = await user.createJWT();
    res.status(StatusCodes.OK).json({ message: "User created successfully " });
  } catch (error) {
    console.error("error ocured while registering a user", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ messsage: "Something went wronge while registering a user " });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // password is exlusive that means it won't return
    if (users.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ messsage: "Not found any user" });
    }
    res.status(StatusCodes.OK).json({ totalUsers: users.length, users });
  } catch (error) {
    console.error("error ocured while fetching users", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ Message: "Something went wronge wile fetching users" });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not Found " });
    }
    res.status(StatusCodes.OK).json({ User: user });
  } catch (error) {
    console.error("error ocured while fetching a user", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wronge while fetching a user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, Status } = req.body;
    if (!name && !email && !password && !Status) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "please provide at least one field to update" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, password, Status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "The user you want to Update does not exist" });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "User Updated Succesefully ", user });
  } catch (error) {
    console.error("error ocured while updating  a user", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong while updating the user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "the user you want to delete does not exists" });
    }
    res.status(StatusCodes.OK).json({ message: "User has been deleted", user });
  } catch (error) {
    console.error("Error Ocured while deleting a user", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong while deleting the user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "email and password are needed" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Password is incorrect" });
    }

    const token = await user.createJWT();

    // ✔ INCLUDE STATUS (IMPORTANT!!)
    res.status(StatusCodes.OK).json({
      message: "Login successfully",
      user: {
        name: user.name,
        email: user.email,
        status: user.Status,   // <-- FIXED
        id: user._id
      },
      token,
    });

  } catch (error) {
    console.error("Error occured while logging in:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong while trying to log in" });
  }
};


module.exports = {
  registerUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  login,
};
