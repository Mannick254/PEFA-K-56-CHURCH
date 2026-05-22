import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ error: 'Email and token are required' });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  if (data.user && data.session) {
    return res.status(200).json({ message: 'Email verified successfully.', user: data.user, session: data.session });
  }

  return res.status(400).json({ error: 'Invalid or expired verification token.' });
}
