import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client safely outside the handler
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // 1. Enforce strict POST requests from Safaricom
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { Body } = req.body;
    
    if (!Body || !Body.stkCallback) {
      return res.status(400).json({ message: "Invalid payload layout" });
    }

    const callbackData = Body.stkCallback;
    const checkoutRequestID = callbackData.CheckoutRequestID;
    const merchantRequestID = callbackData.MerchantRequestID;

    // 2. Handle successful payments (ResultCode 0)
    if (callbackData.ResultCode === 0) {
      const metadata = callbackData.CallbackMetadata?.Item || [];
      
      const amount = metadata.find(item => item.Name === 'Amount')?.Value;
      const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
      const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber')?.Value;
      const transactionDate = metadata.find(item => item.Name === 'TransactionDate')?.Value;

      console.log(`✨ Donation Verified: KES ${amount} from ${phoneNumber}. Receipt: ${mpesaReceiptNumber}`);

      // 3. Persist the record directly into your database table
      const { error } = await supabase
        .from('donations')
        .insert([
          {
            checkout_request_id: checkoutRequestID,
            merchant_request_id: merchantRequestID,
            amount: parseFloat(amount),
            mpesa_receipt: mpesaReceiptNumber,
            phone_number: phoneNumber.toString(),
            status: 'COMPLETED',
            raw_callback: Body,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error("Supabase Database Insert Error:", error.message);
        // We still respond with 200 to Safaricom so they stop retrying the webhook
      }

    } else {
      // 4. Log cancelled or failed transactions (e.g., User cancelled, insufficient funds)
      console.log(`❌ Transaction Failed/Cancelled: ${callbackData.ResultDesc} (${callbackData.ResultCode})`);
      
      // Optional: Log the failure to the database so you can track abandoned checkout flows
      await supabase
        .from('donations')
        .insert([
          {
            checkout_request_id: checkoutRequestID,
            merchant_request_id: merchantRequestID,
            status: 'FAILED',
            failure_reason: callbackData.ResultDesc,
            raw_callback: Body,
            created_at: new Date().toISOString()
          }
        ]);
    }

    // 5. Always acknowledge the receipt back to Safaricom safely
    return res.status(200).json({ ResultCode: 0, ResultDesc: "Callback Handled Successfully" });

  } catch (error) {
    console.error("Global Callback Handler Exception:", error.message);
    // Return 200 anyway so Safaricom's system registers the hook as delivered
    return res.status(200).json({ ResultCode: 0, ResultDesc: "Error processed gracefully" });
  }
}
