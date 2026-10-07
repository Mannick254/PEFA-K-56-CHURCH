create or replace function public.notify_new_sermon() 
returns trigger as $$
declare
begin
  perform supabase_functions.http_request(
    'https://xqoahfznbplhqdxnyyuj.supabase.co/functions/v1/send-sermon-notification',
    'POST',
    '{"Content-Type":"application/json"}',
    json_build_object('record', row_to_json(new))::text
  );
  return new;
end;
$$ language plpgsql;

create trigger on_new_sermon
  after insert on public.sermons
  for each row execute procedure public.notify_new_sermon();