# Relate video transcriber

The small service behind **"Read from a link" → Transcribe** in the lesson
composer. Paste a YouTube, Facebook or Instagram video link and this:

1. looks the video up with **yt-dlp**;
2. uses the video's **own captions** if it has them (most YouTube videos do) — free, seconds;
3. otherwise downloads **just the audio**, cuts it into 10‑minute mono chunks with **ffmpeg**,
   and transcribes each with **Groq Whisper** (`whisper-large-v3-turbo`, ≈ **$0.04 per hour**).

The Relate app starts a job and polls it. This service never calls the app and
has no database access — its only secret is a shared bearer token.

```
Relate (Vercel)  ── POST /jobs {id,url} ──▶  video worker (Railway/Fly/VPS)
      ▲  polls GET /jobs/:id every 4s            │ yt-dlp → captions, or
      │  copies status into lesson_video_jobs    │ ffmpeg → Groq Whisper
      └──────────────────────────────────────────┘
```

## What it costs

| Video | Path | Cost |
|---|---|---|
| YouTube with captions | captions | $0 |
| 1 hour, no captions (most Facebook/Instagram) | Whisper turbo | ≈ $0.04 |
| 1 hour, `GROQ_MODEL=whisper-large-v3` | Whisper large | ≈ $0.11 |

Plus the server (~$5/month) and the lesson itself (Claude, as before).
Groq's free tier also covers a fair amount of audio per day while you try it out.

## Deploy on Railway (easiest)

1. **Get a Groq key**: <https://console.groq.com/keys>.
2. **Make a secret**: `openssl rand -hex 32` (any long random string).
3. Railway → **New Project → Deploy from GitHub repo** → pick this repo.
4. In the service **Settings**:
   - **Root Directory**: `workers/video-transcriber` (Railway finds the Dockerfile).
   - **Networking → Generate Domain** — this is your worker URL.
5. **Variables**:
   - `WORKER_SECRET` = the secret from step 2
   - `GROQ_API_KEY` = your Groq key
6. *(Recommended)* **Add a Volume** mounted at `/data` so finished transcripts
   survive a restart (`JOBS_DIR` defaults to `/data/jobs`).
7. Open `https://<your-worker-domain>/health` — you should see `"ok": true`.

## Deploy on Fly.io

```bash
cd workers/video-transcriber
fly launch --no-deploy            # accept the Dockerfile, pick a region near you
fly volumes create data --size 1
# add to fly.toml:   [mounts] source="data" destination="/data"
fly secrets set WORKER_SECRET=... GROQ_API_KEY=...
fly deploy
```

Keep at least one machine running (`min_machines_running = 1`) — a stopped
machine forgets in-flight jobs.

## Any VPS with Docker

```bash
cd workers/video-transcriber
docker build -t relate-video .
docker run -d --restart unless-stopped -p 8080:8080 \
  -v relate-video-data:/data \
  -e WORKER_SECRET=... -e GROQ_API_KEY=... \
  relate-video
```

Put it behind HTTPS (Caddy, nginx, or a Cloudflare Tunnel) — the secret travels in a header.

## Connect the Relate app

In Vercel → Project → Settings → Environment Variables (and `.env.local` for dev):

```
VIDEO_WORKER_URL=https://<your-worker-domain>
VIDEO_WORKER_SECRET=<the same WORKER_SECRET>
```

Redeploy. The composer now says *"Paste an article, or a YouTube, Facebook or
Instagram video link…"* and the button turns into **Transcribe** for video links.
Without these two variables the feature is simply hidden.

## Cookies

The same steps, written for teachers, are on the site at
**`/help/video-cookies`** (e.g. <https://relate.click/help/video-cookies>) —
that's the page the composer's error messages link to. Set `COOKIES_HELP_URL`
on the worker if your site lives somewhere else.

**When you need this:** the composer says *"YouTube is asking the video service to
prove it isn't a bot"*, or *"That video needs a login"*. YouTube often challenges
cloud servers like Railway, and Facebook/Instagram usually want a logged-in
session. Giving the worker the cookies of a logged-in browser fixes both.
No terminal needed.

1. **Use a spare account**, not your main one — the sites sometimes flag
   accounts used this way. A new free Gmail (and a spare Facebook/Instagram
   account if you need those) is safest.
2. **Install the Chrome extension "Get cookies.txt LOCALLY"**. Then open
   `chrome://extensions` → the extension's **Details** → turn on
   **Allow in Incognito**, and pin it (puzzle icon → pin).
3. **Open an Incognito window** (⌘ + Shift + N on a Mac, Ctrl + Shift + N on Windows).
4. Go to **youtube.com** and **sign in** with the spare account.
   (For Facebook/Instagram, sign in to those too, in the same window.)
5. In the same tab, go to **youtube.com/robots.txt** — a plain page, so
   YouTube doesn't change the cookies while you copy them.
6. Click the extension icon → **Copy** (not Export). For Facebook/Instagram,
   also open facebook.com / instagram.com and copy those — paste them all one
   after another in the next step.
7. **Close the Incognito window straight away**, and don't sign in to that
   account anywhere else — using it again makes the site replace the cookies
   and the copied ones stop working.
8. **Railway** → your worker service → **Variables** → **New Variable**:
   - Name: `COOKIES_TXT`
   - Value: paste (⌘ + V)
   - **Add**, then **Deploy**.
9. Open `https://<your-worker-domain>/health` — it should say `"cookies":true`.
   Try the video again.

Cookies expire after a few weeks to months. When the error comes back, repeat
steps 3–8 and replace the value.

**Still blocked with fresh cookies?** Railway's IP is being blocked outright. Set
`YTDLP_PROXY` to a residential proxy (`http://user:pass@host:port`, from any
residential-proxy provider, a few dollars a month) and deploy.

*Alternatives to `COOKIES_TXT`:* `COOKIES_FILE=/data/cookies.txt` (a file on the
volume) or `COOKIES_B64` (the file base64-encoded).

## Proxy (recommended for YouTube)

YouTube blocks many cloud servers outright. A **residential, sticky** proxy fixes
that for good and needs no cookies:

1. Buy residential proxy data (e.g. IPRoyal, pay as you go). 1 GB covers roughly
   30 hour-long videos without captions; videos with captions use almost nothing.
2. In the provider's dashboard choose **Sticky**, lifetime **30 min** or more, and
   one country. Sticky matters: YouTube's download links only work from the IP
   that asked for them, so a rotating proxy fails with 403.
3. Railway → **Variables** → `YTDLP_PROXY` = `http://USER:PASS@HOST:PORT`.
   Pasting the provider's whole `curl -x …` test command also works — the
   worker keeps only the address.

`/health` shows `"proxy": true` once it's set. Proxy passwords are scrubbed from
logs and error messages.

## When a site changes and downloads break

yt-dlp is upgraded automatically every time the container starts
(`YTDLP_AUTO_UPDATE=1`), so **restart the service** first. `/health` shows the
yt-dlp version in use.

## Settings

See [.env.example](./.env.example). The useful ones:

| Variable | Default | |
|---|---|---|
| `CAPTION_LANGS` | `en` | caption languages to accept, in order (`en,es`) |
| `PREFER_CAPTIONS` | `1` | `0` always transcribes the audio (better punctuation, costs a little) |
| `WHISPER_LANGUAGE` | auto | force a language, e.g. `en` |
| `MAX_DURATION_MINUTES` | `180` | longer videos are refused |
| `MAX_CONCURRENT_JOBS` | `2` | parallel jobs; raise on a bigger box |

## API

All `/jobs` routes need `Authorization: Bearer $WORKER_SECRET`.

- `POST /jobs` `{"id": "<8–64 chars [A-Za-z0-9-]>", "url": "<video link>"}` → `202` job.
  Posting the same id again returns the existing job.
- `GET /jobs/{id}` → `{id, status, progress, message, title, duration_seconds, method, transcript, error}`
  where `status` is `queued | downloading | transcribing | done | error` and
  `method` is `captions | whisper`. `404` if unknown.
- `GET /health` → versions and what's configured.

## Tests

```bash
pip install -r requirements.txt
WORKER_SECRET=test python test_app.py
```

## Be fair to creators

Only transcribe videos you have the right to use for teaching, and leave the
video embedded in the lesson so the creator gets the views. Downloading from
Facebook and Instagram is against their terms of service even when the video is public.
