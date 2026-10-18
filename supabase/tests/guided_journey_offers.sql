-- =============================================================================
-- Guided Journey — mentor offers and the waiting list (manual, local only)
--
--   psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/guided_journey_offers.sql
--
-- Runs in a transaction and rolls back. Expects the adopt-a-beginner seed
-- (it creates the community fixtures it needs).
-- =============================================================================
begin;
insert into auth.users (id, email, raw_user_meta_data) values
 ('00000000-0000-0000-0000-0000000000a1','o@x.test','{"full_name":"Owner"}'),
 ('00000000-0000-0000-0000-0000000000b1','m@x.test','{"full_name":"Mara Mentor"}'),
 ('00000000-0000-0000-0000-0000000000c1','b@x.test','{"full_name":"Ben Beginner"}'),
 ('00000000-0000-0000-0000-0000000000d1','x@x.test','{"full_name":"Xan Member"}'),
 ('00000000-0000-0000-0000-0000000000e1','h@x.test','{"full_name":"Hidden Beginner"}')
on conflict do nothing;
insert into public.communities (id, name, slug, owner_id, privacy) values
 ('11111111-1111-1111-1111-1111111111a1','Offer Test','offer-test','00000000-0000-0000-0000-0000000000a1','public') on conflict do nothing;
insert into public.community_memberships (user_id, community_id, role, status)
select u::uuid, '11111111-1111-1111-1111-1111111111a1', case when u like '%a1' then 'owner' else 'member' end::membership_role, 'active'
from unnest(array['00000000-0000-0000-0000-0000000000a1','00000000-0000-0000-0000-0000000000b1','00000000-0000-0000-0000-0000000000c1','00000000-0000-0000-0000-0000000000d1','00000000-0000-0000-0000-0000000000e1']) u
on conflict do nothing;
insert into public.spaces (id, community_id, name, slug, visibility, space_type)
values ('22222222-2222-2222-2222-2222222222a1','11111111-1111-1111-1111-1111111111a1','Adopt','adopt','public','guided_journey') on conflict do nothing;
insert into public.guided_journey_spaces (space_id) values ('22222222-2222-2222-2222-2222222222a1') on conflict do nothing;

create or replace function pg_temp.as_user(uid text) returns void language plpgsql as $$
begin perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, false);
perform set_config('request.jwt.claim.sub', uid, false); perform set_config('role','authenticated',false); end $$;

-- Two beginners sign up (one hides from the waiting list) before any mentor exists.
select pg_temp.as_user('00000000-0000-0000-0000-0000000000c1');
insert into public.journey_beginner_profiles (space_id, user_id, region, interests, approx_location, notes, adult_confirmed_at)
 values ('22222222-2222-2222-2222-2222222222a1', auth.uid(), 'London', '{vegetables}', 'Near the park', 'secret note', now());
reset role;
select pg_temp.as_user('00000000-0000-0000-0000-0000000000e1');
insert into public.journey_beginner_profiles (space_id, user_id, interests, listed_for_offers, adult_confirmed_at)
 values ('22222222-2222-2222-2222-2222222222a1', auth.uid(), '{flowers}', false, now());
reset role;

-- A matching mentor joins -> Ben (vegetables) is told; the flowers beginner is not.
select pg_temp.as_user('00000000-0000-0000-0000-0000000000b1');
insert into public.journey_mentor_profiles (space_id, user_id, experience, capacity, intro, adult_confirmed_at)
 values ('22222222-2222-2222-2222-2222222222a1', auth.uid(), '{vegetables}', 2, 'I grow veg', now());
reset role;
select (select count(*) from notifications where user_id='00000000-0000-0000-0000-0000000000c1' and type='journey_mentor_available') as ben_told_1,
       (select count(*) from notifications where user_id='00000000-0000-0000-0000-0000000000e1' and type='journey_mentor_available') as hidden_told_0;

-- The mentor sees the waiting list: Ben only (the other opted out), without private fields.
select pg_temp.as_user('00000000-0000-0000-0000-0000000000b1');
select count(*) as waiting_1, max(region) as region from public.waiting_beginners('22222222-2222-2222-2222-2222222222a1');
-- An ordinary member who isn't a mentor sees nobody.
reset role; select pg_temp.as_user('00000000-0000-0000-0000-0000000000d1');
select count(*) as member_sees_0 from public.waiting_beginners('22222222-2222-2222-2222-2222222222a1');
-- ...and can't make an offer.
do $$ begin
  insert into public.mentorship_requests (space_id, beginner_id, mentor_id, initiated_by)
  values ('22222222-2222-2222-2222-2222222222a1','00000000-0000-0000-0000-0000000000c1', auth.uid(), 'mentor');
  raise exception 'FAIL non-mentor offered';
exception when insufficient_privilege then raise notice 'ok non-mentor cannot offer'; end $$;
reset role;

-- The mentor can't offer to the beginner who opted out, but can offer to Ben.
select pg_temp.as_user('00000000-0000-0000-0000-0000000000b1');
do $$ begin
  insert into public.mentorship_requests (space_id, beginner_id, mentor_id, initiated_by)
  values ('22222222-2222-2222-2222-2222222222a1','00000000-0000-0000-0000-0000000000e1', auth.uid(), 'mentor');
  raise exception 'FAIL offered to unlisted beginner';
exception when insufficient_privilege then raise notice 'ok unlisted beginner protected'; end $$;
-- A mentor can't disguise an offer as the beginner's own request.
do $$ begin
  insert into public.mentorship_requests (space_id, beginner_id, mentor_id, initiated_by)
  values ('22222222-2222-2222-2222-2222222222a1','00000000-0000-0000-0000-0000000000c1', auth.uid(), 'beginner');
  raise exception 'FAIL forged beginner request';
exception when insufficient_privilege then raise notice 'ok cannot forge initiator'; end $$;
insert into public.mentorship_requests (space_id, beginner_id, mentor_id, initiated_by, message)
 values ('22222222-2222-2222-2222-2222222222a1','00000000-0000-0000-0000-0000000000c1', auth.uid(), 'mentor', 'Happy to help!') returning id as offer \gset
-- Now (and only now) the mentor can read Ben's full profile.
select count(*) as mentor_sees_profile_1 from public.journey_beginner_profiles where user_id='00000000-0000-0000-0000-0000000000c1';
-- The mentor cannot accept their own offer.
do $$ begin perform public.respond_to_mentorship_request((select id from mentorship_requests where initiated_by='mentor' limit 1), true);
  raise exception 'FAIL mentor accepted own offer';
exception when raise_exception then if sqlerrm like 'FAIL%' then raise; end if; raise notice 'ok initiator cannot accept: %', sqlerrm; end $$;
reset role;
select count(*) as ben_offer_notified_1 from notifications where user_id='00000000-0000-0000-0000-0000000000c1' and type='journey_request';
-- Ben is no longer on the waiting list while the offer is pending.
select pg_temp.as_user('00000000-0000-0000-0000-0000000000b1');
select count(*) as waiting_now_0 from public.waiting_beginners('22222222-2222-2222-2222-2222222222a1');
reset role;

-- Ben accepts -> journey created, Mara notified.
select pg_temp.as_user('00000000-0000-0000-0000-0000000000c1');
select public.respond_to_mentorship_request(:'offer', true, 'Yes please') is not null as journey_created;
reset role;
select (select count(*) from journey_participants jp join journeys j on j.id = jp.journey_id where j.space_id='22222222-2222-2222-2222-2222222222a1') as participants_2,
       (select count(*) from notifications where user_id='00000000-0000-0000-0000-0000000000b1' and type='journey_request_response') as mara_told_1;

-- Withdraw: only the initiator, and only while pending.
select pg_temp.as_user('00000000-0000-0000-0000-0000000000b1');
do $$ begin perform public.withdraw_mentorship_request((select id from mentorship_requests where initiated_by='mentor' limit 1));
  raise exception 'FAIL withdrew answered offer';
exception when raise_exception then if sqlerrm like 'FAIL%' then raise; end if; raise notice 'ok answered offer cannot be withdrawn'; end $$;
reset role;
select 'ALL DONE';
rollback;
