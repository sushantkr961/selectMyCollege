const mongoose = require("mongoose");

const stateSchema = mongoose.Schema(
  {
    stateName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "India",
    },
  },
  {
    timestamps: true,
  }
);

const State = mongoose.models.State || mongoose.model("State", stateSchema);

module.exports = State;
