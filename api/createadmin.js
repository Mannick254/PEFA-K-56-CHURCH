import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

// Supabase client options
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  realtime: {
    transport: WebSocket,
  },
};

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
  options
);

async function createAdmin() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'nicksonochieng64@gmail.com', // hidden email, used internally
      password: 'PK56Tech@2026!',          // strong password
      options: {
        data: {
          username: 'PEFAK56',             // custom username
          role: 'admin',                   // role metadata
        },
      },
    });

    if (error) {
      console.error('❌ Error creating admin:', error.message);
    } else {
      console.log('✅ Admin created successfully:', data.user);
    }
  } catch (err) {
    console.error('⚠️ Unexpected error:', err);
  }
}

// Run the script
createAdmin();
