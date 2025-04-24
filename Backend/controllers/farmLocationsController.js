const User = require("../models/User"); // Adjust the path as necessary

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
  try {
    const { userId, farmLocationId } = req.body;

    // Find the user by their ID
    const user = await User.findById(userId);

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the farm location by its ID within the user's farmLocations array and remove it
    const farmLocation = user.farmLocations.id(farmLocationId);
    if (farmLocation) {
      farmLocation.remove();
      await user.save();
      return res.status(200).json({ message: "Farm location deleted successfully", farmLocations: user.farmLocations });
    } else {
      return res.status(404).json({ message: "Farm location not found" });
    }
  } catch (error) {
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
