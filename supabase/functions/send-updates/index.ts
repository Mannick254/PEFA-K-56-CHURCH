import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WEB_BASE_URL = "https://pefak56church.top";

// Helper function to generate email content
function generateEmailContent(table: string, record: any) {
  const itemUrl = record.url || `${WEB_BASE_URL}/${table}/${record.id}`;
  let subject = "New Update from PEFA Kawangware 56";
  let contentHtml = "";

  switch (table) {
    case "sermons":
      subject = `New Sermon: ${record.title}`;
      contentHtml = `
        <h2 style="font-size: 14px; font-weight: 800; color: #cc0000; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">
          Latest Sermon & Teaching
        </h2>
        <div style="margin-bottom: 12px; padding: 12px; background-color: #f8fafc; border-left: 3px solid #0f172a; border-radius: 2px;">
          <h3 style="margin: 0 0 4px 0; font-size: 15px; color: #0f172a;">${record.title}</h3>
          <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">Preacher: ${record.preacher || 'Ministry Team'}</p>
          <a href="${itemUrl}" style="display: inline-block; font-size: 12px; font-weight: 700; color: #cc0000; text-decoration: none;">WATCH BROADCAST &rarr;</a>
        </div>
      `;
      break;
    case "posts":
      subject = `New Article: ${record.title}`;
      contentHtml = `
        <h2 style="font-size: 14px; font-weight: 800; color: #cc0000; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">
          Article & Devotional
        </h2>
        <div style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #e2e8f0;">
          <h3 style="margin: 0 0 4px 0; font-size: 15px; color: #0f172a;">${record.title}</h3>
          <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.4;">${record.content ? record.content.substring(0, 130) + '...' : ''}</p>
          <a href="${itemUrl}" style="display: inline-block; font-size: 12px; font-weight: 700; color: #cc0000; text-decoration: none;">READ MORE &rarr;</a>
        </div>
      `;
      break;
    case "events":
      subject = `New Event: ${record.title}`;
      contentHtml = `
        <h2 style="font-size: 14px; font-weight: 800; color: #cc0000; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">
          Upcoming Gathering
        </h2>
        <div style="margin-bottom: 12px; padding: 12px; background-color: #f8fafc; border-left: 3px solid #cc0000; border-radius: 2px;">
          <h3 style="margin: 0 0 4px 0; font-size: 15px; color: #0f172a;">${record.title}</h3>
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #475569;">${record.description || ''}</p>
          <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">DATE: ${record.date ? new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBA'}</span>
        </div>
      `;
      break;
    case "prayers":
      subject = `New Prayer Request: ${record.title}`;
      contentHtml = `
        <h2 style="font-size: 14px; font-weight: 800; color: #cc0000; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">
          Community Prayer Intention
        </h2>
        <div style="margin-bottom: 8px; padding: 8px 12px; background-color: #f1f5f9; border-radius: 2px;">
          <strong style="font-size: 13px; color: #0f172a;">${record.title}</strong>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">${record.request || ''}</p>
        </div>
      `;
      break;
  }

  return { subject, contentHtml };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const payload = await req.json();
    const { type, table, record } = payload;

    if (type !== 'INSERT' || !record) {
      return new Response(JSON.stringify({ message: "Payload is not for a new record, skipping." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { subject, contentHtml } = generateEmailContent(table, record);
    if (!contentHtml) {
      return new Response(JSON.stringify({ message: `No email template for table: ${table}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all users
    let allUsers: any[] = [];
    let page = 1;
    const perPage = 1000;
    let hasMore = true;
    while (hasMore) {
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers({ page, perPage });
      if (userError) throw userError;
      if (users && users.length > 0) {
        allUsers = allUsers.concat(users);
        page++;
        if (users.length < perPage) hasMore = false;
      } else {
        hasMore = false;
      }
    }
    const recipientEmails: string[] = allUsers.map((u) => u.email).filter((email): email is string => Boolean(email));

    if (recipientEmails.length === 0) {
      return new Response(JSON.stringify({ message: "No recipients found." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const brevoApiKey = Deno.env.get("BREVO_API_KEY") ?? "";
    const senderEmail = Deno.env.get("SENDER_EMAIL") || "infor@pefak56church.top";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 24px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden;">
                <tr>
                  <td style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 4px solid #cc0000;">
                    <img src="https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png" alt="PEFA Logo" style="height: 48px; width: 48px; margin-bottom: 8px;" />
                    <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; text-transform: uppercase;">PEFA KAWANGWARE 56 CHURCH</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px;">
                    ${contentHtml}
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                    <p style="margin: 0;">You are receiving this update because you are a registered member.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailPayload = {
      sender: { name: "PEFA KAWANGWARE 56 CHURCH", email: senderEmail },
      to: recipientEmails.map((email) => ({ email })),
      subject,
      htmlContent,
    };

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(JSON.stringify(errorData));
    }

    return new Response(JSON.stringify({ message: "Update sent successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
