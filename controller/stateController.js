const State = require("../model/stateModel");

const createState = async (req, res) => {
  try {
    const { stateName } = req.body;
    if (!stateName) {
      return res.status(400).json({ error: "State name is required" });
    }
    const existingState = await State.findOne({ stateName });
    if (existingState) {
      return res.status(409).json({ error: "State already exists" });
    }
    const newState = await State.create({ stateName });
    res
      .status(201)
      .json({ message: "State created successfully", state: newState });
  } catch (error) {
    console.error("Error creating state:", error);
    res.status(500).json({ error: "Failed to create state" });
  }
};

const getAllStates = async (req, res) => {
  try {
    const states = await State.find();
    res.json(states);
  } catch (error) {
    console.error("Error retrieving states:", error);
    res.status(500).json({ error: "Error retrieving states" });
  }
};

const getStateById = async (req, res) => {
  const { id } = req.params;
  try {
    const state = await State.findById(id);
    if (!state) {
      return res.status(404).json({ error: "State not found" });
    }
    res.json(state);
  } catch (error) {
    console.error("Error retrieving state:", error);
    res.status(500).json({ error: "Error retrieving state" });
  }
};

const updateState = async (req, res) => {
  try {
    const stateId = req.params.id;
    const { stateName } = req.body;
    if (!stateName) {
      return res.status(400).json({ error: "State name is required" });
    }
    const updatedState = await State.findByIdAndUpdate(
      stateId,
      { stateName },
      { new: true }
    );
    if (!updatedState) {
      return res.status(404).json({ error: "State not found" });
    }
    return res
      .status(200)
      .json({ message: "State updated successfully", state: updatedState });
  } catch (error) {
    console.error("Error updating state:", error);
    return res.status(500).json({ error: "Failed to update state" });
  }
};

const deleteState = async (req, res) => {
  try {
    const stateId = req.params.id;
    const deletedState = await State.findByIdAndRemove(stateId);
    if (!deletedState) {
      return res.status(404).json({ error: "State not found" });
    }
    return res
      .status(200)
      .json({ message: "State deleted successfully", state: deletedState });
  } catch (error) {
    console.error("Error deleting state:", error);
    return res.status(500).json({ error: "Failed to delete state" });
  }
};

module.exports = {
  createState,
  getAllStates,
  getStateById,
  updateState,
  deleteState,
};
