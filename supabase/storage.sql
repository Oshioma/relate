-- =============================================================================
-- Relate — Supabase Storage buckets + RLS
--
-- Run this in the Supabase SQL editor after supabase/schema.sql. Safe to
-- re-run: buckets are upserted and policies are dropped/recreated.
--
-- Three public buckets:
--   avatars           profile pictures, one per user
--   community-assets  community logos + cover images
--   business-images   photos for business directory listings
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
  ('community-assets', 'community-assets', true, 8388608, array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('business-images', 'business-images', true, 8388608, array['image/png', 'image/jpeg', 'image/webp', 'image/gif'])
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

-- business-images -----------------------------------------------------------
-- Same per-user path scheme as avatars: objects live at `<user-id>/<file>`,
-- so whoever uploaded an image (listing author or staff) manages their own.
drop policy if exists "business_images_select" on storage.objects;
create policy "business_images_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'business-images');

drop policy if exists "business_images_insert_own" on storage.objects;
create policy "business_images_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'business-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "business_images_update_own" on storage.objects;
create policy "business_images_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'business-images' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'business-images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "business_images_delete_own" on storage.objects;
create policy "business_images_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'business-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- uploads --------------------------------------------------------------------
-- General member uploads: post attachments, journal entry media, and any
-- future in-app files. Same per-user path scheme as avatars: `<user-id>/<file>`.
-- Images, videos and common documents, up to 50MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('uploads', 'uploads', true, 52428800, array[
  'image/png', 'image/jpeg', 'image/webp', 'image/gif',
  'video/mp4', 'video/webm', 'video/quicktime',
  'application/pdf', 'application/zip', 'text/plain', 'text/csv',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "uploads_select" on storage.objects;
create policy "uploads_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'uploads');

drop policy if exists "uploads_insert_own" on storage.objects;
create policy "uploads_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "uploads_update_own" on storage.objects;
create policy "uploads_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "uploads_delete_own" on storage.objects;
create policy "uploads_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);
