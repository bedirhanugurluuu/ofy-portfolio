const fs = require('fs');
const path = require('path');

// Supabase template for API routes
const supabaseTemplate = `import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    try {
      const { data, error } = await supabase
        .from('TABLE_NAME')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { data, error } = await supabase
        .from('TABLE_NAME')
        .insert([req.body])
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, id: data.id });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id } = req.query;
      const { data, error } = await supabase
        .from('TABLE_NAME')
        .update({
          ...req.body,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, data });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      const { error } = await supabase
        .from('TABLE_NAME')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}`;

// Convert remaining API routes
const apiRoutes = [
  'about.js',
  'about-gallery.js', 
  'awards.js',
  'intro-banners.js',
  'news.js',
  'slider.js'
];

apiRoutes.forEach(route => {
  const filePath = path.join(__dirname, '..', 'pages', 'api', route);
  if (fs.existsSync(filePath)) {
    console.log(`Converting ${route}...`);
    
    // Read the file to determine table name
    const content = fs.readFileSync(filePath, 'utf8');
    let tableName = 'TABLE_NAME';
    
    // Extract table name from existing queries
    const tableMatch = content.match(/FROM\s+(\w+)/i) || content.match(/INSERT INTO\s+(\w+)/i);
    if (tableMatch) {
      tableName = tableMatch[1];
    }
    
    // Replace TABLE_NAME with actual table name
    const convertedContent = supabaseTemplate.replace(/TABLE_NAME/g, tableName);
    
    // Write the converted file
    fs.writeFileSync(filePath, convertedContent);
    console.log(`✓ Converted ${route}`);
  }
});

console.log('Conversion complete!');
