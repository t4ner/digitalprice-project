const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const Logo = require("../models/Logo");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const {
  uploadToGridFS,
  getFileFromGridFS,
  deleteFromGridFS,
} = require("../utils/gridfs");
const mongoose = require("mongoose");

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

// Multer konfigürasyonu - artık dosyaları bellekte tutacağız
const storage = multer.memoryStorage();
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

// Servis silme route'u ekle
router.delete("/services/:id", auth, async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!service) {
      return res.status(404).json({ message: "Service nicht gefunden" });
    }

    await Service.deleteOne({ _id: req.params.id });
    res.json({ message: "Service erfolgreich gelöscht" });
  } catch (error) {
    console.error("Service silme hatası:", error);
    res.status(500).json({ message: error.message });
  }
});

// Logo yükleme/güncelleme
router.post("/upload-logo", [auth, upload.single("logo")], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Keine Datei hochgeladen" });
    }

    // Eski logoyu bul
    const oldLogo = await Logo.findOne({ userId: req.userId });

    // Yeni logoyu GridFS'e yükle
    const fileInfo = await uploadToGridFS(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Logo'yu güncelle veya oluştur
    const updatedLogo = await Logo.updateLogo(req.userId, fileInfo);

    // Eski logo dosyasını GridFS'den sil (varsa)
    if (oldLogo) {
      try {
        await deleteFromGridFS(oldLogo.fileId);
      } catch (error) {
        console.error("Eski logo silinirken hata:", error);
      }
    }

    res.status(200).json(updatedLogo);
  } catch (error) {
    console.error("Logo yükleme hatası:", error);
    res.status(400).json({ message: error.message });
  }
});

// Logo getirme route'u
router.get("/logo/:fileId", async (req, res) => {
  try {
    const downloadStream = getFileFromGridFS(
      new mongoose.Types.ObjectId(req.params.fileId)
    );

    downloadStream.on("error", (error) => {
      console.error("Logo getirme hatası:", error);
      res.status(404).json({ message: "Logo nicht gefunden" });
    });

    res.set("Content-Type", "image/*");
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Logo getirme hatası:", error);
    res.status(500).json({ message: error.message });
  }
});

// Logo silme route'u
router.delete("/logo", auth, async (req, res) => {
  try {
    const logo = await Logo.findOne({ userId: req.userId });

    if (!logo) {
      return res.status(404).json({ message: "Logo nicht gefunden" });
    }

    // GridFS'den dosyayı sil
    await deleteFromGridFS(logo.fileId);

    // Veritabanından logo kaydını sil
    await Logo.deleteOne({ _id: logo._id });

    res.json({ message: "Logo erfolgreich gelöscht" });
  } catch (error) {
    console.error("Logo silme hatası:", error);
    res.status(500).json({ message: error.message });
  }
});

// Kullanıcının logosunu getir
router.get("/user-logo", auth, async (req, res) => {
  try {
    const logo = await Logo.findOne({ userId: req.userId });
    res.json(logo || null);
  } catch (error) {
    console.error("Logo bilgisi getirme hatası:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
