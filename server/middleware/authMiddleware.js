const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Not authorized, no Token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token failed" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

const doctorOnly = (req, res, next) => {
  if (req.user && req.user.role === "Doctor") {
    next();
  } else {
    res.status(403).json({ message: "Doctor access only" });
  }
};

const patientOnly = (req, res, next) => {
  if (req.user && req.user.role === "Patient") {
    next();
  } else {
    res.status(403).json({ message: "Patient access only" });
  }
};
module.exports = { protect, adminOnly, doctorOnly, patientOnly };
