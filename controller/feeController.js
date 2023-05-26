const Fee = require("../model/feeModel");

const createFeeStructure = async (req, res) => {
  // try {
  //   const { collegeId, courseId, fees } = req.body;

  //   const feeStructure = await Fee.create({
  //     college: collegeId,
  //     course: courseId,
  //     fees,
  //   });

  //   res.status(201).json({ feeStructure });
  // } catch (error) {
  //   console.error("Error creating fee structure:", error);
  //   res.status(500).json({ error: "Error creating fee structure" });
  // }
};

module.exports = { createFeeStructure };
