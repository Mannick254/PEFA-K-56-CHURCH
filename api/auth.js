import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './config.js';

export default async function handler(req, res) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  if (req.method === 'POST') {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Get the access token
    const token = data.session.access_token;

    // Create a new client with the user’s token
    const authedClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // Now you can safely insert into RLS-protected tables
    const { error: insertError } = await authedClient
      .from('children')
      .insert([{ full_name: 'Test Child', age: 7, parent_id: data.user.id }]);

    if (insertError) {
      return res.status(400).json({ error: insertError.message });
    }

    return res.status(200).json({ data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
