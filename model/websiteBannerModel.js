const mongoose = require("mongoose");

const gallerySchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner =
  mongoose.models.Banner || mongoose.model("Banner", gallerySchema);

module.exports = Banner;
