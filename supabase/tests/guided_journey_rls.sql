-- =============================================================================
-- Guided Journey (Adopt a Beginner) — RLS and workflow checks
--
-- NOT a migration (nothing under supabase/tests is applied by the pipeline).
-- Run by hand against a LOCAL database that already has every migration
-- applied; it creates fixtures inside a transaction and rolls back:
--
--   psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/guided_journey_rls.sql
--
-- Checks: outsiders/blocked members can't see mentors; requests need a
-- beginner profile; only the mentor can accept; capacity is enforced; guard
-- triggers stop status/verification edits; notifications fire; stories are
-- public only when published and only staff can hide them.
-- =============================================================================
begin;
\set ON_ERROR_STOP 1
-- fixtures (as postgres)
insert into auth.users (id, email, raw_user_meta_data) values
 ('00000000-0000-0000-0000-00000000000a','owner@x.test','{"full_name":"Owner"}'),
 ('00000000-0000-0000-0000-00000000000b','mentor@x.test','{"full_name":"Mara Mentor"}'),
 ('00000000-0000-0000-0000-00000000000c','beginner@x.test','{"full_name":"Ben Beginner"}'),
 ('00000000-0000-0000-0000-00000000000d','outsider@x.test','{"full_name":"Olly Outsider"}'),
 ('00000000-0000-0000-0000-00000000000e','member2@x.test','{"full_name":"Bea Blocked"}')
on conflict do nothing;
insert into public.communities (id, name, slug, owner_id, privacy) values
 ('11111111-1111-1111-1111-111111111111','Natures Gardeners','naturesgardeners','00000000-0000-0000-0000-00000000000a','public') on conflict do nothing;
insert into public.community_memberships (user_id, community_id, role, status) values
 ('00000000-0000-0000-0000-00000000000a','11111111-1111-1111-1111-111111111111','owner','active'),
 ('00000000-0000-0000-0000-00000000000b','11111111-1111-1111-1111-111111111111','member','active'),
 ('00000000-0000-0000-0000-00000000000c','11111111-1111-1111-1111-111111111111','member','active'),
 ('00000000-0000-0000-0000-00000000000e','11111111-1111-1111-1111-111111111111','member','active')
on conflict do nothing;
\ir ../migrations/20261008181812_adopt_a_beginner_natures_gardeners.sql
select s.id as space_id from public.spaces s where slug='adopt-a-beginner' \gset
select count(*) as templates from public.journey_templates where space_id=:'space_id';
select id as tpl_id from public.journey_templates where space_id=:'space_id' and sort_order=0 \gset

create or replace function pg_temp.as_user(uid text) returns void language plpgsql as $$
begin perform set_config('request.jwt.claim.sub', uid, false); perform set_config('role','authenticated',false); end $$;

-- anon can read config, templates
set role anon; select set_config('request.jwt.claim.sub','',false);
select count(*) as anon_templates from public.journey_templates where space_id=:'space_id';
select count(*) as anon_mentors from public.journey_mentor_profiles;
reset role;

-- mentor onboards
select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
insert into public.journey_mentor_profiles (space_id, user_id, experience, languages, capacity, adult_confirmed_at, is_verified, status, intro)
values (:'space_id','00000000-0000-0000-0000-00000000000b','{vegetables,tomatoes}','{English}',1, now(), true, 'suspended', 'I grow tomatoes');
select is_verified as mentor_self_verified_blocked, status from public.journey_mentor_profiles where user_id='00000000-0000-0000-0000-00000000000b';
reset role;

-- outsider (non-member) cannot see mentor nor create profile
select pg_temp.as_user('00000000-0000-0000-0000-00000000000d');
select count(*) as outsider_sees_mentors from public.journey_mentor_profiles;
do $$ begin
  insert into public.journey_beginner_profiles (space_id, user_id, adult_confirmed_at) values ((select id from spaces where slug='adopt-a-beginner'),'00000000-0000-0000-0000-00000000000d', now());
  raise exception 'FAIL outsider inserted beginner profile';
exception when insufficient_privilege then raise notice 'ok outsider blocked'; end $$;
reset role;

-- beginner: cannot request before profile
select pg_temp.as_user('00000000-0000-0000-0000-00000000000c');
select count(*) as beginner_sees_mentors from public.journey_mentor_profiles;
do $$ begin
  insert into public.mentorship_requests (space_id, beginner_id, mentor_id) values ((select id from spaces where slug='adopt-a-beginner'),'00000000-0000-0000-0000-00000000000c','00000000-0000-0000-0000-00000000000b');
  raise exception 'FAIL request without profile';
exception when insufficient_privilege then raise notice 'ok request needs profile'; end $$;
insert into public.journey_beginner_profiles (space_id, user_id, country, setting, interests, experience, help_mode, adult_confirmed_at)
 values (:'space_id','00000000-0000-0000-0000-00000000000c','UK','{balcony}','{vegetables}','complete_beginner','online', now());
insert into public.mentorship_requests (space_id, beginner_id, mentor_id, template_id, message)
 values (:'space_id','00000000-0000-0000-0000-00000000000c','00000000-0000-0000-0000-00000000000b',:'tpl_id','Please help me grow tomatoes') returning id as req_id \gset
-- beginner can't accept own request
do $$ begin perform public.respond_to_mentorship_request((select id from mentorship_requests limit 1), true); raise exception 'FAIL beginner accepted';
exception when raise_exception then if sqlerrm like 'FAIL%' then raise; end if; raise notice 'ok beginner cannot accept: %', sqlerrm; end $$;
-- beginner can't update request directly
update public.mentorship_requests set status='accepted' where id=:'req_id';
reset role;
select status as still_pending from public.mentorship_requests where id=:'req_id';
select count(*) as mentor_notified from public.notifications where user_id='00000000-0000-0000-0000-00000000000b' and type='journey_request';

-- mentor sees beginner profile now and accepts
select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
select count(*) as mentor_sees_beginner_profile from public.journey_beginner_profiles;
select public.respond_to_mentorship_request(:'req_id', true, 'Yes!') as journey_id \gset
reset role;
select title, status from public.journeys where id=:'journey_id';
select count(*) as milestones from public.journey_milestones where journey_id=:'journey_id';
select count(*) as beginner_notified from public.notifications where user_id='00000000-0000-0000-0000-00000000000c' and type='journey_request_response';

-- capacity: member2 asks, mentor full
select pg_temp.as_user('00000000-0000-0000-0000-00000000000e');
insert into public.journey_beginner_profiles (space_id, user_id, adult_confirmed_at) values (:'space_id','00000000-0000-0000-0000-00000000000e', now());
insert into public.mentorship_requests (space_id, beginner_id, mentor_id) values (:'space_id','00000000-0000-0000-0000-00000000000e','00000000-0000-0000-0000-00000000000b') returning id as req2 \gset
select count(*) as m2_sees_journey from public.journeys;
reset role;
select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
do $$ begin perform public.respond_to_mentorship_request((select id from mentorship_requests where beginner_id='00000000-0000-0000-0000-00000000000e'), true);
 raise exception 'FAIL over capacity'; exception when raise_exception then if sqlerrm like 'FAIL%' then raise; end if; raise notice 'ok capacity: %', sqlerrm; end $$;
select public.respond_to_mentorship_request(:'req2', false, 'Sorry, full') is null as declined;
reset role;

-- block: member2 blocks mentor -> can't see mentor
insert into public.member_blocks (blocker_id, blocked_id) values ('00000000-0000-0000-0000-00000000000e','00000000-0000-0000-0000-00000000000b');
select pg_temp.as_user('00000000-0000-0000-0000-00000000000e');
select count(*) as blocked_sees_mentor from public.journey_mentor_profiles where user_id='00000000-0000-0000-0000-00000000000b';
reset role;

-- beginner posts an update; mentor replies; milestones
select pg_temp.as_user('00000000-0000-0000-0000-00000000000c');
insert into public.journey_updates (journey_id, author_id, body, question, photos) values (:'journey_id','00000000-0000-0000-0000-00000000000c','Shoots!','Too much water?','{https://x/a.jpg}') returning id as upd \gset
update public.journey_milestones set status='done', completed_at=now(), completed_by=auth.uid() where journey_id=:'journey_id' and position=0;
-- beginner tries to complete status directly (guard)
update public.journeys set status='completed', title='Tomatoes on my balcony' where id=:'journey_id';
reset role;
select status as status_guarded, title from public.journeys where id=:'journey_id';
select count(*) as mentor_update_notif from public.notifications where user_id='00000000-0000-0000-0000-00000000000b' and type='journey_update';
select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
insert into public.journey_updates (journey_id, author_id, parent_id, body) values (:'journey_id','00000000-0000-0000-0000-00000000000b',:'upd','Water less, every 3 days');
update public.journey_participants set in_person_ok=true, role='beginner' where journey_id=:'journey_id' and user_id=auth.uid();
reset role;
select role, in_person_ok from public.journey_participants where journey_id=:'journey_id' order by role;
-- outsider/other member can't see journey updates
select pg_temp.as_user('00000000-0000-0000-0000-00000000000e');
select count(*) as other_sees_updates from public.journey_updates;
do $$ begin insert into public.journey_updates (journey_id, author_id, body) values ((select id from journeys limit 1),'00000000-0000-0000-0000-00000000000e','hi'); raise exception 'FAIL';
exception when insufficient_privilege then raise notice 'ok non-participant cannot post'; end $$;
-- report
insert into public.journey_reports (space_id, reporter_id, reported_user_id, reason, details) values (:'space_id','00000000-0000-0000-0000-00000000000e','00000000-0000-0000-0000-00000000000b','spam','test');
reset role;
select count(*) as staff_report_notif from public.notifications where user_id='00000000-0000-0000-0000-00000000000a' and type='journey_report';

-- complete & story
select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
select public.complete_journey(:'journey_id', 'So proud of Ben');
reset role;
select status, mentor_acknowledgement from public.journeys where id=:'journey_id';
select count(*) as completed_notif from public.notifications where user_id='00000000-0000-0000-0000-00000000000c' and type='journey_completed';
select pg_temp.as_user('00000000-0000-0000-0000-00000000000c');
insert into public.journey_stories (journey_id, space_id, author_id, title, status, show_mentor) values (:'journey_id', :'space_id', auth.uid(), 'My tomatoes', 'published', true) returning id as story \gset
update public.journey_stories set status='hidden' where id=:'story';
reset role;
select status, show_mentor, mentor_id is not null as has_mentor, published_at is not null as published from public.journey_stories where id=:'story';
select pg_temp.as_user('00000000-0000-0000-0000-00000000000b');
update public.journey_stories set show_mentor=true, title='hacked' where id=:'story';
reset role;
select title, show_mentor from public.journey_stories where id=:'story';
set role anon; select set_config('request.jwt.claim.sub','',false);
select count(*) as anon_sees_story from public.journey_stories;
reset role;
-- staff hides
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
update public.journey_stories set status='hidden', hidden_reason='test' where id=:'story';
select count(*) as staff_sees_reports from public.journey_reports;
reset role;
set role anon; select count(*) as anon_sees_hidden from public.journey_stories; reset role;
-- end journey (new one) by beginner
select 'ALL DONE';
rollback;
