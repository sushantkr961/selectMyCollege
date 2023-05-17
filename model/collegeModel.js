const mongoose = require("mongoose");

// Define the CollegeDetails schema
const collegeDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  establishedYear: {
    type: Number,
    required: true,
  },
  courses: [
    {
      name: String,
      duration: Number,
    },
  ],
  facilities: [String],
  departments: [
    {
      name: String,
      hod: String,
    },
  ],
});

// Create the CollegeDetails model
const CollegeDetails = mongoose.model("CollegeDetails", collegeDetailsSchema);

module.exports = CollegeDetails;
