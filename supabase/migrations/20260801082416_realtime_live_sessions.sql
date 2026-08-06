-- =============================================================================
-- Relate — stream live_sessions so the "Live now!" header badge is instant
--
-- The community header shows a pulsing badge whenever a session is live. It's
-- server-rendered, so on its own it only appears on the viewer's next
-- navigation. Adding live_sessions to the realtime publication lets a tiny
-- client watcher notice a session starting or ending and refresh the header
-- immediately — no navigation needed.
--
-- RLS (live_sessions_select → can_view_space) still applies to the stream, so a
-- subscriber only ever receives sessions in spaces they're allowed to see.
-- REPLICA IDENTITY FULL so DELETE (and status UPDATE) payloads carry
-- community_id, which the client filters the subscription on. Safe to re-run.
-- =============================================================================

do $$ begin
  create publication supabase_realtime;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.live_sessions;
exception when duplicate_object then null; end $$;

alter table public.live_sessions replica identity full;
