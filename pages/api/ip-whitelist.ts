import { supabase } from '../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  handleOptions,
  rateLimit,
  setCorsHeaders,
  verifyAdminSecret,
} from '../../lib/api-security';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('allowed_ips')
        .select('ip_address')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json({
        success: true,
        data: data.map((item) => ({ ip_address: item.ip_address })),
      });
    } catch (error) {
      console.error('Error fetching IPs:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch IPs' });
    }
    return;
  }

  if (!verifyAdminSecret(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (
    rateLimit(req, res, {
      key: 'ip-whitelist-admin',
      limit: 20,
      windowMs: 60 * 1000,
    })
  ) {
    return;
  }

  if (req.method === 'POST') {
    try {
      const { ip_address, description } = req.body;

      if (!ip_address) {
        return res
          .status(400)
          .json({ success: false, error: 'IP address is required' });
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
    return;
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, error: 'IP ID is required' });
      }

      const { error } = await supabase.from('allowed_ips').delete().eq('id', id);

      if (error) throw error;

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting IP:', error);
      res.status(500).json({ success: false, error: 'Failed to delete IP' });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).json({ success: false, error: 'Method not allowed' });
}
