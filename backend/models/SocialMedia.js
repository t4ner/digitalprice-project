const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phone: String,
  whatsapp: String,
  instagram: String,
  googleMaps: String,
  address: String,
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
});

module.exports = mongoose.model("SocialMedia", socialMediaSchema);
