const bcrypt = require("bcrypt");
const User = require("../model/userModel");

const allAdmin = async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin/allAdmin", { users, title: "selectMyCollege" });
  } catch (error) {
    // req.flash('message', 'Failed to fetch users');
    res.redirect("/login");
  }
};

const registerView = async (req, res) => {
  res.render("admin/addAdmin", { title: "selectMyCollege" });
};

const register = async (req, res) => {
  const { username, password, adminRole } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // req.flash("message", "Username already exists");
      return res.redirect("/register");
    }

    // Set the default role
    let role = "user";

    // Check if the adminRole checkbox is checked
    if (adminRole) {
      role = "admin";
    }

    // Create a new user
    const newUser = new User({
      username,
      password,
      role,
    });

    // Save the user to the database
    await newUser.save();

    // req.flash("message", "User registered successfully");
    res.redirect("/login");
  } catch (error) {
    // req.flash("message", "Registration failed");
    res.redirect("/register");
  }
};

const loginView = async (req, res) => {
  res.render("login", { title: "selectMyCollege" });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    req.session.isAuthenticated = true;
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };
    res.redirect("/admin");
    // res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    // req.flash("message", "User deleted successfully");
    res.redirect("/allAdmin");
  } catch (error) {
    // req.flash("message", "Failed to delete user");
    res.redirect("/allAdmin");
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

module.exports = {
  register,
  login,
  logout,
  loginView,
  registerView,
  allAdmin,
  deleteAdmin,
};
