const mongoose = require("mongoose");

// Define the College schema
const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  courseType: {
    type: String,
    required: true,
  },
  facilities: [
    {
      type: String,
    },
  ],
  alumniReviews: [
    {
      name: {
        type: String,
        required: true,
      },
      review: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
    },
  ],
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

// Create the College model
const College = mongoose.model("College", collegeSchema);

module.exports = College;
