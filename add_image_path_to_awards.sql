-- Add image_path column to awards table
ALTER TABLE awards ADD COLUMN image_path TEXT;

-- Update existing awards to have NULL image_path (optional)
UPDATE awards SET image_path = NULL WHERE image_path IS NULL;

