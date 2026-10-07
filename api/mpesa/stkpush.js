import axios from 'axios';

async function getMpesaToken() {
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const key = process.env.MPESA_CONSUMER_KEY;

  if (!secret || !key) {
    throw new Error("Missing MPESA_CONSUMER_SECRET or MPESA_CONSUMER_KEY environment variables.");
  }

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');

  console.log("🔑 Fetching token with Consumer Key/Secret...");

  const response = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  );

  console.log("✅ Token received:", response.data.access_token);

  return response.data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { phoneNumber, amount } = req.body;

    const shortCode = process.env.CHURCH_SHORTCODE || '174379'; // Sandbox shortcode
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.CALLBACK_URL;

    // Runtime sanity check
    console.log("Env Vars:", {
      shortCode,
      passkey,
      callbackUrl,
      consumerKey: process.env.MPESA_CONSUMER_KEY,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET
    });

    if (!passkey || !callbackUrl) {
      return res.status(500).json({
        message: "Server configuration error: Missing MPESA_PASSKEY or CALLBACK_URL in environment."
      });
    }

    const token = await getMpesaToken();

    // ✅ Proper timestamp format YYYYMMDDHHMMSS
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, '')
      .slice(0, 14);

    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.ceil(amount).toString(),
      PartyA: phoneNumber,
      PartyB: shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: callbackUrl,
      AccountReference: 'SandboxTest',
      TransactionDesc: 'Testing STK Push'
    };

    console.log("📦 Payload:", payload);

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ STK Push Response:", response.data);

    return res.status(200).json(response.data);

  } catch (error) {
    const detailedError = error.response?.data || error.message;
    console.error("❌ STK Push Integration Failed:", detailedError);

    return res.status(500).json({
      message: "Failed to trigger M-Pesa prompt. Check settings.",
      errorDetails: detailedError
    });
  }
}
