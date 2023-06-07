const exprss = require("express");
const controller = require("../controller/blogController");
const router = exprss.Router();

// Blogs page
router.get("/blogs", controller.blogsPage);

// Blogs Detail page
router.get("/blogsDetail", controller.blogsDetailPage);

// Create a new blog
router.post("/blog", controller.createBlog);

// Get all blogs
router.get("/blog", controller.getAllBlogs);

// Get a single blog by ID
router.get("/blog/:id", controller.getBlogById);

// Update a blog
router.put("/blog/:id", controller.updateBlog);

// Delete a blog
router.delete("/blog/:id", controller.deleteBlog);

module.exports = router;
