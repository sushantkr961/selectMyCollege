const express = require("express");
const controller = require("../controller/blogController");
const upload = require("../middleware/multerConfig");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Blogs page
router.get("/blogs", controller.blogsPage);

// Get a single blog by ID
router.get("/blog/:id", controller.getBlogById);

router
  .route("/admin/addColleges/next/blog/:id")
  .get(authMiddleware, controller.updateBlogView)
  .post(authMiddleware, upload.single("image"), controller.updateBlog)
  .delete(authMiddleware, controller.deleteBlog);

router
  .route("/admin/addColleges/next/blog")
  .get(authMiddleware, controller.createBlogView)
  .post(authMiddleware, upload.single("image"), controller.createBlog);

// Get all blogs
router.get("/admin/allblog", authMiddleware, controller.getAllBlogs);

module.exports = router;
