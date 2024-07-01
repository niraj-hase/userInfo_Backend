const jwt = require("jsonwebtoken");
const User = require("../model/User");
const InvalidToken = require('../model/InvalidatedToken');

module.exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')){
    return res.status(401).json({
      success: false,
      message: "Access token not provided or malformed",
    });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token not provided",
    });
  }

  const invalidatedToken = await InvalidToken.findOne({ token });
  if (invalidatedToken) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  jwt.verify(token, "something", async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    try {
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      req.user = user;
      next();
    } catch (err) {
      console.log("Error in verifying token:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });
};
