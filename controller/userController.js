const User = require("../model/userModel");

const allAdmin = async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin/allAdmin", {
      users,
      title: "selectMyCollege",
      message: req.session.message,
    });
    req.session.message = null;
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Failed to fetch users",
    };
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
      req.session.message = {
        type: "danger",
        message: "Username already exists",
      };
      return res.redirect("/admin/register");
    }
    let role = "user";
    if (adminRole) {
      role = "admin";
    }
    const newUser = new User({
      username,
      password,
      role,
    });
    await newUser.save();

    req.session.message = {
      type: "success",
      message: "Admin Created successfully",
    };
    res.redirect("/admin/allAdmin");
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Registration failed",
    };
    res.redirect("/admin/register");
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
      req.session.message = {
        type: "danger",
        message: "Invalid username or password",
      };
      return res.redirect("/login");
    }
    if (user.password !== password) {
      req.session.message = {
        type: "danger",
        message: "Invalid username or password",
      };
      return res.redirect("/login");
    }
    req.session.isAuthenticated = true;
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };
    res.redirect("/admin/dashboard");
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Login failed",
    };
    res.redirect("/login");
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    req.session.message = {
      type: "success",
      message: "User deleted successfully",
    };
    res.redirect("/admin/allAdmin");
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Failed to delete user",
    };
    res.redirect("/admin/allAdmin");
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
