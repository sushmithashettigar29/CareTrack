const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const fields = {
      Admin: ["name", "email", "phone", "role", "createdAt", "updatedAt"],
      Patient: [
        "name",
        "email",
        "phone",
        "age",
        "gender",
        "role",
        "createdAt",
        "updatedAt",
      ],
      Doctor: [
        "name",
        "email",
        "phone",
        "age",
        "gender",
        "role",
        "specialization",
        "isApproved",
        "createdAt",
        "updatedAt",
      ],
    };

    if (fields[user.role]) {
      const userProfile = fields[user.role].reduce((acc, field) => {
        acc[field] = user[field];
        return acc;
      }, {});
      return res.status(200).json(userProfile);
    }
    return res.status(400).json({ message: "Invalid role" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone, age, gender, specialization } = req.body;

    // Basic updates
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (age) user.age = age;
    if (gender) user.gender = gender;

    // Doctor-specific field
    if (user.role === "Doctor" && specialization) {
      user.specialization = specialization;
    }

    const updatedUser = await user.save();
    const { password, ...userWithoutPassword } = updatedUser._doc;

    res.status(200).json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
