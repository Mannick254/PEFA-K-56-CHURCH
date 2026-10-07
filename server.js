import 'dotenv/config'; // Loads .env before any other imports execute
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { createClient } from '@supabase/supabase-js';
import express from 'express';

const app = express();
app.use(express.json());

// Initialize Supabase safely after environment variables are loaded
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ CRITICAL ERROR: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable is missing.");
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

let sock;

async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) startWhatsApp();
    } else if (connection === 'open') {
      console.log('✅ WhatsApp bot ready!');
    }
  });
}

// Helper to fetch verse (DB -> OurManna API -> Safety Fallback)
async function getVerse() {
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data } = await supabase
      .from('daily_verses')
      .select('reference, verse_text')
      .eq('scheduled_date', today)
      .maybeSingle();

    if (data) return { reference: data.reference, text: data.verse_text };
  } catch (err) {
    console.warn('DB check failed, falling back to API:', err);
  }

  try {
    const res = await fetch('https://beta.ourmanna.com/api/v1/get?format=json&order=daily');
    const json = await res.json();
    return {
      reference: json.verse.details.reference,
      text: json.verse.details.text.replace(/<[^>]*>?/gm, '').trim()
    };
  } catch (apiErr) {
    return {
      reference: 'Proverbs 3:5-6',
      text: 'Trust in the LORD with all your heart and lean not on your own understanding...'
    };
  }
}

// Direct Trigger Endpoint called by Supabase pg_cron
app.post('/trigger-daily-verse', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const verse = await getVerse();
    const message = `📖 *Verse of the Day*\n\n"${verse.text}"\n\n— *${verse.reference}*`;

    await sock.sendMessage(process.env.WHATSAPP_GROUP_ID, { text: message });
    return res.json({ success: true, message: 'Verse delivered to WhatsApp!' });
  } catch (err) {
    console.error('Error sending message:', err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot server listening on port ${PORT}`);
  startWhatsApp();
});