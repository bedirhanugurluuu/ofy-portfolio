import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Header Settings Interfaces
export interface MenuItem {
  id: string
  href: string
  label: string
  order: number
}

export interface HeaderSettings {
  id: string
  logo_text?: string
  logo_image_url?: string
  logo_image_url_light?: string
  menu_items: MenuItem[]
  created_at: string
  updated_at: string
}

// Header Settings Functions
export async function getHeaderSettings(): Promise<HeaderSettings | null> {
  try {
    const { data, error } = await supabase
      .from('header_settings')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching header settings:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching header settings:', error)
    return null
  }
}

export async function updateHeaderSettings(settings: Partial<HeaderSettings>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('header_settings')
      .upsert(settings)

    if (error) {
      console.error('Error updating header settings:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error updating header settings:', error)
    return false
  }
}

export async function uploadLogoImage(file: File, isLight = false): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `header/logo-${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading logo:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading logo:', error)
    return null
  }
}

export async function deleteLogoImage(url: string): Promise<boolean> {
  try {
    const path = url.split('/').pop()
    if (!path) return false

    const { error } = await supabase.storage
      .from('uploads')
      .remove([`header/${path}`])

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
