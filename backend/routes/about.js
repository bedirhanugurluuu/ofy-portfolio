const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

console.log("About router loaded");

// Tablo yapısını kontrol et
router.get('/check-table', async (req, res) => {
  try {
    const [rows] = await pool.query("DESCRIBE about_content");
    console.log("Tablo yapısı:", rows);
    res.json({ tableStructure: rows });
  } catch (err) {
    console.error("Tablo kontrol hatası:", err);
    res.status(500).json({ error: "Tablo bulunamadı veya hata oluştu", details: err.message });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'about-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// About içeriğini getir
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM about_content ORDER BY id DESC LIMIT 1");
    if (rows.length === 0) {
      return res.json({
        title: "About Us",
        subtitle: "A collective of visionaries shaping tomorrow",
        main_text: "A collective of visionaries shaping tomorrow, where creativity and innovation intersect. Our studio is built on the belief that bold ideas and meticulous execution drive meaningful design.",
        vision_title: "Our Vision",
        vision_text: "We craft innovative design strategies for forward thinking brands, combining aesthetics with purpose to create impactful solutions.",
        image_path: "/images/sample-about.png",
        approach_title: "approach",
        approach_subtitle: "The epitome of forward-thinking design, where bold concepts meet refined execution.",
        brand_strategy_title: "Brand Strategy",
        brand_strategy_text: "We craft strategic foundations that define your brand's identity, positioning, and messaging. Our approach ensures that every element aligns with your vision and resonates with your audience, creating a strong and lasting impact in your industry. Through research and insight-driven strategies, we help brands establish their voice, differentiate themselves from competitors, and create meaningful connections with their customers.",
        visual_design_title: "Visual Design",
        visual_design_text: "Our design process transforms ideas into striking visuals that capture your brand's essence. From logo creation to comprehensive brand systems, we blend creativity with strategy to deliver a cohesive and visually compelling identity. Every design decision is made with intention, ensuring that your brand not only looks exceptional but also tells a compelling story that engages and inspires.",
        launch_title: "Launch",
        launch_text: "We guide brands from concept to execution, ensuring a seamless transition from strategy to market. Whether it's a full-scale brand rollout or a product launch, we provide the tools and assets needed to establish a strong presence and drive engagement. Our expertise in digital and physical touchpoints ensures that your brand makes an impactful debut, creating momentum and lasting visibility in your industry.",
        insights_title: "Insights",
        insights_subtitle: "Discover our latest thinking and strategic approaches",
        insight_1_title: "Brand Evolution",
        insight_1_text: "How modern brands adapt and evolve in an ever-changing digital landscape.",
        insight_1_project_id: 1,
        insight_2_title: "Design Systems",
        insight_2_text: "Building scalable design systems that grow with your business.",
        insight_2_project_id: 2,
        insight_3_title: "User Experience",
        insight_3_text: "Creating meaningful connections through thoughtful user experience design.",
        insight_3_project_id: 3,
                 insight_4_title: "Digital Transformation",
         insight_4_text: "Navigating the digital transformation journey with strategic design thinking.",
         insight_4_project_id: 4,
         clients_title: "Clients",
         clients_list: "Nike\nElectronic Arts\nZapier\nBrownkind\nTonal\nMountain Hardwear\nAppfire\nTAE\n22 System\nArticle One Eyewear\nBetter World\nGucci\nSalt & Stone\nAudi\nLululemon\nPuma",
         industries_title: "Industries",
         industries_list: "Travel\nSports & Fitness\nMedia & Entertainment\nBeauty\nGaming\nFood & Beverage\nCyber\nEnergy\nBanking & Finance\nHealth & Wellness\nApparel & Lifestyle\nHome Goods\nEmerging Technology\nHospitality\nAutomotive"
      });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// About içeriğini güncelle
router.put('/', upload.single('image'), async (req, res) => {
  console.log("PUT /api/about çağrıldı");
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  
  try {
    const { 
      title, subtitle, main_text, vision_title, vision_text,
      approach_title, approach_subtitle,
      brand_strategy_title, brand_strategy_text,
      visual_design_title, visual_design_text,
      launch_title, launch_text,
      insights_title, insights_subtitle,
      insight_1_title, insight_1_text, insight_1_project_id,
      insight_2_title, insight_2_text, insight_2_project_id,
      insight_3_title, insight_3_text, insight_3_project_id,
      insight_4_title, insight_4_text, insight_4_project_id,
      clients_title, clients_list,
      industries_title, industries_list
    } = req.body;

    // Önce mevcut içeriği al
    console.log("Mevcut içerik sorgulanıyor...");
    const [currentContent] = await pool.query("SELECT * FROM about_content ORDER BY id DESC LIMIT 1");
    console.log("Mevcut içerik:", currentContent);
    let imagePath = currentContent.length > 0 ? currentContent[0].image_path : "/images/sample-about.png";

    // Yeni resim yüklendiyse
    if (req.file) {
      imagePath = "/uploads/" + req.file.filename;
      
      // Eski resmi sil (varsayılan resim değilse)
      if (currentContent.length > 0 && currentContent[0].image_path !== "/images/sample-about.png") {
        const fullOldPath = path.join(__dirname, "..", currentContent[0].image_path);
        try {
          await fs.unlink(fullOldPath);
        } catch (err) {
          if (err.code !== 'ENOENT') {
            console.error("Eski resim silinemedi:", err);
          }
        }
      }
    }

    // İçeriği güncelle veya oluştur
    if (currentContent.length > 0) {
      console.log("Mevcut içerik güncelleniyor, ID:", currentContent[0].id);
      const updateResult = await pool.query(
        `UPDATE about_content SET 
        title = ?, subtitle = ?, main_text = ?, vision_title = ?, vision_text = ?, image_path = ?,
        approach_title = ?, approach_subtitle = ?,
        brand_strategy_title = ?, brand_strategy_text = ?,
        visual_design_title = ?, visual_design_text = ?,
        launch_title = ?, launch_text = ?,
        insights_title = ?, insights_subtitle = ?,
        insight_1_title = ?, insight_1_text = ?, insight_1_project_id = ?,
        insight_2_title = ?, insight_2_text = ?, insight_2_project_id = ?,
        insight_3_title = ?, insight_3_text = ?, insight_3_project_id = ?,
        insight_4_title = ?, insight_4_text = ?, insight_4_project_id = ?,
        clients_title = ?, clients_list = ?,
        industries_title = ?, industries_list = ?
        WHERE id = ?`,
        [
          title, subtitle, main_text, vision_title, vision_text, imagePath,
          approach_title, approach_subtitle,
          brand_strategy_title, brand_strategy_text,
          visual_design_title, visual_design_text,
          launch_title, launch_text,
          insights_title, insights_subtitle,
          insight_1_title, insight_1_text, insight_1_project_id,
          insight_2_title, insight_2_text, insight_2_project_id,
          insight_3_title, insight_3_text, insight_3_project_id,
          insight_4_title, insight_4_text, insight_4_project_id,
          clients_title, clients_list,
          industries_title, industries_list,
          currentContent[0].id
        ]
      );
      console.log("UPDATE sonucu:", updateResult);
    } else {
      console.log("Yeni içerik oluşturuluyor...");
      const insertResult = await pool.query(
        `INSERT INTO about_content (
          title, subtitle, main_text, vision_title, vision_text, image_path,
          approach_title, approach_subtitle,
          brand_strategy_title, brand_strategy_text,
          visual_design_title, visual_design_text,
          launch_title, launch_text,
          insights_title, insights_subtitle,
          insight_1_title, insight_1_text, insight_1_project_id,
          insight_2_title, insight_2_text, insight_2_project_id,
          insight_3_title, insight_3_text, insight_3_project_id,
          insight_4_title, insight_4_text, insight_4_project_id,
          clients_title, clients_list,
          industries_title, industries_list
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title, subtitle, main_text, vision_title, vision_text, imagePath,
          approach_title, approach_subtitle,
          brand_strategy_title, brand_strategy_text,
          visual_design_title, visual_design_text,
          launch_title, launch_text,
          insights_title, insights_subtitle,
          insight_1_title, insight_1_text, insight_1_project_id,
          insight_2_title, insight_2_text, insight_2_project_id,
          insight_3_title, insight_3_text, insight_3_project_id,
          insight_4_title, insight_4_text, insight_4_project_id,
          clients_title, clients_list,
          industries_title, industries_list
        ]
      );
      console.log("INSERT sonucu:", insertResult);
    }

    res.json({ message: "About içeriği güncellendi" });
  } catch (err) {
    console.error("Güncelleme hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

module.exports = router;
