const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    role: {
      type: String,
      enum: ["Patient", "Doctor", "Admin"],
      default: "Patient",
    },
    specialization: { type: String },
    isApproved: { type: Boolean, default: false }, // For doctors only
    isRejected: { type: Boolean, default: false }, // <-- Add this line
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Remove doctor-specific fields if not Doctor
  if (this.role !== "Doctor") {
    this.isApproved = undefined;
    this.isRejected = undefined; // <-- Reset for non-doctors
    this.specialization = undefined;
  }

  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

module.exports = mongoose.model("User", userSchema);
