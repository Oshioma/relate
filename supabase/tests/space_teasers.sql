-- =============================================================================
-- Locked teasers — spaces.when_locked + space_teasers(community)
--
-- NOT a migration. Run by hand against a LOCAL database with every migration
-- applied; fixtures live in a transaction that is rolled back:
--
--   psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/space_teasers.sql
--
-- Checks that visitors get only spaces marked as teasers, only in communities
-- that aren't hidden, never Admins-only spaces, never a custom page's body, and
-- that marking a teaser doesn't open the space itself (RLS unchanged).
-- =============================================================================
begin;
\set ON_ERROR_STOP 1

create function pg_temp.expect(p_label text, p_got anyelement, p_want anyelement) returns void language plpgsql as $$
begin
  if p_got is distinct from p_want then
    raise exception 'FAIL %: got %, want %', p_label, p_got, p_want;
  end if;
  raise notice 'ok  %', p_label;
end $$;

-- What a signed-out visitor gets back, as a sorted list of slugs.
create function pg_temp.anon_teasers(p_community uuid) returns text language plpgsql as $$
declare r text;
begin
  set local role anon;
  select string_agg(slug, ',' order by slug) into r from public.space_teasers(p_community);
  reset role;
  return coalesce(r, '');
end $$;

-- How many rows of the spaces table a signed-out visitor can read directly.
create function pg_temp.anon_space_rows(p_community uuid) returns int language plpgsql as $$
declare r int;
begin
  set local role anon;
  select count(*) into r from public.spaces where community_id = p_community;
  reset role;
  return r;
end $$;

insert into auth.users (id, email, raw_user_meta_data) values
 ('7e000000-0000-0000-0000-000000000001','owner@teaser.test','{"full_name":"Owner"}')
on conflict do nothing;

insert into public.communities (id, name, slug, owner_id, privacy) values
 ('7e100000-0000-0000-0000-000000000001','Listed','teaser-listed','7e000000-0000-0000-0000-000000000001','public'),
 ('7e100000-0000-0000-0000-000000000002','Hidden','teaser-hidden','7e000000-0000-0000-0000-000000000001','invite_only');

insert into public.spaces (id, community_id, name, slug, visibility, space_type, description, when_locked) values
 ('7e200000-0000-0000-0000-000000000001','7e100000-0000-0000-0000-000000000001','Hello','hello','public','discussion','Open', null),
 ('7e200000-0000-0000-0000-000000000002','7e100000-0000-0000-0000-000000000001','Chat','chat','members','discussion','Members chat', 'teaser'),
 ('7e200000-0000-0000-0000-000000000003','7e100000-0000-0000-0000-000000000001','Premium','premium','members','discussion','Paid stuff', 'teaser'),
 ('7e200000-0000-0000-0000-000000000004','7e100000-0000-0000-0000-000000000001','Quiet','quiet','members','discussion','Not teased', null),
 ('7e200000-0000-0000-0000-000000000005','7e100000-0000-0000-0000-000000000001','Staff','staff','private','discussion','Team', 'teaser'),
 ('7e200000-0000-0000-0000-000000000006','7e100000-0000-0000-0000-000000000001','Page','page','members','custom','<p>secret page body</p>', 'teaser'),
 ('7e200000-0000-0000-0000-000000000007','7e100000-0000-0000-0000-000000000002','Inner','inner','members','discussion','Hidden community', 'teaser');

insert into public.community_tiers (id, community_id, name, price_cents) values
 ('7e300000-0000-0000-0000-000000000001','7e100000-0000-0000-0000-000000000001','Insider',500);
insert into public.tier_spaces (tier_id, space_id) values
 ('7e300000-0000-0000-0000-000000000001','7e200000-0000-0000-0000-000000000003');

select pg_temp.expect('visitors get only teased members spaces', pg_temp.anon_teasers('7e100000-0000-0000-0000-000000000001'), 'chat,page,premium');
select pg_temp.expect('hidden community gives no teasers', pg_temp.anon_teasers('7e100000-0000-0000-0000-000000000002'), '');
select pg_temp.expect('gated flag set for the paid space',
  (select gated from public.space_teasers('7e100000-0000-0000-0000-000000000001') where slug = 'premium'), true);
select pg_temp.expect('gated flag off for the free members space',
  (select gated from public.space_teasers('7e100000-0000-0000-0000-000000000001') where slug = 'chat'), false);
select pg_temp.expect('custom page body never returned',
  (select description from public.space_teasers('7e100000-0000-0000-0000-000000000001') where slug = 'page'), null::text);
select pg_temp.expect('spaces table still shows visitors only the public space', pg_temp.anon_space_rows('7e100000-0000-0000-0000-000000000001'), 1);

do $$ begin
  update public.spaces set when_locked = 'everything' where id = '7e200000-0000-0000-0000-000000000002';
  raise exception 'FAIL unknown when_locked value accepted';
exception when check_violation then
  raise notice 'ok  unknown when_locked value refused';
end $$;

rollback;
