// How often a browser with a live meeting open stamps live_sessions.last_seen_at
// (touch_live_session). The end-stale-live-sessions Supabase cron job ends a
// session once nobody has stamped it for LIVE_STALE_AFTER_MINUTES — keep that
// in step with the interval in end_stale_live_sessions(). Browsers slow timers
// in background tabs to about once a minute, so a minute stays reliable.
export const LIVE_HEARTBEAT_MS = 60_000;
export const LIVE_STALE_AFTER_MINUTES = 15;
