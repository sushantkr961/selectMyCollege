const mongoose = require("mongoose");

const feeSchema = mongoose.Schema({
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  fees: [
    {
      key: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
});

const Course = mongoose.models.Fee || mongoose.model("Fee", feeSchema);

module.exports = Course;
