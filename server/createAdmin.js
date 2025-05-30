const User = require("./models/User");

const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "Admin" });
    if (!existingAdmin) {
      const adminUser = new User({
        name: "Admin User",
        email: "adminuser@gmail.com",
        phone: "9834729450",
        password: "adminuser",
        role: "Admin",
      });
      await adminUser.save();
      console.log("Admin user created successfully");
    } else {
      console.log("Admin User already exists.");
    }
  } catch (error) {
    console.error("Error creating Admin", error.message);
  }
};

module.exports = createAdminUser;
