const mongoose = require("mongoose");

const citySchema = mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
    },
  }
);

const City = mongoose.models.City || mongoose.model("City", citySchema);

module.exports = City;
