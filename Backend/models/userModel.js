const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  role: { type: String, enum: ["farmer", "moderator", "admin"], default: "farmer" },
  location: {
    region: { type: String, required: [true, "Region required"] },
    zone: { type: String, required: [true, "Zone required"] },
    woreda: { type: String, required: [true, "Woreda required"] },
    coordinates: {
      lat: { type: Number }, // Latitude
      lon: { type: Number }  // Longitude
    }
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is not modified

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare Password (for login)
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
