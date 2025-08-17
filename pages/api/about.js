import mysql from 'mysql2/promise';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

// Database connection
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    console.log("GET /api/about çağrıldı");
    
    try {
      const [rows] = await pool.query("SELECT * FROM about_content ORDER BY id DESC LIMIT 1");
      
      if (rows.length === 0) {
        return res.status(404).json({ error: "About içeriği bulunamadı" });
      }
      
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  } else if (req.method === 'PUT') {
    console.log("PUT /api/about çağrıldı");
    
    try {
      const form = formidable({
        uploadDir: path.join(process.cwd(), 'public', 'uploads'),
        keepExtensions: true,
        filename: (name, ext, part) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          return uniqueSuffix + '-' + part.originalFilename;
        }
      });

      const [fields, files] = await form.parse(req);
      console.log("Request fields:", fields);
      console.log("Request files:", files);
      
      const imageFile = files.image?.[0];
      const imagePath = imageFile ? "/uploads/" + path.basename(imageFile.filepath) : null;

      // Önce mevcut içeriği al
      console.log("Mevcut içerik sorgulanıyor...");
      const [currentContent] = await pool.query("SELECT * FROM about_content ORDER BY id DESC LIMIT 1");
      console.log("Mevcut içerik:", currentContent);
      let finalImagePath = currentContent.length > 0 ? currentContent[0].image_path : "/images/sample-about.png";

      // Yeni resim yüklendiyse
      if (imagePath) {
        finalImagePath = imagePath;
        
        // Eski resmi sil (varsayılan resim değilse)
        if (currentContent.length > 0 && currentContent[0].image_path !== "/images/sample-about.png") {
          const fullOldPath = path.join(process.cwd(), 'public', currentContent[0].image_path);
          try {
            await fs.unlink(fullOldPath);
          } catch (err) {
            if (err.code !== 'ENOENT') {
              console.error("Eski resim silinemedi:", err);
            }
          }
        }
      }

      // Form fields'ları al
      const formData = {
        title: fields.title?.[0] || '',
        subtitle: fields.subtitle?.[0] || '',
        main_text: fields.main_text?.[0] || '',
        vision_title: fields.vision_title?.[0] || '',
        vision_text: fields.vision_text?.[0] || '',
        approach_title: fields.approach_title?.[0] || '',
        approach_subtitle: fields.approach_subtitle?.[0] || '',
        brand_strategy_title: fields.brand_strategy_title?.[0] || '',
        brand_strategy_text: fields.brand_strategy_text?.[0] || '',
        visual_design_title: fields.visual_design_title?.[0] || '',
        visual_design_text: fields.visual_design_text?.[0] || '',
        launch_title: fields.launch_title?.[0] || '',
        launch_text: fields.launch_text?.[0] || '',
        insights_title: fields.insights_title?.[0] || '',
        insights_subtitle: fields.insights_subtitle?.[0] || '',
        insight_1_title: fields.insight_1_title?.[0] || '',
        insight_1_text: fields.insight_1_text?.[0] || '',
        insight_1_project_id: fields.insight_1_project_id?.[0] || null,
        insight_2_title: fields.insight_2_title?.[0] || '',
        insight_2_text: fields.insight_2_text?.[0] || '',
        insight_2_project_id: fields.insight_2_project_id?.[0] || null,
        insight_3_title: fields.insight_3_title?.[0] || '',
        insight_3_text: fields.insight_3_text?.[0] || '',
        insight_3_project_id: fields.insight_3_project_id?.[0] || null,
        insight_4_title: fields.insight_4_title?.[0] || '',
        insight_4_text: fields.insight_4_text?.[0] || '',
        insight_4_project_id: fields.insight_4_project_id?.[0] || null,
        clients_title: fields.clients_title?.[0] || '',
        clients_list: fields.clients_list?.[0] || '',
        industries_title: fields.industries_title?.[0] || '',
        industries_list: fields.industries_list?.[0] || ''
      };

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
            formData.title, formData.subtitle, formData.main_text, formData.vision_title, formData.vision_text, finalImagePath,
            formData.approach_title, formData.approach_subtitle,
            formData.brand_strategy_title, formData.brand_strategy_text,
            formData.visual_design_title, formData.visual_design_text,
            formData.launch_title, formData.launch_text,
            formData.insights_title, formData.insights_subtitle,
            formData.insight_1_title, formData.insight_1_text, formData.insight_1_project_id,
            formData.insight_2_title, formData.insight_2_text, formData.insight_2_project_id,
            formData.insight_3_title, formData.insight_3_text, formData.insight_3_project_id,
            formData.insight_4_title, formData.insight_4_text, formData.insight_4_project_id,
            formData.clients_title, formData.clients_list,
            formData.industries_title, formData.industries_list,
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
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            formData.title, formData.subtitle, formData.main_text, formData.vision_title, formData.vision_text, finalImagePath,
            formData.approach_title, formData.approach_subtitle,
            formData.brand_strategy_title, formData.brand_strategy_text,
            formData.visual_design_title, formData.visual_design_text,
            formData.launch_title, formData.launch_text,
            formData.insights_title, formData.insights_subtitle,
            formData.insight_1_title, formData.insight_1_text, formData.insight_1_project_id,
            formData.insight_2_title, formData.insight_2_text, formData.insight_2_project_id,
            formData.insight_3_title, formData.insight_3_text, formData.insight_3_project_id,
            formData.insight_4_title, formData.insight_4_text, formData.insight_4_project_id,
            formData.clients_title, formData.clients_list,
            formData.industries_title, formData.industries_list
          ]
        );
        console.log("INSERT sonucu:", insertResult);
      }

      res.json({ success: true, message: "About içeriği başarıyla güncellendi" });
    } catch (err) {
      console.error("About güncelleme hatası:", err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
