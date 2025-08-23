import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key kullan
)

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { file, fileName, bucket = 'uploads' } = req.body

    if (!file || !fileName) {
      return res.status(400).json({ error: 'File and fileName are required' })
    }

    // Base64'ten buffer'a çevir
    const buffer = Buffer.from(file.split(',')[1], 'base64')
    
    // Dosyayı yükle
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: 'image/jpeg', // veya dosya tipine göre
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return res.status(500).json({ error: error.message })
    }

    res.status(200).json({ 
      success: true, 
      data,
      path: `/${bucket}/${fileName}`
    })
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: error.message })
  }
}
