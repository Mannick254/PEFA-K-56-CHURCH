import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// NOTE: Using npm specifiers with Deno to use baileys which is a Node.js library.
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'npm:@adiwajshing/baileys';
import { Boom } from 'npm:@hapi/boom';

// Helper function to fetch Verse of the Day with fallback
async function fetchVerseOfTheDay(): Promise<{ reference: string; text: string }> {
  try {
    // Primary API: OurManna VOTD
    const res = await fetch("https://beta.ourmanna.com/api/v1/get?format=json&order=daily");
    if (!res.ok) throw new Error(`OurManna API HTTP error: ${res.status}`);
    const data = await res.json();
    const cleanText = data.verse.details.text.replace(/<[^>]*>?/gm, "").trim();
    return {
      reference: data.verse.details.reference,
      text: cleanText,
    };
  } catch (primaryErr) {
    console.warn("Primary verse API failed, attempting secondary source:", primaryErr);

    // Fallback: Hardcoded safety net
    return {
      reference: "Proverbs 3:5-6",
      text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    };
  }
}

// Main function to connect to WhatsApp
async function connectToWhatsApp() {
  // useMultiFileAuthState will use the local file system to store authentication data.
  // In a serverless environment, this state might be ephemeral.
  // For a more robust solution, you should store the auth state in a persistent storage like Supabase Storage.
  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info');
  
  const sock = makeWASocket({
    // Print QR code in the terminal. You need to scan this QR code with your WhatsApp app.
    // Check the Supabase function logs to see the QR code.
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
      // reconnect if not logged out
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('opened connection');
    }
  });

  // Save credentials whenever they are updated
  sock.ev.on('creds.update', saveCreds);

  return sock;
}

serve(async (req) => {
  try {
    const sock = await connectToWhatsApp();

    // You need to replace this with your WhatsApp group ID.
    // You can get the group ID by using another bot or by inspecting the network traffic on WhatsApp Web.
    const groupId = Deno.env.get("WHATSAPP_GROUP_ID") || "YOUR_WHATSAPP_GROUP_ID"; 

    // Fetch the daily verse.
    const verse = await fetchVerseOfTheDay();

    const message = `*${verse.reference}*

_"${verse.text}"_`;

    console.log(`Sending message to group ${groupId}`);
    await sock.sendMessage(groupId, { text: message });
    console.log(`Message sent to group ${groupId}`);

    // It's a good practice to close the connection after sending the message
    // if the function is meant to be invoked on a schedule (e.g., cron job).
    // sock.end();

    return new Response(JSON.stringify({ status: 'ok', message: 'Verse sent successfully' }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});