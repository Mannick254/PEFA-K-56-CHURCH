# WhatsApp Daily Verse Bot

This Supabase Edge Function sends a daily Bible verse to a specified WhatsApp group using the Baileys library.

## Setup

1. **Get Your WhatsApp Group ID**
   - To send messages to a specific group, you need to obtain its Group ID. The easiest way to get the Group ID is to be an admin of the group, open WhatsApp Web, and in the group chat, go to Group Info. The Group ID will be in the URL, usually in the format `xxxxxxxxxx@g.us`.

2. **Set Environment Variables**
   - You need to set the `WHATSAPP_GROUP_ID` as an environment variable in your Supabase project. You can do this in your project's settings on the Supabase dashboard.

3. **Deploy the Function**
   - Deploy the function to your Supabase project.

4. **Initial Run and Authentication**
   - On the first run, the function will generate a QR code that you need to scan with your WhatsApp app to authenticate. You can find the QR code in the function logs.
   - To view the logs, go to the Edge Functions section in your Supabase project dashboard, select the `whatsapp-bot` function, and navigate to the logs tab.
   - **Note:** In a serverless environment, the authentication state might be lost when the function instance is recycled. For a more robust solution, you should store the `baileys_auth_info` directory in a persistent storage like Supabase Storage.

## Invoking the Function

You can invoke the function by sending a `POST` request to its endpoint. You can also set up a cron job to trigger the function daily.

## Customizing the Verse Logic

The current implementation uses a placeholder verse. To fetch a real daily verse, you can adapt the logic from the `send-daily-verse` function or integrate any other Bible API.
