const mongoose = require("mongoose");

const alumniSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    batch: {
      type: Number,
      required: true,
    },
    package: {
      type: String,
      required: true,
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    avgPackage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Alumni = mongoose.models.Alumni || mongoose.model("Alumni", alumniSchema);

module.exports = Alumni;
