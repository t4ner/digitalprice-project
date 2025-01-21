const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const Logo = require("../models/Logo");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Nicht autorisiert" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Ungültiger Token" });
  }
};

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Servis ekleme
router.post("/services", auth, async (req, res) => {
  try {
    const service = new Service({
      name: req.body.name,
      price: req.body.price,
      userId: req.userId,
    });

    await service.save();
    res.status(201).json(service);
  } catch (error) {
    console.error("Service creation error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Servisleri getirme
router.get("/services", auth, async (req, res) => {
  try {
    const services = await Service.find({ userId: req.userId });
    res.json(services);
  } catch (error) {
    console.error("Service fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Logo yükleme/güncelleme
router.post(
  "/upload-logo",
  [authMiddleware, upload.single("logo")],
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Keine Datei hochgeladen" });
      }

      // Eski logoyu bul
      const oldLogo = await Logo.findOne({ userId: req.userId });

      // Yeni logo yolu
      const newImageUrl = `/uploads/${req.file.filename}`;

      // Logo'yu güncelle veya oluştur
      const updatedLogo = await Logo.updateLogo(req.userId, newImageUrl);

      // Eski logo dosyasını sil (varsa)
      if (oldLogo) {
        const oldFilePath = path.join(__dirname, "..", oldLogo.imageUrl);
        try {
          await fs.unlink(oldFilePath);
        } catch (error) {
          console.error("Eski logo dosyası silinirken hata:", error);
        }
      }

      res.status(200).json(updatedLogo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Kullanıcının logosunu getir
router.get("/logo", authMiddleware, async (req, res) => {
  try {
    const logo = await Logo.findOne({ userId: req.userId });
    res.json(logo || { imageUrl: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logo silme route'u
router.delete("/logo", authMiddleware, async (req, res) => {
  try {
    // Kullanıcının logosunu bul
    const logo = await Logo.findOne({ userId: req.userId });

    if (!logo) {
      return res.status(404).json({ message: "Logo nicht gefunden" });
    }

    // Dosyayı fiziksel olarak sil
    const filePath = path.join(__dirname, "..", logo.imageUrl);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Logo dosyası silinirken hata:", error);
    }

    // Veritabanından logo kaydını sil
    await Logo.deleteOne({ _id: logo._id });

    res.json({ message: "Logo erfolgreich gelöscht" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
