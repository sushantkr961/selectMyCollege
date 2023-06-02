const mongoose = require("mongoose");

const gallerySchema = mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    banners: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Gallery =
  mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);

module.exports = Gallery;
