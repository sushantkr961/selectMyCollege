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
  courseFee : {
    type: Number,
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
});

// Create the Course model
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
