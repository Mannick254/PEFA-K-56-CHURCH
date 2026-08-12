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
  // Check if required environment variables are set
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set.');
    return;
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: process.env.ADMIN_EMAIL,       // Use email from env vars
      password: process.env.ADMIN_PASSWORD, // Use password from env vars
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