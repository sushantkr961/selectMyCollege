const express = require("express");
const router = express.Router();
const controller = require("../controller/userController");

// Register a new user
router.get("/admin/register", controller.registerView);
router.post("/admin/register", controller.register);

// Login a user
router.get("/login", controller.loginView);
router.post("/login", controller.login);

// Logout a user
router.get("/logout", controller.logout);

router.get("/admin/allAdmin", controller.allAdmin);

router.delete("/admin/deladmin/:id", controller.deleteAdmin);

module.exports = router;
