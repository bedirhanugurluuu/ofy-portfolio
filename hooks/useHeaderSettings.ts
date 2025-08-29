import { useState, useEffect } from 'react';
import { getHeaderSettings, HeaderSettings } from '../lib/supabase';

// Varsayılan header ayarları
const defaultHeaderSettings: HeaderSettings = {
  id: 'default',
  menu_items: [
    { id: '1', href: '/projects', label: 'WORK', order: 1 },
    { id: '2', href: '/about', label: 'ABOUT', order: 2 },
    { id: '3', href: '/blog', label: 'NEWS', order: 3 },
    { id: '4', href: '/careers', label: 'CAREERS', order: 4 }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export function useHeaderSettings() {
  const [settings, setSettings] = useState<HeaderSettings | null>(defaultHeaderSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHeaderSettings();
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Error fetching header settings:', err);
        setError('Header ayarları yüklenirken bir hata oluştu');
        // Hata durumunda varsayılan ayarları kullan
        setSettings(defaultHeaderSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
