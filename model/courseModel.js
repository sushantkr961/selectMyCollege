const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    coursetype: {
      type: String,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

module.exports = Course;
