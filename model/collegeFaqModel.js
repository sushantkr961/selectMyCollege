const mongoose = require("mongoose");

const clgFaqSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
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

const FAQ = mongoose.model("FAQ", clgFaqSchema);

module.exports = FAQ;
