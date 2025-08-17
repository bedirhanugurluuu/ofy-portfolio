const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/me", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Yetkisiz" });
  }

  // İstersen burda DB’den kullanıcı bilgilerini çekebilirsin
  // Şimdilik sadece ID gönderiyoruz
  res.json({ user: { id: req.session.userId } });
});

  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}


