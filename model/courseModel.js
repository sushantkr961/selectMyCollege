const mongoose = require("mongoose");

// Define the Course schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  attrs: [{ key: { type: String }, value: [{ type: String }] }],
});

// Create the Course model
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
