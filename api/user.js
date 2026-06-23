import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './config.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const token = req.headers.authorization?.split(' ')?.[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Create a client that uses the user’s token
    const authedClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // Verify user
    const { data: { user }, error } = await authedClient.auth.getUser();

    if (error) {
      return res.status(401).json({ error: error.message });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Example: safe query under authenticated role
    const { data: children, error: childrenError } = await authedClient
      .from('children')
      .select('id, full_name, age');

    if (childrenError) {
      return res.status(400).json({ error: childrenError.message });
    }

    const userData = {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      role: user.user_metadata?.role || 'user',
      username: user.user_metadata?.username || null,
      childrenCount: children.length
    };

    return res.status(200).json(userData);
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
