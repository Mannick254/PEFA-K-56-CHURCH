create or replace function on_new_event() 
returns trigger as $$
begin
  perform supabase.functions.invoke('event-trigger', json_build_object('record', row_to_json(new)));
  return new;
end;
$$ language plpgsql;

create trigger on_new_event_trigger
  after insert on public.events
  for each row
  execute function on_new_event();
