const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Her kullanıcı için tek logo olmasını sağla
logoSchema.statics.updateLogo = async function (userId, imageUrl) {
  const logo = await this.findOne({ userId });
  if (logo) {
    // Mevcut logoyu güncelle
    logo.imageUrl = imageUrl;
    logo.updatedAt = Date.now();
    return await logo.save();
  } else {
    // Yeni logo oluştur
    return await this.create({ userId, imageUrl });
  }
};

module.exports = mongoose.model("Logo", logoSchema);
