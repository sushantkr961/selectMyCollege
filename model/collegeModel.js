const mongoose = require("mongoose");

// Define the College schema
const collegeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  description: {
    type: String,
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
  clgLogo: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
});

// Create the College model
const College =
  mongoose.models.College || mongoose.model("College", collegeSchema);

module.exports = College;
