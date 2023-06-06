const express = require("express");
const router = express.Router();
const controller = require("../controller/userController");

// Register a new user
router.get("/register", controller.registerView);
router.post("/register", controller.register);

// Login a user
router.get("/login", controller.loginView);
router.post("/login", controller.login);

// Logout a user
router.get("/logout", controller.logout);

router.get("/allAdmin", controller.allAdmin);

router.delete("/admin/:id", controller.deleteAdmin);

module.exports = router;
