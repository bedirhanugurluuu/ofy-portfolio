const express = require("express");
const router = express.Router();

router.get("/me", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Yetkisiz" });
  }

  // İstersen burda DB’den kullanıcı bilgilerini çekebilirsin
  // Şimdilik sadece ID gönderiyoruz
  res.json({ user: { id: req.session.userId } });
});

module.exports = router;
