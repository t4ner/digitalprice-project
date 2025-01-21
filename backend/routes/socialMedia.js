const express = require("express");
const router = express.Router();
const SocialMedia = require("../models/SocialMedia");
const auth = require("../middleware/auth");

// Get social media links
router.get("/social-media", auth, async (req, res) => {
  try {
    const socialMedia = await SocialMedia.findOne({ userId: req.userId });
    if (!socialMedia) {
      return res.json({
        phone: "",
        whatsapp: "",
        instagram: "",
        googleMaps: "",
        userId: req.userId,
      });
    }
    res.json(socialMedia);
  } catch (error) {
    console.error("Social media fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update social media links
router.post("/social-media", auth, async (req, res) => {
  try {
    let socialMedia = await SocialMedia.findOne({ userId: req.userId });

    if (socialMedia) {
      // Varsa güncelle
      socialMedia = await SocialMedia.findOneAndUpdate(
        { userId: req.userId },
        {
          ...req.body,
          userId: req.userId, // user ID'yi korumak için
        },
        { new: true }
      );
    } else {
      // Yoksa yeni kayıt oluştur
      socialMedia = new SocialMedia({
        ...req.body,
        userId: req.userId,
      });
      await socialMedia.save();
    }

    res.json(socialMedia);
  } catch (error) {
    console.error("Social media update error:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
