const mongoose = require("mongoose");

// Define the Collcourse schema
const collcourseSchema = mongoose.Schema({
  coll_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College", // Referencing the College model
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Referencing the College model
    required: true,
  },
  fee: [{ key: { type: String }, value: { type: String } }],
});

const Collcourse = mongoose.model("Collcourse", collcourseSchema);
module.exports = Collcourse;