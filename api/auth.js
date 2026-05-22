import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './config.js';

export default async function handler(req, res) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Here you can add your auth logic, for example:
  if (req.method === 'POST') {
    // Example: Sign in a user
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
