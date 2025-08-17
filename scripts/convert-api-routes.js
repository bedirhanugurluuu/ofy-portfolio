const fs = require('fs');
const path = require('path');

// Backend routes'ları Next.js API routes'a dönüştür
const convertRoute = (routeName) => {
  const backendPath = `backend/routes/${routeName}.js`;
  const nextApiPath = `pages/api/${routeName}.js`;
  
  if (!fs.existsSync(backendPath)) {
    console.log(`❌ ${backendPath} bulunamadı`);
    return;
  }

  let content = fs.readFileSync(backendPath, 'utf8');
  
  // Express router'ı Next.js API handler'a dönüştür
  content = content.replace(
    /const express = require\('express'\);\s*const router = express\.Router\(\);\s*const pool = require\('\.\.\/db'\);/g,
    `import mysql from 'mysql2/promise';

// Database connection
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});`
  );

  // router.get -> if (req.method === 'GET')
  content = content.replace(
    /router\.get\('\/', async \(req, res\) => {/g,
    `export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {`
  );

  // router.post -> else if (req.method === 'POST')
  content = content.replace(
    /router\.post\('\/', async \(req, res\) => {/g,
    `  } else if (req.method === 'POST') {`
  );

  // router.put -> else if (req.method === 'PUT')
  content = content.replace(
    /router\.put\('\/', async \(req, res\) => {/g,
    `  } else if (req.method === 'PUT') {`
  );

  // router.delete -> else if (req.method === 'DELETE')
  content = content.replace(
    /router\.delete\('\/', async \(req, res\) => {/g,
    `  } else if (req.method === 'DELETE') {`
  );

  // module.exports = router; -> else { res.status(405).json({ error: 'Method not allowed' }); } }
  content = content.replace(
    /module\.exports = router;/g,
    `  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}`
  );

  // Dosyayı yaz
  fs.writeFileSync(nextApiPath, content);
  console.log(`✅ ${routeName} dönüştürüldü: ${nextApiPath}`);
};

// Tüm routes'ları dönüştür
const routes = [
  'about',
  'aboutGallery', 
  'projects',
  'news',
  'introBanners',
  'awards',
  'slider',
  'auth'
];

console.log('🚀 Backend API routes\'ları Next.js API routes\'a dönüştürülüyor...\n');

routes.forEach(route => {
  convertRoute(route);
});

console.log('\n✅ Tüm routes dönüştürüldü!');
console.log('📝 Not: what-we-do ve contact routes zaten dönüştürülmüştü.');
