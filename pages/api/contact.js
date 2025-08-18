import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Disable body parsing, we'll handle it manually
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
    try {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (!data) {
        return res.json({
          id: null,
          title: "Let's connect and bring your ideas to life",
          phone: "+45 123 456 789",
          email: "hello@lucastudio.com",
          instagram: "https://instagram.com/lucastudio",
          linkedin: "https://linkedin.com/company/lucastudio",
          address_line1: "12 Nyhavn Street",
          address_line2: "Copenhagen, Denmark, 1051",
          studio_hours_weekdays: "Monday to Friday: 9:00 AM – 6:00 PM",
          studio_hours_weekend: "Saturday & Sunday: Closed",
          image_path: null
        });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching contact content:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const form = formidable({
        uploadDir: '/tmp', // Temporary directory
        keepExtensions: true,
        maxFiles: 1,
        maxFileSize: 5 * 1024 * 1024, // 5MB
      });

      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      });

      const {
        title,
        phone,
        email,
        instagram,
        linkedin,
        address_line1,
        address_line2,
        studio_hours_weekdays,
        studio_hours_weekend
      } = fields;

      // Check if record exists
      const { data: existingData } = await supabase
        .from('contact')
        .select('id, image_path')
        .limit(1)
        .single();
      
      let imageUrl = null;
      if (files.image) {
        const file = files.image[0];
        
        // Delete old image if exists
        if (existingData?.image_path) {
          const oldFileName = existingData.image_path.split('/').pop();
          await supabase.storage
            .from('contact')
            .remove([oldFileName]);
        }

        // Upload new image to Supabase Storage
        const fileBuffer = await fs.readFile(file.filepath);
        const fileName = path.basename(file.filepath);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('contact')
          .upload(fileName, fileBuffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('contact')
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;

        // Clean up temp file
        await fs.unlink(file.filepath);
      }
      
      if (!existingData) {
        // Insert new record
        const { error: insertError } = await supabase
          .from('contact')
          .insert([{
            title,
            phone,
            email,
            instagram,
            linkedin,
            address_line1,
            address_line2,
            studio_hours_weekdays,
            studio_hours_weekend,
            image_path: imageUrl
          }]);
        
        if (insertError) throw insertError;
      } else {
        // Update existing record
        const updateData = {
          title,
          phone,
          email,
          instagram,
          linkedin,
          address_line1,
          address_line2,
          studio_hours_weekdays,
          studio_hours_weekend,
          updated_at: new Date().toISOString()
        };
        
        if (imageUrl) {
          updateData.image_path = imageUrl;
        }
        
        const { error: updateError } = await supabase
          .from('contact')
          .update(updateData)
          .eq('id', existingData.id);
        
        if (updateError) throw updateError;
      }

      res.json({ message: 'Contact content updated successfully' });
    } catch (error) {
      console.error('Error updating contact content:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
