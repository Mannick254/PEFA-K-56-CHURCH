import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './config.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const token = req.headers.authorization?.split(' ')?.[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // You can customize the user data you return
  // For security, avoid sending back sensitive information
  const userData = {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  };

  return res.status(200).json(userData);
}
