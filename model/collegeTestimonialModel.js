const mongoose = require("mongoose");

const collegeTestimonialSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const collegeTestimonial = mongoose.model(
  "College_Testimonial",
  collegeTestimonialSchema
);

module.exports = collegeTestimonial;
