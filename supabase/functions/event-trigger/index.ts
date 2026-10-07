import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

serve(async (req) => {
  const { record } = await req.json()

  // Here you can add your logic to send a notification.
  // For now, we will just log the record to the console.
  console.log("New event:", record)

  return new Response(
    JSON.stringify({ message: "ok" }),
    { headers: { "Content-Type": "application/json" } },
  )
})
