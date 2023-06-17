const mongoose = require("mongoose");

const webFaqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FAQ = mongoose.model("website_FAQ", webFaqSchema);

module.exports = FAQ;
