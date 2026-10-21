-- =============================================================================
-- Joining, separate from listing — community_join_policy and memberships_insert
--
-- NOT a migration. Run by hand against a LOCAL database with every migration
-- applied; fixtures live in a transaction that is rolled back:
--
--   psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/join_policy.sql
--
-- Checks the five supported combinations, that an empty join_policy keeps the
-- old privacy-based rule for every existing kind of community, and that a
-- self-inserted row still can't carry a staff role.
-- =============================================================================
begin;
\set ON_ERROR_STOP 1

create function pg_temp.w(p_uid uuid, p_sql text) returns text language plpgsql as $$
declare r bigint;
begin
  perform set_config('request.jwt.claim.sub', p_uid::text, true);
  set local role authenticated;
  begin
    execute 'with x as (' || p_sql || ' returning 1) select count(*) from x' into r;
    reset role;
    return 'ok:' || r;
  exception when others then
    reset role;
    return 'denied';
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
 ('b0000000-0000-0000-0000-000000000001','owner@j.test','{"full_name":"Owner"}'),
 ('b0000000-0000-0000-0000-000000000002','joiner@j.test','{"full_name":"Joiner"}')
on conflict do nothing;

insert into public.communities (id, name, slug, owner_id, privacy, join_policy) values
 ('d0000000-0000-0000-0000-000000000001','Listed open','j-listed-open','b0000000-0000-0000-0000-000000000001','public', null),
 ('d0000000-0000-0000-0000-000000000002','Listed approval','j-listed-approval','b0000000-0000-0000-0000-000000000001','public','approval'),
 ('d0000000-0000-0000-0000-000000000003','Unlisted open','j-unlisted-open','b0000000-0000-0000-0000-000000000001','private','open'),
 ('d0000000-0000-0000-0000-000000000004','Unlisted approval','j-unlisted-approval','b0000000-0000-0000-0000-000000000001','private', null),
 ('d0000000-0000-0000-0000-000000000005','Hidden','j-hidden','b0000000-0000-0000-0000-000000000001','invite_only','open'),
 ('d0000000-0000-0000-0000-000000000006','Hidden plain','j-hidden-plain','b0000000-0000-0000-0000-000000000001','invite_only', null);

select pg_temp.expect('policy: listed + empty = open', public.community_join_policy('d0000000-0000-0000-0000-000000000001'), 'open');
select pg_temp.expect('policy: listed + approval', public.community_join_policy('d0000000-0000-0000-0000-000000000002'), 'approval');
select pg_temp.expect('policy: unlisted + open', public.community_join_policy('d0000000-0000-0000-0000-000000000003'), 'open');
select pg_temp.expect('policy: unlisted + empty = approval', public.community_join_policy('d0000000-0000-0000-0000-000000000004'), 'approval');
select pg_temp.expect('policy: hidden ignores open', public.community_join_policy('d0000000-0000-0000-0000-000000000005'), 'invite');
select pg_temp.expect('policy: hidden + empty = invite', public.community_join_policy('d0000000-0000-0000-0000-000000000006'), 'invite');

\set joiner '''b0000000-0000-0000-0000-000000000002'''
-- Self-join (active member) and request (requested) per community.
select pg_temp.expect('listed open: join', pg_temp.w(:joiner::uuid, $q$insert into public.community_memberships (user_id, community_id, role, status) values ('b0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000001','member','active')$q$), 'ok:1');
select pg_temp.expect('listed approval: join refused', pg_temp.w(:joiner::uuid, $q$insert into public.community_memberships (user_id, community_id, role, status) values ('b0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000002','member','active')$q$), 'denied');
select pg_temp.expect('listed approval: request', pg_temp.w(:joiner::uuid, $q$insert into public.community_memberships (user_id, community_id, role, status) values ('b0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000002','member','requested')$q$), 'ok:1');
select pg_temp.expect('unlisted open: join', pg_temp.w(:joiner::uuid, $q$insert into public.community_memberships (user_id, community_id, role, status) values ('b0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000003','member','active')$q$), 'ok:1');
select pg_temp.expect('unlisted approval: join refused', pg_temp.w(:joiner::uuid, $q$insert into public.community_memberships (user_id, community_id, role, status) values ('b0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000004','member','active')$q$), 'denied');
select pg_temp.expect('unlisted approval: request', pg_temp.w(:joiner::uuid, $q$insert into public.community_memberships (user_id, community_id, role, status) values ('b0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000004','member','requested')$q$), 'ok:1');
select pg_temp.expect('hidden: join refused even with open saved', pg_temp.w(:joiner::uuid, $q$insert into public.community_memberships (user_id, community_id, role, status) values ('b0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000005','member','active')$q$), 'denied');
select pg_temp.expect('hidden: request refused', pg_temp.w(:joiner::uuid, $q$insert into public.community_memberships (user_id, community_id, role, status) values ('b0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000006','member','requested')$q$), 'denied');
-- Can't self-join as staff anywhere.
delete from public.community_memberships where user_id = 'b0000000-0000-0000-0000-000000000002' and community_id = 'd0000000-0000-0000-0000-000000000001';
select pg_temp.expect('open community: self-join as admin refused', pg_temp.w(:joiner::uuid, $q$insert into public.community_memberships (user_id, community_id, role, status) values ('b0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000001','admin','active')$q$), 'denied');
select pg_temp.expect('open community: request refused (nothing to approve)', pg_temp.w(:joiner::uuid, $q$insert into public.community_memberships (user_id, community_id, role, status) values ('b0000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000001','member','requested')$q$), 'denied');
-- Bad values are refused by the check constraint.
select pg_temp.expect('join_policy rejects unknown values', (select count(*) from public.communities where join_policy not in ('open','approval','invite')), 0::bigint);

rollback;
