import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

Deno.serve(async (_req) => {
  try {
    // 1. Fetch Verse of the Day
    const verse = await fetchVerseOfTheDay();

    // 2. Fetch ALL registered users from Supabase Auth (Paginated)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let allUsers: any[] = [];
    let page = 1;
    const perPage = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers({
        page,
        perPage,
      });

      if (userError) throw userError;

      if (users && users.length > 0) {
        allUsers = allUsers.concat(users);
        page++;
        if (users.length < perPage) hasMore = false;
      } else {
        hasMore = false;
      }
    }

    // Filter valid recipient emails
    const recipientEmails: string[] = allUsers
      .map((u) => u.email)
      .filter((email): email is string => Boolean(email));

    if (recipientEmails.length === 0) {
      return new Response(
        JSON.stringify({ message: "No registered users found." }),
        { headers: { "Content-Type": "application/json" }, status: 200 }
      );
    }

    // 3. Send email using Brevo API
    const brevoApiKey = Deno.env.get("BREVO_API_KEY")!;
    const senderEmail = Deno.env.get("SENDER_EMAIL") || "infor@pefak56church.top";

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src="https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png" alt="PEFA 56 Logo" style="height: 50px; width: 50px; margin-bottom: 16px;" />
          <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 700;">PEFA KAWANGWARE 56 CHURCH</h2>
          <p style="color: #2563eb; font-size: 14px; font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Daily Devotional</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
        
        <div style="padding: 12px 0;">
          <h3 style="color: #2563eb; margin: 0 0 12px 0; font-size: 18px;">${verse.reference}</h3>
          <blockquote style="font-style: italic; font-size: 16px; line-height: 1.6; color: #334155; border-left: 4px solid #2563eb; padding-left: 16px; margin: 0;">
            "${verse.text}"
          </blockquote>
        </div>
        
        <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0 16px 0;" />
        
        <div style="text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
          <p style="margin: 0 0 4px 0;">PEFA Kawangware 56 Church • Nairobi, Kenya</p>
          <p style="margin: 0;">You are receiving this automated daily devotional as a registered member.</p>
          <p style="margin: 10px 0 0 0;">Powered by PEFAK56 ICT TEAM</p>
        </div>
      </div>
    `;

    // Brevo hard limit is 99 BCC recipients per call
    const BATCH_SIZE = 95;
    const brevoResults = [];
    const errors = [];

    for (let i = 0; i < recipientEmails.length; i += BATCH_SIZE) {
      const batch = recipientEmails.slice(i, i + BATCH_SIZE);

      const emailPayload = {
        sender: { name: "PEFA KAWANGWARE 56 CHURCH", email: senderEmail },
        to: [{ email: senderEmail, name: "PEFA K56 Members" }],
        bcc: batch.map((email) => ({ email })),
        subject: `Daily Devotional: ${verse.reference}`,
        htmlContent,
      };

      try {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "api-key": brevoApiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify(emailPayload),
        });

        const data = await res.json();
        if (!res.ok) {
          errors.push({ batchIndex: Math.floor(i / BATCH_SIZE), error: data });
        } else {
          brevoResults.push(data);
        }
      } catch (batchErr: any) {
        errors.push({ batchIndex: Math.floor(i / BATCH_SIZE), error: batchErr.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: errors.length === 0 ? "Daily verse emails sent successfully" : "Completed with some batch errors", 
        totalRecipients: recipientEmails.length, 
        successfulBatches: brevoResults.length,
        failedBatches: errors.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { "Content-Type": "application/json" }, status: errors.length > 0 ? 207 : 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});