const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    percouid: {
      type: String,
      default: 0,
    },
    eligibility: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

module.exports = Course;
