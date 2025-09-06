import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // IP listesini getir
    try {
      const { data, error } = await supabase
        .from('allowed_ips')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error fetching IPs:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch IPs' });
    }
  } 
  else if (req.method === 'POST') {
    // Yeni IP ekle
    try {
      const { ip_address, description } = req.body;

      if (!ip_address) {
        return res.status(400).json({ success: false, error: 'IP address is required' });
      }

      const { data, error } = await supabase
        .from('allowed_ips')
        .insert([{ ip_address, description }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ success: true, data });
    } catch (error) {
      console.error('Error adding IP:', error);
      res.status(500).json({ success: false, error: 'Failed to add IP' });
    }
  }
  else if (req.method === 'DELETE') {
    // IP sil
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ success: false, error: 'IP ID is required' });
      }

      const { error } = await supabase
        .from('allowed_ips')
        .delete()
        .eq('id', id);

      if (error) throw error;

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting IP:', error);
      res.status(500).json({ success: false, error: 'Failed to delete IP' });
    }
  }
  else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
