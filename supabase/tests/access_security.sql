-- =============================================================================
-- Access security — who can open what, through the API
--
-- NOT a migration (nothing under supabase/tests is applied by the pipeline).
-- Run by hand against a LOCAL database that already has every migration
-- applied; it creates fixtures inside a transaction and rolls back:
--
--   psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/access_security.sql
--
-- Every check runs as the API would: role anon or authenticated, with
-- auth.uid() set, so RLS is what answers. Covers 20261021092311_access_security_fixes:
-- membership rows can't be rewritten by their own member (banned stays
-- banned, no moving into another community), paid content needs the
-- membership as well as the subscription, paid course lessons need an
-- enrolment, and the course outline stays readable. Also re-checks the
-- invite-only communities keep even their Public spaces to members, and the
-- behaviour those fixes must not change (free spaces, public spaces, the team,
-- accepting an invite, free courses).
-- =============================================================================
begin;
\set ON_ERROR_STOP 1

-- --- helpers -----------------------------------------------------------------
-- Rows a query returns for a viewer (null uid = signed-out visitor).
create function pg_temp.n(p_uid uuid, p_sql text) returns bigint language plpgsql as $$
declare r bigint;
begin
  perform set_config('request.jwt.claim.sub', coalesce(p_uid::text, ''), true);
  if p_uid is null then set local role anon; else set local role authenticated; end if;
  execute 'select count(*) from (' || p_sql || ') q' into r;
  reset role;
  return r;
end $$;

-- Run a write as a viewer: 'ok:<rows>' or the error message.
create function pg_temp.w(p_uid uuid, p_sql text) returns text language plpgsql as $$
declare r bigint;
begin
  perform set_config('request.jwt.claim.sub', coalesce(p_uid::text, ''), true);
  set local role authenticated;
  begin
    execute 'with x as (' || p_sql || ' returning 1) select count(*) from x' into r;
    reset role;
    return 'ok:' || r;
  exception when others then
    reset role;
    return sqlerrm;
  end;
end $$;

create function pg_temp.expect(p_label text, p_got anyelement, p_want anyelement) returns void language plpgsql as $$
begin
  if p_got is distinct from p_want then
    raise exception 'FAIL %: got %, want %', p_label, p_got, p_want;
  end if;
  raise notice 'ok  %', p_label;
end $$;

-- --- fixtures (as postgres) --------------------------------------------------
insert into auth.users (id, email, raw_user_meta_data) values
 ('a0000000-0000-0000-0000-000000000001','owner@x.test','{"full_name":"Owner"}'),
 ('a0000000-0000-0000-0000-000000000002','mod@x.test','{"full_name":"Moderator"}'),
 ('a0000000-0000-0000-0000-000000000003','free@x.test','{"full_name":"Free Member"}'),
 ('a0000000-0000-0000-0000-000000000004','paid@x.test','{"full_name":"Paid Member"}'),
 ('a0000000-0000-0000-0000-000000000005','left@x.test','{"full_name":"Left But Subscribed"}'),
 ('a0000000-0000-0000-0000-000000000006','banned@x.test','{"full_name":"Banned But Subscribed"}'),
 ('a0000000-0000-0000-0000-000000000007','invited@x.test','{"full_name":"Invited"}'),
 ('a0000000-0000-0000-0000-000000000008','outsider@x.test','{"full_name":"Outsider"}'),
 ('a0000000-0000-0000-0000-000000000009','enrolled@x.test','{"full_name":"Enrolled Learner"}'),
 ('a0000000-0000-0000-0000-00000000000a','expired@x.test','{"full_name":"Expired Sub"}')
on conflict do nothing;

insert into public.communities (id, name, slug, owner_id, privacy) values
 ('c0000000-0000-0000-0000-000000000001','Open Club','open-club-test','a0000000-0000-0000-0000-000000000001','public'),
 ('c0000000-0000-0000-0000-000000000002','Hidden Club','hidden-club-test','a0000000-0000-0000-0000-000000000001','invite_only');

insert into public.community_memberships (user_id, community_id, role, status) values
 ('a0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000001','moderator','active'),
 ('a0000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000001','member','active'),
 ('a0000000-0000-0000-0000-000000000004','c0000000-0000-0000-0000-000000000001','member','active'),
 ('a0000000-0000-0000-0000-000000000006','c0000000-0000-0000-0000-000000000001','member','banned'),
 ('a0000000-0000-0000-0000-000000000007','c0000000-0000-0000-0000-000000000001','member','invited'),
 ('a0000000-0000-0000-0000-000000000009','c0000000-0000-0000-0000-000000000001','member','active'),
 ('a0000000-0000-0000-0000-00000000000a','c0000000-0000-0000-0000-000000000001','member','active')
on conflict (user_id, community_id) do update set role = excluded.role, status = excluded.status;

insert into public.spaces (id, community_id, name, slug, visibility, price_cents) values
 ('50000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','Start here','start-here','public',0),
 ('50000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000001','Chat','chat','members',0),
 ('50000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000001','Team room','team-room','private',0),
 ('50000000-0000-0000-0000-000000000004','c0000000-0000-0000-0000-000000000001','Premium','premium','members',0),
 ('50000000-0000-0000-0000-000000000005','c0000000-0000-0000-0000-000000000001','Inner circle','inner-circle','private',0),
 ('50000000-0000-0000-0000-000000000006','c0000000-0000-0000-0000-000000000001','Masterclass','masterclass','members',500);

insert into public.community_tiers (id, community_id, name, price_cents) values
 ('70000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','Insider',1500);
insert into public.tier_spaces (tier_id, space_id) values
 ('70000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000004'),
 ('70000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000005');

insert into public.tier_subscriptions (tier_id, community_id, user_id, status, current_period_end) values
 ('70000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000004','active', now() + interval '20 days'),
 ('70000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000005','active', now() + interval '20 days'),
 ('70000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000006','active', now() + interval '20 days'),
 ('70000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-00000000000a','active', now() - interval '1 day');
insert into public.space_subscriptions (space_id, community_id, user_id, status, current_period_end) values
 ('50000000-0000-0000-0000-000000000006','c0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000004','active', now() + interval '20 days');

insert into public.posts (id, community_id, space_id, author_id, title) values
 ('90000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000001','Welcome'),
 ('90000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000001','Chat post'),
 ('90000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000001','Team post'),
 ('90000000-0000-0000-0000-000000000004','c0000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000001','Premium post'),
 ('90000000-0000-0000-0000-000000000005','c0000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000001','Inner circle post'),
 ('90000000-0000-0000-0000-000000000006','c0000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000006','a0000000-0000-0000-0000-000000000001','Masterclass post');

insert into public.courses (id, space_id, community_id, title, status, price_cents) values
 ('e0000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000001','Free course','published',0),
 ('e0000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000001','Paid course','published',2000);
insert into public.course_modules (id, course_id, community_id, title) values
 ('e1000000-0000-0000-0000-000000000001','e0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','Module'),
 ('e1000000-0000-0000-0000-000000000002','e0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000001','Module');
insert into public.course_lessons (module_id, course_id, community_id, title, body) values
 ('e1000000-0000-0000-0000-000000000001','e0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','Free lesson','free body'),
 ('e1000000-0000-0000-0000-000000000002','e0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000001','Paid lesson 1','paid body'),
 ('e1000000-0000-0000-0000-000000000002','e0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000001','Paid lesson 2','paid body');
insert into public.course_enrollments (course_id, user_id, paid) values
 ('e0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000009', true);

-- --- posts per viewer and space ----------------------------------------------
\set owner    '''a0000000-0000-0000-0000-000000000001'''
\set moder    '''a0000000-0000-0000-0000-000000000002'''
\set free     '''a0000000-0000-0000-0000-000000000003'''
\set paid     '''a0000000-0000-0000-0000-000000000004'''
\set leaver   '''a0000000-0000-0000-0000-000000000005'''
\set banned   '''a0000000-0000-0000-0000-000000000006'''
\set invited  '''a0000000-0000-0000-0000-000000000007'''
\set outsider '''a0000000-0000-0000-0000-000000000008'''
\set enrolled '''a0000000-0000-0000-0000-000000000009'''
\set expired  '''a0000000-0000-0000-0000-00000000000a'''

-- Each viewer's readable posts, as the set of titles. Six posts:
-- Welcome (public) · Chat (members) · Team (private) · Premium (members, tier)
-- · Inner circle (private, tier) · Masterclass (members, priced).
create temp table seen as
select v.label, (
  select string_agg(t, ',' order by t) from unnest(array['Welcome','Chat post','Team post','Premium post','Inner circle post','Masterclass post']) t
  where pg_temp.n(v.uid, format('select 1 from public.posts where title = %L', t)) > 0
) as titles
from (values
  ('visitor', null::uuid), ('owner', :owner::uuid), ('moderator', :moder::uuid), ('free', :free::uuid),
  ('paid', :paid::uuid), ('left-subscribed', :leaver::uuid), ('banned-subscribed', :banned::uuid),
  ('invited', :invited::uuid), ('outsider', :outsider::uuid), ('expired', :expired::uuid)
) v(label, uid);
grant select on seen to anon, authenticated;

select pg_temp.expect('visitor sees only the public space', (select titles from seen where label='visitor'), 'Welcome');
select pg_temp.expect('owner sees everything', (select titles from seen where label='owner'), 'Chat post,Inner circle post,Masterclass post,Premium post,Team post,Welcome');
select pg_temp.expect('moderator sees everything (team passes paywalls)', (select titles from seen where label='moderator'), 'Chat post,Inner circle post,Masterclass post,Premium post,Team post,Welcome');
select pg_temp.expect('free member: public + members, no paid, no team', (select titles from seen where label='free'), 'Chat post,Welcome');
select pg_temp.expect('paid member: tier + priced space, not team-only even if tiered', (select titles from seen where label='paid'), 'Chat post,Masterclass post,Premium post,Welcome');
select pg_temp.expect('left but still subscribed: public only', (select titles from seen where label='left-subscribed'), 'Welcome');
select pg_temp.expect('banned but still subscribed: public only', (select titles from seen where label='banned-subscribed'), 'Welcome');
select pg_temp.expect('invited (not accepted): public only', (select titles from seen where label='invited'), 'Welcome');
select pg_temp.expect('outsider: public only', (select titles from seen where label='outsider'), 'Welcome');
select pg_temp.expect('expired subscription: like a free member', (select titles from seen where label='expired'), 'Chat post,Welcome');

-- Cancellation: a canceled tier subscription stops access straight away.
update public.tier_subscriptions set status = 'canceled' where user_id = :paid::uuid;
select pg_temp.expect('canceled tier: premium closes', pg_temp.n(:paid::uuid, $q$select 1 from public.posts where title = 'Premium post'$q$), 0::bigint);
select pg_temp.expect('canceled tier: separate space sub still open', pg_temp.n(:paid::uuid, $q$select 1 from public.posts where title = 'Masterclass post'$q$), 1::bigint);
update public.tier_subscriptions set status = 'past_due' where user_id = :paid::uuid;
select pg_temp.expect('past_due tier: premium closed', pg_temp.n(:paid::uuid, $q$select 1 from public.posts where title = 'Premium post'$q$), 0::bigint);
update public.tier_subscriptions set status = 'trialing' where user_id = :paid::uuid;
select pg_temp.expect('trialing tier: premium open', pg_temp.n(:paid::uuid, $q$select 1 from public.posts where title = 'Premium post'$q$), 1::bigint);
-- Archived tier keeps existing subscribers.
update public.community_tiers set archived_at = now() where id = '70000000-0000-0000-0000-000000000001';
select pg_temp.expect('archived tier: existing subscriber keeps premium', pg_temp.n(:paid::uuid, $q$select 1 from public.posts where title = 'Premium post'$q$), 1::bigint);

-- Space shells: the paid space shows (to pay from), the team-only one doesn't.
select pg_temp.expect('free member sees the premium shell (paywall)', pg_temp.n(:free::uuid, $q$select 1 from public.spaces where slug = 'premium'$q$), 1::bigint);
select pg_temp.expect('free member does not see team-only shells', pg_temp.n(:free::uuid, $q$select 1 from public.spaces where visibility = 'private' and community_id = 'c0000000-0000-0000-0000-000000000001'$q$), 0::bigint);

-- --- membership rows ---------------------------------------------------------
select pg_temp.expect('banned member cannot unban themselves',
  pg_temp.w(:banned::uuid, $q$update public.community_memberships set status = 'active' where user_id = 'a0000000-0000-0000-0000-000000000006'$q$),
  'You can''t change your own membership status.');
select pg_temp.expect('member cannot move their row into a hidden community',
  pg_temp.w(:free::uuid, $q$update public.community_memberships set community_id = 'c0000000-0000-0000-0000-000000000002' where user_id = 'a0000000-0000-0000-0000-000000000003'$q$),
  'A membership can''t be moved to another person or community.');
select pg_temp.expect('member cannot change their own status',
  pg_temp.w(:free::uuid, $q$update public.community_memberships set status = 'invited' where user_id = 'a0000000-0000-0000-0000-000000000003'$q$),
  'You can''t change your own membership status.');
select pg_temp.expect('member cannot promote themselves',
  pg_temp.w(:free::uuid, $q$update public.community_memberships set role = 'moderator' where user_id = 'a0000000-0000-0000-0000-000000000003'$q$),
  'new row violates row-level security policy for table "community_memberships"');
select pg_temp.expect('invited member can accept (joinCommunity path)',
  pg_temp.w(:invited::uuid, $q$update public.community_memberships set status = 'active' where user_id = 'a0000000-0000-0000-0000-000000000007'$q$),
  'ok:1');
select pg_temp.expect('owner can ban a member',
  pg_temp.w(:owner::uuid, $q$update public.community_memberships set status = 'banned' where user_id = 'a0000000-0000-0000-0000-000000000003'$q$),
  'ok:1');
select pg_temp.expect('owner can unban a member',
  pg_temp.w(:owner::uuid, $q$update public.community_memberships set status = 'active' where user_id = 'a0000000-0000-0000-0000-000000000003'$q$),
  'ok:1');

-- --- courses -----------------------------------------------------------------
select pg_temp.expect('free member reads free course lessons', pg_temp.n(:free::uuid, $q$select 1 from public.course_lessons where course_id = 'e0000000-0000-0000-0000-000000000001'$q$), 1::bigint);
select pg_temp.expect('free member cannot read paid course lessons', pg_temp.n(:free::uuid, $q$select 1 from public.course_lessons where course_id = 'e0000000-0000-0000-0000-000000000002'$q$), 0::bigint);
select pg_temp.expect('enrolled learner reads paid course lessons', pg_temp.n(:enrolled::uuid, $q$select 1 from public.course_lessons where course_id = 'e0000000-0000-0000-0000-000000000002'$q$), 2::bigint);
select pg_temp.expect('moderator reads paid course lessons', pg_temp.n(:moder::uuid, $q$select 1 from public.course_lessons where course_id = 'e0000000-0000-0000-0000-000000000002'$q$), 2::bigint);
select pg_temp.expect('free member still sees the paid course outline', pg_temp.n(:free::uuid, $q$select 1 from public.course_lesson_outline(array['e0000000-0000-0000-0000-000000000002'::uuid])$q$), 2::bigint);
select pg_temp.expect('outsider gets no outline of a members-space course', pg_temp.n(:outsider::uuid, $q$select 1 from public.course_lesson_outline(array['e0000000-0000-0000-0000-000000000002'::uuid])$q$), 0::bigint);

-- --- invite-only communities ------------------------------------------------
insert into public.spaces (id, community_id, name, slug, visibility) values
 ('50000000-0000-0000-0000-000000000007','c0000000-0000-0000-0000-000000000002','Lobby','lobby','public');
insert into public.posts (community_id, space_id, author_id, title) values
 ('c0000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000007','a0000000-0000-0000-0000-000000000001','Hidden lobby post');
select pg_temp.expect('visitor cannot read a hidden community''s public space', pg_temp.n(null, $q$select 1 from public.posts where title = 'Hidden lobby post'$q$), 0::bigint);
select pg_temp.expect('visitor cannot list a hidden community''s spaces', pg_temp.n(null, $q$select 1 from public.spaces where slug = 'lobby'$q$), 0::bigint);
select pg_temp.expect('outsider cannot read a hidden community''s public space', pg_temp.n(:outsider::uuid, $q$select 1 from public.posts where title = 'Hidden lobby post'$q$), 0::bigint);
select pg_temp.expect('owner reads their hidden community''s public space', pg_temp.n(:owner::uuid, $q$select 1 from public.posts where title = 'Hidden lobby post'$q$), 1::bigint);

-- --- security-definer paths keep working -------------------------------------
-- redeem_invite runs as its owner, so it may still turn an invite into a seat.
insert into public.community_invites (community_id, code, created_by, role)
values ('c0000000-0000-0000-0000-000000000002', 'test-invite-code', 'a0000000-0000-0000-0000-000000000001', 'member');
select set_config('request.jwt.claim.sub', 'a0000000-0000-0000-0000-000000000008', true);
set local role authenticated;
select pg_temp.expect('outsider redeems an invite to the hidden community', (select error from public.redeem_invite('test-invite-code')), null::text);
reset role;
select pg_temp.expect('after redeeming, they read the hidden community''s public space', pg_temp.n(:outsider::uuid, $q$select 1 from public.posts where title = 'Hidden lobby post'$q$), 1::bigint);

rollback;
