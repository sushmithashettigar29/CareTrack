const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, age, gender, role, specialization } =
      req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      phone,
      password,
      age,
      gender,
      role,
      specialization,
      ...(role === "Doctor" && { isApproved: false })
    });
    const savedUser = await newUser.save();

    const { password: pwd, ...userWithoutPassword } = savedUser._doc;

    if (role === "Doctor") {
      return res.status(200).json({
        message:
          "Regsitration successful as Patient, You will be approved as Doctor by Admin",
        user: userWithoutPassword,
      });
    }

    res.status(201).json({
      message: "Registration Successful",
      user: userWithoutPassword,
      token: generateToken(savedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const { password: pwd, ...userWithoutPassword } = user._doc;

    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
