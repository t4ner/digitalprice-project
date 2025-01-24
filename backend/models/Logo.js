const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Her kullanıcı için tek logo olmasını sağla
logoSchema.statics.updateLogo = async function (userId, fileInfo) {
  const logo = await this.findOne({ userId });
  if (logo) {
    // Mevcut logoyu güncelle
    logo.filename = fileInfo.filename;
    logo.fileId = fileInfo.fileId;
    logo.contentType = fileInfo.contentType;
    logo.updatedAt = Date.now();
    return await logo.save();
  } else {
    // Yeni logo oluştur
    return await this.create({
      userId,
      filename: fileInfo.filename,
      fileId: fileInfo.fileId,
      contentType: fileInfo.contentType,
    });
  }
};

module.exports = mongoose.model("Logo", logoSchema);
