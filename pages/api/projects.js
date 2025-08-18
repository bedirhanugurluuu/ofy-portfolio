import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  } else if (req.method === 'POST') {
    try {
      const form = formidable({
        uploadDir: '/tmp', // Temporary directory
        keepExtensions: true,
        filename: (name, ext, part) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          return uniqueSuffix + '-' + part.originalFilename;
        }
      });

      const [fields, files] = await form.parse(req);
      
      const imageFile = files.image?.[0];
      let imageUrl = null;

      // Upload image to Supabase Storage
      if (imageFile) {
        const fileBuffer = await fs.promises.readFile(imageFile.filepath);
        const fileName = path.basename(imageFile.filepath);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('projects')
          .upload(fileName, fileBuffer, {
            contentType: imageFile.mimetype,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('projects')
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;

        // Clean up temp file
        await fs.promises.unlink(imageFile.filepath);
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: fields.title?.[0] || '',
          description: fields.description?.[0] || '',
          image_path: imageUrl,
          subtitle: fields.subtitle?.[0] || '',
          category: fields.category?.[0] || '',
          client: fields.client?.[0] || '',
          year: parseInt(fields.year?.[0]) || new Date().getFullYear(),
          slug: fields.slug?.[0] || '',
          featured: fields.featured?.[0] === 'true'
        }])
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, id: data.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  } else if (req.method === 'PUT') {
    try {
      const form = formidable({
        uploadDir: '/tmp',
        keepExtensions: true,
        filename: (name, ext, part) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          return uniqueSuffix + '-' + part.originalFilename;
        }
      });

      const [fields, files] = await form.parse(req);
      const { id } = req.query;
      
      const imageFile = files.image?.[0];
      let imageUrl = null;

      // Upload new image to Supabase Storage
      if (imageFile) {
        // Delete old image if exists
        const { data: currentProject } = await supabase
          .from('projects')
          .select('image_path')
          .eq('id', id)
          .single();
        
        if (currentProject?.image_path) {
          const oldFileName = currentProject.image_path.split('/').pop();
          await supabase.storage
            .from('projects')
            .remove([oldFileName]);
        }

        // Upload new image
        const fileBuffer = await fs.promises.readFile(imageFile.filepath);
        const fileName = path.basename(imageFile.filepath);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('projects')
          .upload(fileName, fileBuffer, {
            contentType: imageFile.mimetype,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('projects')
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;

        // Clean up temp file
        await fs.promises.unlink(imageFile.filepath);
      }

      const updateData = {
        title: fields.title?.[0] || '',
        description: fields.description?.[0] || '',
        subtitle: fields.subtitle?.[0] || '',
        category: fields.category?.[0] || '',
        client: fields.client?.[0] || '',
        year: parseInt(fields.year?.[0]) || new Date().getFullYear(),
        slug: fields.slug?.[0] || '',
        featured: fields.featured?.[0] === 'true',
        updated_at: new Date().toISOString()
      };

      if (imageUrl) {
        updateData.image_path = imageUrl;
      }

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      
      // Delete image from storage
      const { data: project } = await supabase
        .from('projects')
        .select('image_path')
        .eq('id', id)
        .single();
      
      if (project?.image_path) {
        const fileName = project.image_path.split('/').pop();
        await supabase.storage
          .from('projects')
          .remove([fileName]);
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
