const mongoose = require("mongoose");

const feeSchema = mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    fees: [],
    totalFee: {
      type: Number,
    },
  },
  { toJSON: { virtuals: true } },
  {
    timestamps: true,
  }
);

const Fee = mongoose.models.Fee || mongoose.model("Fee", feeSchema);

module.exports = Fee;
