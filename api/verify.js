import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from './config.js';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ error: 'Email and token are required.' });
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup', // could also be 'magiclink' or 'recovery'
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    if (data?.user && data?.session) {
      return res.status(200).json({
        message: 'Email verified successfully.',
        user: data.user,
        session: data.session,
      });
    }

    return res.status(400).json({ error: 'Invalid or expired verification token.' });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
