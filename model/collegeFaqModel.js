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

const FAQc = mongoose.model("College_FAQ", clgFaqSchema);

module.exports = FAQc;
