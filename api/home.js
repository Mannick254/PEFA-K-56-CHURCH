import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './config.js';

export default async function handler(req, res) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  if (req.method === 'GET') {
    // Fetch all church items
    const { data: churchItems, error } = await supabase
      .from('church_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(churchItems);
  } else if (req.method === 'POST') {
    // Create a new church item - protected route
    const token = req.headers.authorization?.split(' ')?.[1];

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { title, content, type } = req.body;

    if (!title || !content || !type) {
      return res.status(400).json({ error: 'Title, content, and type are required' });
    }

    const { data: newItem, error: insertError } = await supabase
      .from('church_items')
      .insert([{ title, content, type, user_id: user.id }])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }

    return res.status(201).json(newItem);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
