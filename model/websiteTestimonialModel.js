const mongoose = require("mongoose");

const websiteTestimonialSchema = new mongoose.Schema(
  {
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

const websiteTestimonial = mongoose.model(
  "Website_Testimonial",
  websiteTestimonialSchema
);

module.exports = websiteTestimonial;
