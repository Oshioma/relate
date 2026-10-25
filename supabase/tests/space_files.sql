-- =============================================================================
-- Private space files + own-folder listing (20261022153833_private_space_files)
--
-- NOT a migration. Run by hand against a LOCAL database with every migration
-- applied; fixtures live in a transaction that is rolled back:
--
--   psql "$LOCAL_DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/space_files.sql
--
-- Checks that space-files opens exactly as the space does (members, paid,
-- team), that uploads only go into your own folder of a space you can open,
-- who can delete, and that nobody lists other people's files in the public
-- buckets any more.
-- =============================================================================
begin;
\set ON_ERROR_STOP 1

-- A bare local database may not grant these; hosted Supabase does.
grant select, insert, update, delete on storage.objects to authenticated;

create function pg_temp.expect(p_label text, p_got anyelement, p_want anyelement) returns void language plpgsql as $$
begin
  if p_got is distinct from p_want then
    raise exception 'FAIL %: got %, want %', p_label, p_got, p_want;
  end if;
  raise notice 'ok  %', p_label;
end $$;

-- How many storage rows matching p_where the user can see.
create function pg_temp.sees(p_user uuid, p_where text) returns bigint language plpgsql as $$
declare r bigint;
begin
  perform set_config('request.jwt.claim.sub', p_user::text, true);
  set local role authenticated;
  execute 'select count(*) from storage.objects where ' || p_where into r;
  reset role;
  return r;
end $$;

-- Whether the user may add a file at p_name in space-files.
create function pg_temp.can_upload(p_user uuid, p_name text) returns boolean language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', p_user::text, true);
  set local role authenticated;
  begin
    insert into storage.objects (bucket_id, name) values ('space-files', p_name);
    reset role;
    return true;
  exception when insufficient_privilege then
    reset role;
    return false;
  end;
end $$;

-- How many space-files rows the user's delete removes.
create function pg_temp.deletes(p_user uuid, p_name text) returns int language plpgsql as $$
declare r int;
begin
  perform set_config('request.jwt.claim.sub', p_user::text, true);
  set local role authenticated;
  delete from storage.objects where bucket_id = 'space-files' and name = p_name;
  get diagnostics r = row_count;
  reset role;
  return r;
end $$;

insert into auth.users (id, email, raw_user_meta_data) values
 ('5f000000-0000-0000-0000-000000000001','owner@files.test','{"full_name":"Owner"}'),
 ('5f000000-0000-0000-0000-000000000002','member@files.test','{"full_name":"Member"}'),
 ('5f000000-0000-0000-0000-000000000003','payer@files.test','{"full_name":"Payer"}'),
 ('5f000000-0000-0000-0000-000000000004','stranger@files.test','{"full_name":"Stranger"}'),
 ('5f000000-0000-0000-0000-000000000005','mod@files.test','{"full_name":"Mod"}')
on conflict do nothing;

insert into public.communities (id, name, slug, owner_id, privacy) values
 ('5f100000-0000-0000-0000-000000000001','Files','files-test','5f000000-0000-0000-0000-000000000001','public');

insert into public.community_memberships (user_id, community_id, role, status) values
 ('5f000000-0000-0000-0000-000000000002','5f100000-0000-0000-0000-000000000001','member','active'),
 ('5f000000-0000-0000-0000-000000000003','5f100000-0000-0000-0000-000000000001','member','active'),
 ('5f000000-0000-0000-0000-000000000005','5f100000-0000-0000-0000-000000000001','moderator','active')
on conflict (user_id, community_id) do update set role = excluded.role, status = excluded.status;

insert into public.spaces (id, community_id, name, slug, visibility, space_type) values
 ('5f200000-0000-0000-0000-000000000001','5f100000-0000-0000-0000-000000000001','Chat','chat','members','discussion'),
 ('5f200000-0000-0000-0000-000000000002','5f100000-0000-0000-0000-000000000001','Vault','vault','members','resources'),
 ('5f200000-0000-0000-0000-000000000003','5f100000-0000-0000-0000-000000000001','Team','team','private','discussion');

insert into public.community_tiers (id, community_id, name, price_cents) values
 ('5f300000-0000-0000-0000-000000000001','5f100000-0000-0000-0000-000000000001','Insider',900);
insert into public.tier_spaces (tier_id, space_id) values
 ('5f300000-0000-0000-0000-000000000001','5f200000-0000-0000-0000-000000000002');
insert into public.tier_subscriptions (tier_id, community_id, user_id, status, current_period_end) values
 ('5f300000-0000-0000-0000-000000000001','5f100000-0000-0000-0000-000000000001','5f000000-0000-0000-0000-000000000003','active', now() + interval '20 days');

insert into storage.objects (bucket_id, name) values
 ('space-files','5f200000-0000-0000-0000-000000000001/5f000000-0000-0000-0000-000000000002/a-chat.jpg'),
 ('space-files','5f200000-0000-0000-0000-000000000002/5f000000-0000-0000-0000-000000000001/b-stems.wav'),
 ('space-files','5f200000-0000-0000-0000-000000000003/5f000000-0000-0000-0000-000000000001/c-plan.pdf'),
 ('uploads','5f000000-0000-0000-0000-000000000002/d-mine.jpg'),
 ('uploads','5f000000-0000-0000-0000-000000000001/e-owners.jpg'),
 ('avatars','5f000000-0000-0000-0000-000000000001/avatar.png'),
 ('business-images','5f000000-0000-0000-0000-000000000001/shop.jpg'),
 ('community-assets','5f100000-0000-0000-0000-000000000001/cover.jpg'),
 ('community-assets','not-a-uuid/legacy.jpg');

\set owner '''5f000000-0000-0000-0000-000000000001'''
\set member '''5f000000-0000-0000-0000-000000000002'''
\set payer '''5f000000-0000-0000-0000-000000000003'''
\set stranger '''5f000000-0000-0000-0000-000000000004'''
\set mod '''5f000000-0000-0000-0000-000000000005'''

-- Opening space files: the same as opening the space.
select pg_temp.expect('member opens the members space file', pg_temp.sees(:member, $$bucket_id='space-files' and name like '5f200000-0000-0000-0000-000000000001/%'$$), 1::bigint);
select pg_temp.expect('member without the tier: paid file closed', pg_temp.sees(:member, $$bucket_id='space-files' and name like '5f200000-0000-0000-0000-000000000002/%'$$), 0::bigint);
select pg_temp.expect('paying member opens the paid file', pg_temp.sees(:payer, $$bucket_id='space-files' and name like '5f200000-0000-0000-0000-000000000002/%'$$), 1::bigint);
select pg_temp.expect('member: team file closed', pg_temp.sees(:member, $$bucket_id='space-files' and name like '5f200000-0000-0000-0000-000000000003/%'$$), 0::bigint);
select pg_temp.expect('non-member: no space files', pg_temp.sees(:stranger, $$bucket_id='space-files'$$), 0::bigint);
select pg_temp.expect('owner: every space file', pg_temp.sees(:owner, $$bucket_id='space-files'$$), 3::bigint);

-- Uploading: own folder of a space you can open.
select pg_temp.expect('member uploads into own folder of chat', pg_temp.can_upload(:member, '5f200000-0000-0000-0000-000000000001/5f000000-0000-0000-0000-000000000002/new.jpg'), true);
select pg_temp.expect('member cannot upload as someone else', pg_temp.can_upload(:member, '5f200000-0000-0000-0000-000000000001/5f000000-0000-0000-0000-000000000001/new.jpg'), false);
select pg_temp.expect('member without the tier cannot upload to the paid space', pg_temp.can_upload(:member, '5f200000-0000-0000-0000-000000000002/5f000000-0000-0000-0000-000000000002/new.jpg'), false);
select pg_temp.expect('non-member cannot upload', pg_temp.can_upload(:stranger, '5f200000-0000-0000-0000-000000000001/5f000000-0000-0000-0000-000000000004/new.jpg'), false);
select pg_temp.expect('a path without a space is refused', pg_temp.can_upload(:member, 'nope/5f000000-0000-0000-0000-000000000002/new.jpg'), false);

-- Deleting: your own, or a moderator of the community.
select pg_temp.expect('member cannot delete the owner''s paid file', pg_temp.deletes(:member, '5f200000-0000-0000-0000-000000000002/5f000000-0000-0000-0000-000000000001/b-stems.wav'), 0);
select pg_temp.expect('member deletes own file', pg_temp.deletes(:member, '5f200000-0000-0000-0000-000000000001/5f000000-0000-0000-0000-000000000002/new.jpg'), 1);
select pg_temp.expect('moderator deletes a member''s file', pg_temp.deletes(:mod, '5f200000-0000-0000-0000-000000000001/5f000000-0000-0000-0000-000000000002/a-chat.jpg'), 1);

-- Listing the public buckets: own folder only.
select pg_temp.expect('member lists own uploads only', pg_temp.sees(:member, $$bucket_id='uploads' and name like '5f000000-%'$$), 1::bigint);
select pg_temp.expect('member cannot list the owner''s avatar', pg_temp.sees(:member, $$bucket_id='avatars' and name like '5f000000-%'$$), 0::bigint);
select pg_temp.expect('owner lists own avatar', pg_temp.sees(:owner, $$bucket_id='avatars' and name like '5f000000-%'$$), 1::bigint);
select pg_temp.expect('member cannot list business images', pg_temp.sees(:member, $$bucket_id='business-images' and name like '5f000000-%'$$), 0::bigint);
select pg_temp.expect('member cannot list community assets', pg_temp.sees(:member, $$bucket_id='community-assets'$$), 0::bigint);
select pg_temp.expect('admin lists own community assets; a non-uuid folder doesn''t error', pg_temp.sees(:owner, $$bucket_id='community-assets' and name like '5f100000-%' or name = 'not-a-uuid/legacy.jpg'$$), 1::bigint);

rollback;
