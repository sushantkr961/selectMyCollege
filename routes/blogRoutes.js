const express = require("express");
const controller = require("../controller/blogController");
const upload = require("../middleware/multerConfig");
const router = express.Router();

// Blogs page
router.get("/blogs", controller.blogsPage);

// Blogs Detail page
router.get("/blogsDetail", controller.blogsDetailPage);

// Get a single blog by ID
router.get("/blog/:id", controller.getBlogById);

router
  .route("/admin/addColleges/next/blog/:id")
  .get(controller.updateBlogView)
  .post(upload.single("image"), controller.updateBlog)
  .delete(controller.deleteBlog);

router
  .route("/admin/addColleges/next/blog")
  .get(controller.createBlogView)
  .post(upload.single("image"), controller.createBlog);

// Get all blogs
router.get("/admin/allblog", controller.getAllBlogs);

module.exports = router;
