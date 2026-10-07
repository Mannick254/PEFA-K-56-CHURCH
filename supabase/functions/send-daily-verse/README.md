# Send Daily Verse Function

This function sends a daily Bible verse to all registered users of the PEFA Kawangware 56 Church application.

## Features

- Fetches the verse of the day from the Manna API.
- Retrieves all registered users from the Supabase database.
- Sends a formatted email to each user with the verse of the day.
- Includes the PEFA 56 logo in the email.
- The sender is displayed as "PEFA KAWANGWARE 56 CHURCH".
- A "Powered by PEFAK56 ICT TEAM" line is included in the email footer.

## Deployment

This function is deployed as a Supabase Edge Function and is triggered by a cron job to run daily.
