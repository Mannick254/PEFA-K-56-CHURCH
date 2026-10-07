import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
)

serve(async (req) => {
  const { record } = await req.json()

  // Fetch subscriptions from the database
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select('*')

  if (error) {
    console.error('Error fetching subscriptions:', error)
    return new Response('Error fetching subscriptions', { status: 500 })
  }

  // Create a notification payload
  const payload = JSON.stringify({
    title: 'New Event',
    body: record.title,
    data: { url: `/events/${record.id}` },
  })

  // Send a push notification to each subscriber
  for (const subscription of subscriptions) {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `key=${Deno.env.get('FCM_SERVER_KEY')}`,
      },
      body: JSON.stringify({
        to: subscription.endpoint,
        notification: payload,
      }),
    })

    if (!response.ok) {
      console.error(
        `Failed to send notification to ${subscription.endpoint}`,
        await response.text()
      )
    }
  }

  return new Response('Notifications sent', { status: 200 })
})
