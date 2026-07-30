-- =============================================================================
-- Relate — larger media + audio in the general uploads bucket (media hosting P1)
--
-- The 'uploads' bucket (supabase/migrations/*_storage.sql) already hosts images,
-- video, PDFs and docs at 50MB — enough for post attachments, not for a music
-- community's exclusives (a full DJ set or lossless track easily exceeds 50MB,
-- and audio MIME types weren't allowed at all).
--
-- This raises the per-object limit to 200MB and adds common audio types so The
-- Vault can host unreleased tracks, stems and mixes. Bucket config only — the
-- upload UI (browser → Storage) and inline players come in later phases. RLS is
-- unchanged (writes stay per-user-folder; see the storage migration).
--
-- NOTE: reliably uploading files this large from the browser needs Supabase's
-- resumable/TUS upload path rather than a single POST — that's wired up with the
-- upload UI in phase 2. This migration only lifts the ceiling.
--
-- Safe to re-run.
-- =============================================================================

update storage.buckets
set
  file_size_limit = 209715200, -- 200 MB
  allowed_mime_types = array[
    -- images
    'image/png', 'image/jpeg', 'image/webp', 'image/gif',
    -- video
    'video/mp4', 'video/webm', 'video/quicktime',
    -- audio (new)
    'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/x-wav',
    'audio/ogg', 'audio/flac', 'audio/x-flac', 'audio/webm',
    -- documents / archives
    'application/pdf', 'application/zip', 'text/plain', 'text/csv',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
where id = 'uploads';
