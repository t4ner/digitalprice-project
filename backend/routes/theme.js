const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Service = require("../models/Service");
const Logo = require("../models/Logo");
const SocialMedia = require("../models/SocialMedia");
const BusinessName = require("../models/BusinessName");

// Kullanıcı bilgilerini username'e göre getir
router.get("/theme/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Kullanıcıyı bul
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    // Kullanıcının servislerini getir
    const services = await Service.find({ userId: user._id });

    // Kullanıcının logosunu getir
    const logo = await Logo.findOne({ userId: user._id });

    // Kullanıcının sosyal medya bilgilerini getir
    const socialMedia = await SocialMedia.findOne({ userId: user._id });

    // İşletme adını getir
    const businessName = await BusinessName.findOne({ userId: user._id });

    // Tüm bilgileri bir araya getir
    const themeData = {
      user: {
        name: user.name,
        username: user.username,
        businessName: businessName?.businessName,
      },
      services,
      logo,
      socialMedia: socialMedia || {
        phone: "",
        whatsapp: "",
        instagram: "",
        googleMaps: "",
        address: "",
        businessHours: {
          monday: { open: "", close: "" },
          tuesday: { open: "", close: "" },
          wednesday: { open: "", close: "" },
          thursday: { open: "", close: "" },
          friday: { open: "", close: "" },
          saturday: { open: "", close: "" },
          sunday: { open: "", close: "" },
        },
      },
    };

    res.json(themeData);
  } catch (error) {
    console.error("Theme data fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
