const City = require("../model/cityModel");

const getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    console.error("Error retrieving cities:", error);
    res.status(500).json({ error: "Error retrieving cities" });
  }
};

const getCityById = async (req, res) => {
  const { id } = req.params;
  try {
    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }
    res.json(city);
  } catch (error) {
    console.error("Error retrieving city:", error);
    res.status(500).json({ error: "Error retrieving city" });
  }
};

const createCity = async (req, res) => {
  try {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ error: "City name is required" });
    }
    const existingCity = await City.findOne({ cityName });
    if (existingCity) {
      return res.status(409).json({ error: "City already exists" });
    }
    const newCity = await City.create({ cityName });
    res
      .status(201)
      .json({ message: "City created successfully", city: newCity });
  } catch (error) {
    console.error("Error creating city:", error);
    res.status(500).json({ error: "Failed to create city" });
  }
};

const updateCity = async (req, res) => {
  try {
    const cityId = req.params.id;
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ error: "City name is required" });
    }
    const updatedCity = await City.findByIdAndUpdate(
      cityId,
      { cityName },
      { new: true }
    );
    if (!updatedCity) {
      return res.status(404).json({ error: "City not found" });
    }
    return res
      .status(200)
      .json({ message: "City updated successfully", city: updatedCity });
  } catch (error) {
    console.error("Error updating city:", error);
    return res.status(500).json({ error: "Failed to update city" });
  }
};

const deleteCity = async (req, res) => {
  try {
    const cityId = req.params.id;
    const deletedCity = await City.findByIdAndRemove(cityId);
    if (!deletedCity) {
      return res.status(404).json({ error: "City not found" });
    }
    return res
      .status(200)
      .json({ message: "City deleted successfully", city: deletedCity });
  } catch (error) {
    console.error("Error deleting city:", error);
    return res.status(500).json({ error: "Failed to delete city" });
  }
};

module.exports = {
  createCity,
  updateCity,
  deleteCity,
  getAllCities,
  getCityById,
};
