const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Yetkilendirme hatası" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // userId'yi doğrudan req.userId olarak saklayalım
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Geçersiz token" });
  }
};

module.exports = auth;
