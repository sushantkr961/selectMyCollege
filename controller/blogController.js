const Blog = require("../model/blogModel");

const blogsPage = async (req, res) => {
  res.render("blogs", { title: "selectmycollege" });
};

const blogsDetailPage = async (req, res) => {
  res.render("blogsDetail", { title: "selectmycollege" });
};

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, content, author, description } = req.body;
    const newBlog = await Blog.create({ title, content, author, description });
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog", error });
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs", error });
  }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blog", error });
  }
};

// Update a blog by ID
const updateBlog = async (req, res) => {
  try {
    const { title, content, author, description } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, author, description },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res
      .status(200)
      .json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog", error });
  }
};

// Delete a blog by ID
const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog", error });
  }
};

module.exports = {
  blogsPage,
  blogsDetailPage,
  createBlog,
  deleteBlog,
  updateBlog,
  getAllBlogs,
  getBlogById,
};
