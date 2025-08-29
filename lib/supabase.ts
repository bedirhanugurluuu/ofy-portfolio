import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Header ayarları için tip tanımları
export interface HeaderSettings {
  id: string
  logo_text?: string
  logo_image_url?: string
  logo_image_url_light?: string
  menu_items: MenuItem[]
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  href: string
  label: string
  order: number
}

// Header ayarlarını getir
export async function getHeaderSettings(): Promise<HeaderSettings | null> {
  const { data, error } = await supabase
    .from('header_settings')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching header settings:', error)
    return null
  }

  return data
}

// Header ayarlarını güncelle
export async function updateHeaderSettings(settings: Partial<HeaderSettings>): Promise<HeaderSettings | null> {
  const { data, error } = await supabase
    .from('header_settings')
    .upsert(settings)
    .select()
    .single()

  if (error) {
    console.error('Error updating header settings:', error)
    return null
  }

  return data
}

// Logo resmini yükle
export async function uploadLogoImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `logo-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(fileName, file)

  if (uploadError) {
    console.error('Error uploading logo:', uploadError)
    return null
  }

  const { data } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName)

  return data.publicUrl
}

// Eski logo resmini sil
export async function deleteLogoImage(imageUrl: string): Promise<boolean> {
  try {
    // URL'den dosya yolunu çıkar
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]

    const { error } = await supabase.storage
      .from('uploads')
      .remove([fileName])

    if (error) {
      console.error('Error deleting logo:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting logo:', error)
    return false
  }
}
