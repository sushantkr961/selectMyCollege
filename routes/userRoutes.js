const express = require("express");
const router = express.Router();
const controller = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Register a new user
router.get("/admin/register", authMiddleware, controller.registerView);
router.post("/admin/register", authMiddleware, controller.register);

// Login a user
router.get("/login", controller.loginView);
router.post("/login", controller.login);

// Logout a user
router.get("/logout", controller.logout);

router.get("/admin/allAdmin", authMiddleware, controller.allAdmin);

router.delete("/admin/deladmin/:id", authMiddleware, controller.deleteAdmin);

module.exports = router;
