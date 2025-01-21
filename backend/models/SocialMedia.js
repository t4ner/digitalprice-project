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
});

module.exports = mongoose.model("SocialMedia", socialMediaSchema);
