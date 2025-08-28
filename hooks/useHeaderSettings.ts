import { useState, useEffect } from 'react';
import { getHeaderSettings, HeaderSettings } from '../lib/supabase';

export function useHeaderSettings() {
  const [settings, setSettings] = useState<HeaderSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHeaderSettings();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching header settings:', err);
        setError('Header ayarları yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
