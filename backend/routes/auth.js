const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "E-Mail oder Passwort falsch" });
    }

    // Şifreyi kontrol et
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "E-Mail oder Passwort falsch" });
    }

    // JWT token oluştur
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // User bilgisini password olmadan gönder
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    res.json({
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Fehler" });
  }
});

// Register route (test için)
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, username } = req.body;

    // Email ve username kullanımda mı kontrol et
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ message: "Diese E-Mail ist bereits registriert" });
      }
      if (existingUser.username === username) {
        return res
          .status(400)
          .json({ message: "Dieser Benutzername ist bereits vergeben" });
      }
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      email,
      password,
      name,
      username,
    });

    await user.save();

    // JWT token oluştur
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // User bilgisini password olmadan gönder
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
    };

    res.status(201).json({
      message: "Benutzer erfolgreich erstellt",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Fehler" });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Nicht autorisiert" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Ungültiger Token" });
  }
});

module.exports = router;
