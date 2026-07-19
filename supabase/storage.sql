-- =============================================================================
-- Relate — Supabase Storage buckets + RLS
--
-- Run this in the Supabase SQL editor after supabase/schema.sql. Safe to
-- re-run: buckets are upserted and policies are dropped/recreated.
--
-- Two public buckets:
--   avatars           profile pictures, one per user
--   community-assets  community logos + cover images
--
-- Both buckets are public for reads (so <img> tags can hit the storage URL
-- directly with no signed-URL dance), but writes are locked down by path:
-- objects are namespaced as `<owner-id>/<filename>`, and the RLS policies
-- below check that first path segment against auth.uid() (avatars) or
-- community admin/owner status (community-assets), reusing the
-- is_community_admin() helper from schema.sql.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('community-assets', 'community-assets', true, 8388608, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- avatars ----------------------------------------------------------------
drop policy if exists "avatars_select" on storage.objects;
create policy "avatars_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars');

drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- community-assets ---------------------------------------------------------
drop policy if exists "community_assets_select" on storage.objects;
create policy "community_assets_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'community-assets');

drop policy if exists "community_assets_insert_admin" on storage.objects;
create policy "community_assets_insert_admin" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'community-assets'
    and public.is_community_admin(((storage.foldername(name))[1])::uuid, auth.uid())
  );

drop policy if exists "community_assets_update_admin" on storage.objects;
create policy "community_assets_update_admin" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'community-assets'
    and public.is_community_admin(((storage.foldername(name))[1])::uuid, auth.uid())
  )
  with check (
    bucket_id = 'community-assets'
    and public.is_community_admin(((storage.foldername(name))[1])::uuid, auth.uid())
  );

drop policy if exists "community_assets_delete_admin" on storage.objects;
create policy "community_assets_delete_admin" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'community-assets'
    and public.is_community_admin(((storage.foldername(name))[1])::uuid, auth.uid())
  );
