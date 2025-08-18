import { supabase } from './supabase';

// Storage bucket names
export const STORAGE_BUCKETS = {
  PROJECTS: 'projects',
  NEWS: 'news',
  ABOUT: 'about',
  AWARDS: 'awards',
  SLIDER: 'slider',
  INTRO_BANNERS: 'intro-banners',
  ABOUT_GALLERY: 'about-gallery',
  CONTACT: 'contact'
} as const;

// File upload utility
export async function uploadFile(
  bucket: string,
  file: File,
  path: string
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  return { data, error };
}

// Get public URL for a file
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

// Delete file from storage
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  return { data, error };
}

// Generate unique filename
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
}

// Upload image with automatic resizing
export async function uploadImage(
  bucket: string,
  file: File,
  options?: {
    resize?: { width?: number; height?: number };
    quality?: number;
  }
): Promise<{ data: any; error: any; publicUrl?: string }> {
  const filename = generateUniqueFilename(file.name);
  const path = `${filename}`;

  const { data, error } = await uploadFile(bucket, file, path);
  
  if (error) {
    return { data, error };
  }

  const publicUrl = getPublicUrl(bucket, path);
  
  // If resize options are provided, return transformed URL
  if (options?.resize) {
    const { width, height } = options.resize;
    const transformUrl = `${publicUrl}?width=${width || 'auto'}&height=${height || 'auto'}`;
    return { data, error: null, publicUrl: transformUrl };
  }

  return { data, error: null, publicUrl };
}

// List files in a bucket
export async function listFiles(
  bucket: string,
  path?: string
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path || '');

  return { data, error };
}

// Download file
export async function downloadFile(
  bucket: string,
  path: string
): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(path);

  return { data, error };
}
