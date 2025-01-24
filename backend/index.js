const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { initGridFS } = require("./utils/gridfs");
require("dotenv").config();
const BusinessName = require("./models/BusinessName");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantı URL'i
const mongoURI = process.env.MONGODB_URI;

// Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const socialMediaRoutes = require("./routes/socialMedia");
const themeRoutes = require("./routes/theme");
app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", socialMediaRoutes);
app.use("/api", themeRoutes);

// MongoDB'ye bağlan
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB'ye başarıyla bağlandı");
    // GridFS'i başlat
    initGridFS(mongoose.connection.db);
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
  });

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
