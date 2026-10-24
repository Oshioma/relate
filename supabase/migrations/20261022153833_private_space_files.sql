-- =============================================================================
-- Private files for members-only and paid spaces, and no more listing other
-- people's files.
--
-- 1. Listing. The four existing buckets are public: anyone with a file's link
--    can open it, and that stays as it is, so every link already in a post,
--    page or email keeps working. What changes is who can LIST files (read
--    storage.objects). Until now any signed-in person could list every path in
--    every bucket, and a listed path plus the public link opens the file,
--    members-only pictures included. Now you list only your own folder (and a
--    community's admins list that community's folder). The app never lists
--    files; uploads, replacements and deletes all stay inside the uploader's
--    own folder, which is still readable to them.
--
-- 2. space-files: a new PRIVATE bucket for what members upload inside a space
--    that visitors can't open (members, paid or team spaces, and every space of
--    a hidden community). Files live at <space id>/<uploader id>/<name>, and
--    reading one asks has_space_access(), the same rule the space's posts use:
--    a paid space's files open only for people who have paid. There are no
--    public links; the app serves a file through /api/files/<path>, which asks
--    Storage for a short-lived signed link as the viewer, so the rule above is
--    checked on every open.
--
-- No existing file is moved, copied or deleted.
--
-- Safe to re-run.
-- =============================================================================

-- --- 1. List only your own folder ------------------------------------------
drop policy if exists "avatars_select" on storage.objects;
create policy "avatars_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "business_images_select" on storage.objects;
create policy "business_images_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'business-images' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "uploads_select" on storage.objects;
create policy "uploads_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'uploads' and (storage.foldername(name))[1] = auth.uid()::text);

-- The folder is a community id. The case keeps a folder that isn't a uuid
-- from failing the cast (and with it the whole query).
drop policy if exists "community_assets_select" on storage.objects;
create policy "community_assets_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'community-assets'
    and case
      when (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        then public.is_community_admin(((storage.foldername(name))[1])::uuid, auth.uid())
      else false
    end
  );

-- --- 2. space-files ----------------------------------------------------------
-- Same types and size as 'uploads' (src/components/ui/upload-button.tsx).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'space-files', 'space-files', false, 209715200,
  array[
    'image/png', 'image/jpeg', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime',
    'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/flac', 'audio/x-flac', 'audio/webm',
    'application/pdf', 'application/zip', 'text/plain', 'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- The space a space-files path belongs to, or null when the first folder
-- isn't a uuid.
create or replace function public.space_file_space_id(p_name text)
returns uuid
language sql
immutable
set search_path = public
as $$
  select case
    when (storage.foldername(p_name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      then ((storage.foldername(p_name))[1])::uuid
  end;
$$;

-- Open a file: whoever can open the space.
drop policy if exists "space_files_select" on storage.objects;
create policy "space_files_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'space-files'
    and public.has_space_access(public.space_file_space_id(name), auth.uid())
  );

-- Upload: into your own folder of a space you can open.
drop policy if exists "space_files_insert" on storage.objects;
create policy "space_files_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'space-files'
    and (storage.foldername(name))[2] = auth.uid()::text
    and public.has_space_access(public.space_file_space_id(name), auth.uid())
  );

-- Delete: your own file, or any file in a space of a community you moderate.
drop policy if exists "space_files_delete" on storage.objects;
create policy "space_files_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'space-files'
    and (
      (storage.foldername(name))[2] = auth.uid()::text
      or exists (
        select 1 from public.spaces s
        where s.id = public.space_file_space_id(objects.name)
          and public.is_community_staff(s.community_id, auth.uid())
      )
    )
  );
