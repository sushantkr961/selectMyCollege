const Banner = require("../model/bannerModel");

const createBanner = async (req, res) => {
  try {
    const { image } = req.file;

    const banner = await Banner.create({ image });

    res.status(201).json({ message: "Banner created successfully", banner });
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createBanner };
