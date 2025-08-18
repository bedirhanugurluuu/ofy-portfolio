require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Uploads directory path
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');

// Get MIME type based on file extension
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Bucket mapping for different file types
const getBucketForFile = (filename) => {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('project')) return 'projects';
  if (lowerFilename.includes('news')) return 'news';
  if (lowerFilename.includes('about')) return 'about';
  if (lowerFilename.includes('award')) return 'awards';
  if (lowerFilename.includes('slider')) return 'slider';
  if (lowerFilename.includes('introbanner')) return 'intro-banners';
  if (lowerFilename.includes('contact')) return 'contact';
  
  // Default bucket
  return 'projects';
};

async function migrateFiles() {
  try {
    console.log('Starting file migration to Supabase Storage...');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
    console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set');
    
    // Check if uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      console.log('Uploads directory not found. Nothing to migrate.');
      return;
    }

    // Read all files in uploads directory
    const files = fs.readdirSync(UPLOADS_DIR);
    
    if (files.length === 0) {
      console.log('No files found in uploads directory.');
      return;
    }

    console.log(`Found ${files.length} files to migrate.`);

    for (const filename of files) {
      try {
        const filePath = path.join(UPLOADS_DIR, filename);
        const stats = fs.statSync(filePath);
        
        // Skip directories
        if (stats.isDirectory()) {
          console.log(`Skipping directory: ${filename}`);
          continue;
        }

        // Skip .gitkeep files
        if (filename === '.gitkeep') {
          console.log(`Skipping .gitkeep file: ${filename}`);
          continue;
        }

        // Determine bucket
        const bucket = getBucketForFile(filename);
        
        console.log(`Migrating ${filename} to bucket: ${bucket}`);

        // Read file
        const fileBuffer = fs.readFileSync(filePath);
        
        // Get MIME type
        const mimeType = getMimeType(filename);
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filename, fileBuffer, {
            contentType: mimeType,
            cacheControl: '3600',
            upsert: true
          });

        if (error) {
          console.error(`Error uploading ${filename}:`, error);
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filename);

        console.log(`✓ Successfully migrated ${filename}`);
        console.log(`  URL: ${urlData.publicUrl}`);

        // Optionally delete local file after successful upload
        // fs.unlinkSync(filePath);
        // console.log(`  Deleted local file: ${filename}`);

      } catch (error) {
        console.error(`Error processing ${filename}:`, error);
      }
    }

    console.log('File migration completed!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration
migrateFiles();
