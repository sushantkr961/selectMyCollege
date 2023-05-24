// Create FeeStructure
const createFeeStructure = async (req, res) => {
  try {
    const { collegeId, courseId, fees } = req.body;

    const feeStructure = new FeeStructure({
      college: collegeId,
      course: courseId,
      fees,
    });

    await feeStructure.save();

    res.status(201).json({ feeStructure });
  } catch (error) {
    console.error("Error creating fee structure:", error);
    res.status(500).json({ error: "Error creating fee structure" });
  }
};
