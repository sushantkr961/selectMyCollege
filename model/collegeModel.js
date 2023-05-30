const mongoose = require("mongoose");

const collegeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    url: {
      type: String,
    },
    description: {
      type: String,
    },
    shortName: {
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
  },
  {
    timestamps: true,
  }
);

// Create the College model
const College =
  mongoose.models.College || mongoose.model("College", collegeSchema);

module.exports = College;
