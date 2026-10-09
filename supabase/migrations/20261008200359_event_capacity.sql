-- Optional capacity for an event ("12 places left").
--
--   events.capacity     — null = unlimited (every existing event).
--   enforce trigger     — an RSVP past capacity is refused in the database,
--                         not just hidden in the UI. The event row is locked
--                         first so two last-place RSVPs can't both land.
--   event_rsvp_counts() — how many are going, per event, for the "places
--                         left" line. Security definer so a guest who can't
--                         read the attendee list still gets an honest count;
--                         it returns numbers only, never who.

alter table public.events
  add column if not exists capacity integer;

alter table public.events
  drop constraint if exists events_capacity_positive,
  add constraint events_capacity_positive check (capacity is null or capacity > 0);

create or replace function public.enforce_event_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cap integer;
  going integer;
begin
  select capacity into cap from public.events where id = new.event_id for update;
  if cap is null then
    return new;
  end if;
  select count(*) into going from public.event_rsvps where event_id = new.event_id;
  if going >= cap then
    raise exception 'This event is full.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists event_rsvps_enforce_capacity on public.event_rsvps;
create trigger event_rsvps_enforce_capacity
  before insert on public.event_rsvps
  for each row execute function public.enforce_event_capacity();

create or replace function public.event_rsvp_counts(p_event_ids uuid[])
returns table (event_id uuid, going integer)
language sql
stable
security definer
set search_path = public
as $$
  select r.event_id, count(*)::integer
  from public.event_rsvps r
  where r.event_id = any(p_event_ids)
  group by r.event_id;
$$;

revoke all on function public.event_rsvp_counts(uuid[]) from public;
grant execute on function public.event_rsvp_counts(uuid[]) to anon, authenticated;
