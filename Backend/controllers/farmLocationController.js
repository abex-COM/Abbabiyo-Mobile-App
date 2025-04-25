const User = require("../models/userModel"); // Adjust the path as necessary

// Add a new farm location
exports.addFarmLocation = async (req, res) => {
  try {
    const { userId, name, lat, lon } = req.body;

    // Find the user by their ID
    const user = await User.findById(userId);

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the new farm location to the user's farmLocations
    user.farmLocations.push({ name, lat, lon });

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "Farm location added successfully", farmLocations: user.farmLocations });
  } catch (error) {
    return res.status(500).json({ message: "Error adding farm location", error });
  }
};

// Update an existing farm location
exports.updateFarmLocation = async (req, res) => {
  try {
    const { userId, farmLocationId, name, lat, lon } = req.body;

    // Find the user by their ID
    const user = await User.findById(userId);

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the farm location by its ID within the user's farmLocations array
    const farmLocation = user.farmLocations.id(farmLocationId);

    // If the farm location doesn't exist
    if (!farmLocation) {
      return res.status(404).json({ message: "Farm location not found" });
    }

    // Update the farm location's fields
    if (name) farmLocation.name = name;
    if (lat) farmLocation.lat = lat;
    if (lon) farmLocation.lon = lon;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "Farm location updated successfully", farmLocations: user.farmLocations });
  } catch (error) {
    return res.status(500).json({ message: "Error updating farm location", error });
  }
};

// Delete a farm location
exports.deleteFarmLocation = async (req, res) => {
  console.log("Deleting farm location...");
  try {
    const { userId, farmLocationId } = req.params;

    if (!userId || !farmLocationId) {
      return res.status(400).json({ message: "Missing userId or farmLocationId in params" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Pull the farm location from the array using Mongoose's .pull()
    const beforeCount = user.farmLocations.length;
    user.farmLocations.pull({ _id: farmLocationId });

    if (user.farmLocations.length === beforeCount) {
      return res.status(404).json({ message: "Farm location not found" });
    }

    await user.save();

    return res.status(200).json({
      message: "Farm location deleted successfully",
      farmLocations: user.farmLocations,
    });
  } catch (error) {
    console.error("Server error deleting farm:", error);
    return res.status(500).json({ message: "Error deleting farm location", error });
  }
};

// Get all farm locations for a user
exports.getAllFarmLocations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by their ID
    const user = await User.findById(userId);

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's farm locations
    return res.status(200).json({ farmLocations: user.farmLocations });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching farm locations", error });
  }
};
