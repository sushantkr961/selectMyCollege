const exprss = require("express");
const controller = require("../controller/blogController");
const router = exprss.Router();

// Blogs page
router.get("/blogs", controller.blogsPage);

// Blogs Detail page
router.get("/blogsDetail", controller.blogsDetailPage);

// Create a new blog
router.post("/admin/blog", controller.createBlog);

// Get all blogs
router.get("/blog", controller.getAllBlogs);

// Get a single blog by ID
router.get("/blog/:id", controller.getBlogById);

// Update a blog
router.put("/admin/blog/:id", controller.updateBlog);

// Delete a blog
router.delete("/admin/blog/:id", controller.deleteBlog);

module.exports = router;
