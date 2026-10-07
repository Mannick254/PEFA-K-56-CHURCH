import 'dotenv/config';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { createClient } from '@supabase/supabase-js';
import qrcode from 'qrcode-terminal';
import express from 'express';
import pino from 'pino';

const app = express();
app.use(express.json());

// 1. Safe Supabase Client Initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('⚠️ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing. Database lookups will be skipped.');
}

let sock;

// Branding Configurations
const BRAND = {
  name: 'PEFA KAWANGWARE 56 CHURCH',
  subtext: 'PEFAK56 ICT TEAM',
  logoUrl: 'https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png',
};

// 2. WhatsApp Connection Handler
async function startWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }), // Suppresses noisy background Baileys sync logs
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n--- SCAN THIS QR CODE WITH WHATSAPP ---\n');
      qrcode.generate(qr, { small: true });
      console.log('\n--- END OF QR CODE ---\n');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(`Connection closed (Code ${statusCode}). Reconnecting: ${shouldReconnect}`);
      if (shouldReconnect) startWhatsApp();
    } else if (connection === 'open') {
      console.log('✅ WhatsApp bot connection established and active!');
    }
  });
}

// 3. Helper Functions
async function getVerse() {
  const today = new Date().toISOString().split('T')[0];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('daily_verses')
        .select('reference, verse_text')
        .eq('scheduled_date', today)
        .maybeSingle();

      if (data && !error) {
        return { reference: data.reference, text: data.verse_text };
      }
    } catch (err) {
      console.warn('DB check failed, falling back to API:', err.message);
    }
  }

  try {
    const res = await fetch('https://beta.ourmanna.com/api/v1/get?format=json&order=daily');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return {
      reference: json.verse.details.reference,
      text: json.verse.details.text.replace(/<[^>]*>?/gm, ' ').trim(),
    };
  } catch (apiErr) {
    console.warn('OurManna API unavailable, using safety fallback:', apiErr.message);
    return {
      reference: 'Proverbs 3:5-6',
      text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    };
  }
}

// Helper function to build styled headers and footers
function formatMessage({ title, body }) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return [
    `🏛️ *${BRAND.name}*`,
    `🗓️ _${dateStr}_`,
    `───────────────────`,
    ``,
    `*${title}*`,
    ``,
    body,
    ``,
    `───────────────────`,
    `✨ _Powered by *${BRAND.subtext}*_`,
  ].join('\n');
}

// 4. Endpoints

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'PEFA Kawangware WhatsApp Bot',
    whatsappConnected: !!sock,
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Helper Route: Fetch participating WhatsApp Groups & JIDs
app.get('/groups', async (req, res) => {
  try {
    if (!sock) return res.status(503).json({ error: 'WhatsApp socket not initialized' });
    const groups = await sock.groupFetchAllParticipating();
    const list = Object.values(groups).map((g) => ({ name: g.subject, jid: g.id }));
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint: Trigger Daily Verse
app.post('/trigger-daily-verse', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const groupId = process.env.WHATSAPP_GROUP_ID;
  if (!groupId) {
    return res.status(500).json({ error: 'WHATSAPP_GROUP_ID environment variable is missing.' });
  }

  try {
    if (!sock) {
      return res.status(503).json({ error: 'WhatsApp socket not initialized yet.' });
    }

    const verse = await getVerse();

    const caption = formatMessage({
      title: '📖 VERSE OF THE DAY',
      body: `📍 *${verse.reference}*\n\n> _"${verse.text}"_`,
    });

    await sock.sendMessage(groupId, {
      image: { url: BRAND.logoUrl },
      caption: caption,
    });

    return res.json({ success: true, message: 'Verse delivered to WhatsApp!', verse });
  } catch (err) {
    console.error('Error sending message:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Endpoint: Trigger Latest Sermon Notification
app.post('/trigger-latest-sermon', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const groupId = process.env.WHATSAPP_GROUP_ID;
  if (!groupId) {
    return res.status(500).json({ error: 'WHATSAPP_GROUP_ID environment variable is missing.' });
  }

  try {
    if (!sock) {
      return res.status(503).json({ error: 'WhatsApp socket not initialized yet.' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Supabase client not initialized.' });
    }

    const { data, error } = await supabase
      .from('sermons')
      .select('id, title, preacher')
      .order('date', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    const sermonUrl = `https://www.pefak56church.top/sermons/${data.id}`;

    const caption = formatMessage({
      title: '🎬 NEW SERMON ALERT',
      body: `🎥 *${data.title}*\n👤 *Preacher:* ${data.preacher}\n\n🔗 *Watch or Read Here:* ${sermonUrl}`,
    });

    // Send with the branding image banner
    await sock.sendMessage(groupId, {
      image: { url: BRAND.logoUrl },
      caption: caption,
    });

    return res.json({ success: true, message: 'Sermon notification sent!', sermon: data });
  } catch (err) {
    console.error('Error sending sermon notification:', err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot server listening on port ${PORT}`);
  startWhatsApp();
});