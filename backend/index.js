require('dotenv').config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const csurf = require("csurf");
const pool = require("./db"); // DB bağlantısı (mysql2/promise pool)
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const app = express();

const allowedOrigins = [
  "http://localhost:3000", // Next.js
  "http://localhost:5173", // Vite / Panel
];

// CORS sadece burada, bir kez
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-CSRF-Token'],
}));

app.use(cookieParser());

// Session ayarları
app.use(session({
  secret: "gizli_string", // güvenli bir key
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // üretimde true + https olmalı
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 1 gün
  }
}));

app.use(express.json());

app.use('/uploads', express.static('uploads'));

// CSRF koruması middleware (login/logout hariç)
const csrfProtection = csurf();

app.use((req, res, next) => {
  if (req.path === "/api/login" || req.path === "/api/logout" || req.path === "/api/csrf-token" || req.path === "/api/me") {
    next();
  } else {
    csrfProtection(req, res, next);
  }
});

// CSRF token endpoint (frontend bu tokenı alacak)
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.get("/api/test", (req, res) => {
  console.log("Test endpoint çalıştı!");
  res.json({ message: "Test başarılı" });
});

async function getUserById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
}

app.get("/api/me", verifyToken, async (req, res) => {
  // req.user var
  const userId = req.user.id;
  const user = await getUserById(userId); // veritabanından çek
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ user: { id: user.id, username: user.username } });
});

const projectRoutes = require("./routes/projects");
app.use("/api/projects", (req, res, next) => {
  console.log("Projects route called:", req.method, req.originalUrl);
  next();
}, projectRoutes);

app.get('/api/projects/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE slug = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

const authRouter = require("./routes/auth");
app.use("/api", authRouter);

// Routes
const introBannersRouter = require("./routes/introBanners");
app.use("/api/intro-banners", introBannersRouter);

// Kullanıcı sorgulama fonksiyonu
async function getUserByUsername(username) {
  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
  return rows[0];
}

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Eksik alanlar" });

  try {
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).json({ error: "Kullanıcı bulunamadı" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Şifre hatalı" });

    // JWT oluştur
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Token'ı döndür
    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});


function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "Token yok" });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Token eksik" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token geçersiz" });
    req.user = decoded; // decoded içinde id ve username var
    next();
  });
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET environment değişkeni tanımlı değil!");
  process.exit(1); // Sunucuyu durdurabilirsin
}

app.use("/api/projects", verifyToken, projectRoutes);

// Logout endpoint
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Çıkış yapıldı" });
  });
});

// Auth kontrol middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.status(401).json({ error: "Yetkisiz" });
}

// Korunan endpoint örneği
app.get("/api/protected", isAuthenticated, (req, res) => {
  res.json({ message: "Giriş yapılmış", user: req.session.user });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
