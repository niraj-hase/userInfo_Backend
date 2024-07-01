const User = require("../model/User");
const InvalidToken = require("../model/InvalidatedToken");
const jwt = require("jsonwebtoken");

// create new user function
module.exports.createUser = async (req, res) => {
  console.log(req.body);

  try {
    const { name, dob, email, password, confirmPassword, isAdmin } = req.body;

    if (password !== confirmPassword) {
      console.log("Password and conform password does not match");
      return res.status(400).json({
        success: false,
        message: "Password and conform password does not match",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      const createdUser = await User.create({
        name: name,
        dob: dob,
        email: email,
        password: password,
        isAdmin: isAdmin,
      });
      return res.status(201).json({
        success: true,
        message: "user created successfully",
        data: createdUser,
      });
    } else {
      console.log("email already present...");

      return res.status(401).json({
        success: false,
        message: "email id already present..",
      });
    }
  } catch (err) {
    console.log("Error in creating new user:::", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    "something",
    {
      expiresIn: "1h",
    }
  );
}

// login function
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("user does not exits with email");
      return res.status(401).json({
        success: false,
        message: "User does not present with this email",
      });
    }

    if (user.password !== password) {
      console.log("invalid password");
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "user logged successfully..",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.log("Error in user login :::", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

// logout function
module.exports.logout = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(400).json({
      success: false,
      message: "No token provided or malformed",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token not provided",
    });
  }

  try {
    await new InvalidToken({ token }).save();
    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (err) {
    console.log("Error during logout:::", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// user details
module.exports.userDetails = async (req, res) => {
  try {
    const userList = await User.find({});

    if (!userList) {
      console.log("Error in finding users in db");
      return res.status(401).json({
        success: false,
        message: "does not found in user to display",
      });
    }
    return res.status(201).json({
      success: true,
      message: "all users fetch successfully",
      data: userList,
    });
  } catch (err) {
    console.log("Error in displaying user list", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update user
module.exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, password, dob } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, password, dob },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// delete user
module.exports.deleteUser = async (req, res) => {
  const {id} = req.params;
  console.log(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User Not found",
      });
    }
    res.status(201).json({
       success:true,
       message: "User deleted successfully" 
      });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
