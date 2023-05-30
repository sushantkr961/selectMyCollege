const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    feeStructures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fee",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);

module.exports = Course;
