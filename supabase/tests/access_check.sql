-- =============================================================================
-- Access Check — access_check(space, user)
--
-- NOT a migration. Run by hand against a LOCAL database with every migration
-- applied; fixtures live in a transaction that is rolled back:
--
--   psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/access_check.sql
--
-- Checks that only the community's admins can ask, only about people in that
-- community, that the answers match the RLS functions for each kind of person,
-- and that every check is logged.
-- =============================================================================
begin;
\set ON_ERROR_STOP 1

-- Run access_check as p_caller; 'denied' when it refuses.
create function pg_temp.chk(p_caller uuid, p_space uuid, p_subject uuid) returns jsonb language plpgsql as $$
declare r jsonb;
begin
  perform set_config('request.jwt.claim.sub', coalesce(p_caller::text, ''), true);
  if p_caller is null then set local role anon; else set local role authenticated; end if;
  begin
    r := public.access_check(p_space, p_subject);
    reset role;
    return r;
  exception when others then
    reset role;
    return '"denied"'::jsonb;
  end;
end $$;

create function pg_temp.expect(p_label text, p_got anyelement, p_want anyelement) returns void language plpgsql as $$
begin
  if p_got is distinct from p_want then
    raise exception 'FAIL %: got %, want %', p_label, p_got, p_want;
  end if;
  raise notice 'ok  %', p_label;
end $$;

insert into auth.users (id, email, raw_user_meta_data) values
 ('ac000000-0000-0000-0000-000000000001','owner@ac.test','{"full_name":"Owner"}'),
 ('ac000000-0000-0000-0000-000000000002','admin@ac.test','{"full_name":"Admin"}'),
 ('ac000000-0000-0000-0000-000000000003','member@ac.test','{"full_name":"Member"}'),
 ('ac000000-0000-0000-0000-000000000004','paid@ac.test','{"full_name":"Paid"}'),
 ('ac000000-0000-0000-0000-000000000005','banned@ac.test','{"full_name":"Banned"}'),
 ('ac000000-0000-0000-0000-000000000006','outsider@ac.test','{"full_name":"Outsider"}')
on conflict do nothing;

insert into public.communities (id, name, slug, owner_id, privacy) values
 ('ac100000-0000-0000-0000-000000000001','Check','ac-check','ac000000-0000-0000-0000-000000000001','public'),
 ('ac100000-0000-0000-0000-000000000002','Other','ac-other','ac000000-0000-0000-0000-000000000006','public');

insert into public.community_memberships (community_id, user_id, role, status) values
 ('ac100000-0000-0000-0000-000000000001','ac000000-0000-0000-0000-000000000002','moderator','active'),
 ('ac100000-0000-0000-0000-000000000001','ac000000-0000-0000-0000-000000000003','member','active'),
 ('ac100000-0000-0000-0000-000000000001','ac000000-0000-0000-0000-000000000004','member','active'),
 ('ac100000-0000-0000-0000-000000000001','ac000000-0000-0000-0000-000000000005','member','banned')
on conflict (community_id, user_id) do update set role = excluded.role, status = excluded.status;
-- Promote the moderator to admin with triggers off: the plan-limit trigger
-- counts the owner as this plan's one admin, and that's not what's under test.
set local session_replication_role = replica;
update public.community_memberships set role = 'admin'
 where community_id = 'ac100000-0000-0000-0000-000000000001' and user_id = 'ac000000-0000-0000-0000-000000000002';
set local session_replication_role = origin;

insert into public.spaces (id, community_id, name, slug, visibility) values
 ('ac200000-0000-0000-0000-000000000001','ac100000-0000-0000-0000-000000000001','Hello','hello','public'),
 ('ac200000-0000-0000-0000-000000000002','ac100000-0000-0000-0000-000000000001','Chat','chat','members'),
 ('ac200000-0000-0000-0000-000000000003','ac100000-0000-0000-0000-000000000001','Premium','premium','members'),
 ('ac200000-0000-0000-0000-000000000004','ac100000-0000-0000-0000-000000000001','Staff','staff','private'),
 ('ac200000-0000-0000-0000-000000000005','ac100000-0000-0000-0000-000000000002','Elsewhere','elsewhere','members');

insert into public.community_tiers (id, community_id, name, price_cents) values
 ('ac300000-0000-0000-0000-000000000001','ac100000-0000-0000-0000-000000000001','Insider',500);
insert into public.tier_spaces (tier_id, space_id) values
 ('ac300000-0000-0000-0000-000000000001','ac200000-0000-0000-0000-000000000003');
insert into public.tier_subscriptions (tier_id, community_id, user_id, status) values
 ('ac300000-0000-0000-0000-000000000001','ac100000-0000-0000-0000-000000000001','ac000000-0000-0000-0000-000000000004','active'),
 ('ac300000-0000-0000-0000-000000000001','ac100000-0000-0000-0000-000000000001','ac000000-0000-0000-0000-000000000005','active');

\set owner '''ac000000-0000-0000-0000-000000000001'''
\set admin '''ac000000-0000-0000-0000-000000000002'''
\set member '''ac000000-0000-0000-0000-000000000003'''
\set paid '''ac000000-0000-0000-0000-000000000004'''
\set banned '''ac000000-0000-0000-0000-000000000005'''
\set outsider '''ac000000-0000-0000-0000-000000000006'''
\set hello '''ac200000-0000-0000-0000-000000000001'''
\set chat '''ac200000-0000-0000-0000-000000000002'''
\set premium '''ac200000-0000-0000-0000-000000000003'''
\set staff '''ac200000-0000-0000-0000-000000000004'''
\set elsewhere '''ac200000-0000-0000-0000-000000000005'''

-- Who may ask.
select pg_temp.expect('member cannot check', pg_temp.chk(:member, :chat, :paid), '"denied"'::jsonb);
select pg_temp.expect('signed-out cannot check', pg_temp.chk(null, :chat, :paid), '"denied"'::jsonb);
select pg_temp.expect('admin of another community cannot check', pg_temp.chk(:outsider, :chat, :member), '"denied"'::jsonb);
select pg_temp.expect('admin cannot check a space elsewhere', pg_temp.chk(:admin, :elsewhere, :member), '"denied"'::jsonb);
select pg_temp.expect('admin cannot look up a stranger', pg_temp.chk(:admin, :chat, :outsider), '"denied"'::jsonb);

-- Answers match RLS for each person.
select pg_temp.expect('visitor: public opens', pg_temp.chk(:admin, :hello, null)->>'can_open', 'true');
select pg_temp.expect('visitor: members space not shown', pg_temp.chk(:admin, :chat, null)->>'can_discover', 'false');
select pg_temp.expect('member: chat opens', pg_temp.chk(:admin, :chat, :member)->>'can_open', 'true');
select pg_temp.expect('member: premium seen', pg_temp.chk(:admin, :premium, :member)->>'can_discover', 'true');
select pg_temp.expect('member: premium locked', pg_temp.chk(:admin, :premium, :member)->>'can_open', 'false');
select pg_temp.expect('member: premium is gated', pg_temp.chk(:admin, :premium, :member)->>'gated', 'true');
select pg_temp.expect('member: names the tier that unlocks it', pg_temp.chk(:admin, :premium, :member)->'unlocking_tiers'->0->>'name', 'Insider');
select pg_temp.expect('paid: premium opens', pg_temp.chk(:admin, :premium, :paid)->>'can_open', 'true');
select pg_temp.expect('paid: has the tier', pg_temp.chk(:admin, :premium, :paid)->>'has_tier_subscription', 'true');
select pg_temp.expect('banned + paying: still locked out', pg_temp.chk(:admin, :premium, :banned)->>'can_open', 'false');
select pg_temp.expect('banned: status reported', pg_temp.chk(:admin, :premium, :banned)->>'membership_status', 'banned');
select pg_temp.expect('member: staff room hidden', pg_temp.chk(:admin, :staff, :member)->>'can_discover', 'false');
select pg_temp.expect('owner: staff room opens', pg_temp.chk(:admin, :staff, :owner)->>'can_open', 'true');
select pg_temp.expect('owner: role reported', pg_temp.chk(:admin, :staff, :owner)->>'role', 'owner');
select pg_temp.expect('owner can check too', pg_temp.chk(:owner, :chat, :member)->>'can_open', 'true');

-- No content comes back: only these keys.
select pg_temp.expect('only facts are returned',
  (select array_agg(k order by k) from jsonb_object_keys(pg_temp.chk(:admin, :premium, :member)) k),
  array['can_discover','can_open','community_privacy','gated','has_space_subscription','has_tier_subscription','is_member','is_staff','membership_status','own_price_cents','paid_courses','paid_courses_enrolled','role','unlocking_tiers','visibility']);

-- Logged, and only admins read the log.
select pg_temp.expect('checks are logged',
  (select count(*) from public.access_check_log where community_id = 'ac100000-0000-0000-0000-000000000001') > 0, true);
select set_config('request.jwt.claim.sub', 'ac000000-0000-0000-0000-000000000003', true);
set local role authenticated;
select pg_temp.expect('member cannot read the log', (select count(*) from public.access_check_log), 0::bigint);
reset role;
select pg_temp.expect('nobody writes the log directly',
  has_table_privilege('authenticated', 'public.access_check_log', 'insert')
    and exists (select 1 from pg_policy where polrelid = 'public.access_check_log'::regclass and polcmd in ('a', '*')),
  false);

rollback;
