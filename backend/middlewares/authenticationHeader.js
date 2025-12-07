const User = require("../Models/user");
const jwt = require("jsonwebtoken");

const authenticationHeader = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
     throw new Error("Authontication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, name: decoded.name };
    next();
  } catch (error) {
    throw new Error("Authontication Invalid");
  }
};

module.exports = authenticationHeader;