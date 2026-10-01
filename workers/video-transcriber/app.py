"""
Relate video transcriber.

A small web service that turns a YouTube / Facebook / Instagram / TikTok /
Vimeo video link into plain text for the lesson composer. The Relate app starts
a job and polls it; this service never calls the app and holds no database
credentials.

    POST /jobs        {"id": "<uuid>", "url": "<video link>"}   -> 202
    GET  /jobs/{id}                                             -> job status
    GET  /health                                                -> ok + versions

Both /jobs routes need "Authorization: Bearer <WORKER_SECRET>".

How a video becomes text, cheapest first:
  1. Captions. If the platform already has captions in a language we want
     (most YouTube videos do), download those. Free, and takes seconds.
  2. Whisper. Otherwise download just the audio, squash it to small mono
     chunks with ffmpeg, and send each chunk to Groq's Whisper API
     (about $0.04 per hour of audio).

Configuration is all environment variables — see .env.example.
"""

from __future__ import annotations

import base64
import hmac
import json
import os
import re
import shutil
import subprocess
import tempfile
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any, Optional
from urllib.parse import urlparse

import requests
import yt_dlp
from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel

# --------------------------------------------------------------------------
# Settings
# --------------------------------------------------------------------------


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.environ.get(name, default))
    except ValueError:
        return default


WORKER_SECRET = os.environ.get("WORKER_SECRET", "")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "whisper-large-v3-turbo")
GROQ_URL = os.environ.get("GROQ_URL", "https://api.groq.com/openai/v1/audio/transcriptions")
# Optional ISO-639-1 code ("en"). Blank lets Whisper detect the language.
WHISPER_LANGUAGE = os.environ.get("WHISPER_LANGUAGE", "").strip()

# Caption languages we are happy to use, in order of preference.
CAPTION_LANGS = [
    lang.strip().lower() for lang in os.environ.get("CAPTION_LANGS", "en").split(",") if lang.strip()
]
PREFER_CAPTIONS = os.environ.get("PREFER_CAPTIONS", "1") not in ("0", "false", "no")

MAX_DURATION_MINUTES = _env_int("MAX_DURATION_MINUTES", 180)
CHUNK_MINUTES = _env_int("CHUNK_MINUTES", 10)
MAX_CONCURRENT_JOBS = _env_int("MAX_CONCURRENT_JOBS", 2)
JOB_TTL_HOURS = _env_int("JOB_TTL_HOURS", 72)

JOBS_DIR = Path(os.environ.get("JOBS_DIR", "/tmp/relate-video-jobs"))


def clean_proxy(raw: str) -> Optional[str]:
    """The proxy address, even when a whole curl command was pasted.

    Proxy dashboards show a test command like
    `curl -v -x http://user:pass@host:port -L https://ipv4.icanhazip.com`, and
    pasting all of it made every download fail on "invalid character ' '".
    Takes the first proxy-looking address and drops the rest.
    """
    raw = (raw or "").strip()
    if not raw:
        return None
    match = re.search(r"(?:https?|socks4a?|socks5h?)://\S+", raw)
    if match:
        return match.group(0)
    # No scheme: the first token that isn't "curl" or a flag, as http.
    for token in raw.split():
        if token != "curl" and not token.startswith("-"):
            return f"http://{token}"
    return None


def redact(text: str) -> str:
    """Hide user:password in any URL, so proxy credentials never reach logs or teachers."""
    return re.sub(r"([a-z0-9+.-]+://)[^/\s:@]+:[^@\s]+@", r"\1***@", text, flags=re.IGNORECASE)


YTDLP_PROXY = clean_proxy(os.environ.get("YTDLP_PROXY", ""))

# Browser cookies (Netscape cookies.txt) for videos that need a login —
# Facebook and Instagram often do, and YouTube often asks a server IP to
# "sign in to confirm you're not a bot". Three ways in, for three kinds of
# host: a path to the file, the file base64-encoded, or — the one that needs
# no terminal — the file's text pasted straight into COOKIES_TXT.

_NETSCAPE_HEADER = "# Netscape HTTP Cookie File"


def normalise_cookies(text: str) -> str:
    """A cookies.txt that survived being pasted into a web form.

    Pasting into a dashboard tends to turn the file's tabs into spaces, and
    some flatten newlines into a literal "\\n". yt-dlp is strict about both,
    so every cookie line is rebuilt as seven tab-separated fields, and the
    header it looks for is put back if it went missing.
    """
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    if "\n" not in text.strip() and "\\n" in text:
        text = text.replace("\\n", "\n").replace("\\t", "\t")
    lines = [_NETSCAPE_HEADER]
    for raw in text.split("\n"):
        line = raw.strip()
        if not line:
            continue
        # "#HttpOnly_" lines are cookies; any other "#" line is a comment.
        if line.startswith("#") and not line.startswith("#HttpOnly_"):
            continue
        fields = line.split(None, 6)
        if len(fields) == 6:  # a cookie with an empty value
            fields.append("")
        if len(fields) != 7:
            continue
        lines.append("\t".join(fields))
    return "\n".join(lines) + "\n"


def _write_cookies(text: str) -> str:
    path = Path(tempfile.gettempdir()) / "relate-cookies.txt"
    path.write_text(normalise_cookies(text))
    return str(path)


# Where error messages send people to fix a login/bot block. Shown as a link
# in the composer. Ends the sentence with no full stop, so the link stays clean.
COOKIES_HELP_URL = os.environ.get(
    "COOKIES_HELP_URL",
    "https://relate.click/help/video-cookies",
).strip()

COOKIES_FILE: Optional[str] = os.environ.get("COOKIES_FILE", "").strip() or None
if not COOKIES_FILE and os.environ.get("COOKIES_TXT", "").strip():
    COOKIES_FILE = _write_cookies(os.environ["COOKIES_TXT"])
elif not COOKIES_FILE and os.environ.get("COOKIES_B64", "").strip():
    COOKIES_FILE = _write_cookies(base64.b64decode(os.environ["COOKIES_B64"]).decode("utf-8", "replace"))

# Only these sites are fetched. Every job costs bandwidth and money, and a
# video worker that downloads any URL it's given is an open proxy.
# Subdomains match too (is_allowed_url), which is what lets vm.tiktok.com
# share links and player.vimeo.com embed addresses through.
ALLOWED_HOSTS = (
    "youtube.com",
    "youtu.be",
    "facebook.com",
    "fb.watch",
    "instagram.com",
    "tiktok.com",
    "vimeo.com",
)

# --------------------------------------------------------------------------
# Job store: in memory, mirrored to JOBS_DIR so a restart doesn't forget
# finished transcripts the app hasn't collected yet.
# --------------------------------------------------------------------------

_jobs: dict[str, dict[str, Any]] = {}
_lock = threading.Lock()
_pool = ThreadPoolExecutor(max_workers=max(1, MAX_CONCURRENT_JOBS))


def _job_path(job_id: str) -> Path:
    return JOBS_DIR / f"{job_id}.json"


def _save(job: dict[str, Any]) -> None:
    try:
        JOBS_DIR.mkdir(parents=True, exist_ok=True)
        tmp = _job_path(job["id"]).with_suffix(".tmp")
        tmp.write_text(json.dumps(job))
        tmp.replace(_job_path(job["id"]))
    except OSError as error:  # a full or read-only disk shouldn't kill the job
        print(f"could not persist job {job['id']}: {error}", flush=True)


def _update(job_id: str, **fields: Any) -> None:
    with _lock:
        job = _jobs.get(job_id)
        if not job:
            return
        job.update(fields)
        job["updated_at"] = time.time()
        snapshot = dict(job)
    _save(snapshot)


def _load_jobs() -> None:
    if not JOBS_DIR.exists():
        return
    cutoff = time.time() - JOB_TTL_HOURS * 3600
    for path in JOBS_DIR.glob("*.json"):
        try:
            job = json.loads(path.read_text())
        except (OSError, ValueError):
            path.unlink(missing_ok=True)
            continue
        if job.get("created_at", 0) < cutoff:
            path.unlink(missing_ok=True)
            continue
        # Anything mid-flight when we stopped is not going to finish now.
        if job.get("status") not in ("done", "error"):
            job.update(status="error", error="The video service restarted part-way through. Start it again.")
            _save(job)
        _jobs[job["id"]] = job


def _prune() -> None:
    cutoff = time.time() - JOB_TTL_HOURS * 3600
    with _lock:
        old = [jid for jid, job in _jobs.items() if job.get("created_at", 0) < cutoff]
        for jid in old:
            _jobs.pop(jid, None)
    for jid in old:
        _job_path(jid).unlink(missing_ok=True)


# --------------------------------------------------------------------------
# Text helpers
# --------------------------------------------------------------------------


def is_allowed_url(raw: str) -> bool:
    try:
        parsed = urlparse(raw)
    except ValueError:
        return False
    if parsed.scheme not in ("http", "https"):
        return False
    host = (parsed.hostname or "").lower()
    return any(host == allowed or host.endswith("." + allowed) for allowed in ALLOWED_HOSTS)


_TIMING = re.compile(r"^\s*(\d{1,2}:)?\d{1,2}:\d{2}[.,]\d{3}\s*-->")
_TAG = re.compile(r"<[^>]+>")


def vtt_to_text(vtt: str) -> str:
    """Caption file -> the words, once each.

    YouTube's automatic captions "roll": every cue repeats the previous cue's
    line before adding a new one, so a naive join says everything twice.
    """
    lines: list[str] = []
    in_header = True
    for raw in vtt.splitlines():
        line = raw.strip()
        if in_header:
            # Everything before the first cue timing is the WEBVTT header.
            if _TIMING.match(line):
                in_header = False
            continue
        if not line or _TIMING.match(line) or line.isdigit():
            continue
        if line.startswith(("NOTE", "STYLE", "REGION")):
            continue
        text = _TAG.sub("", line)
        text = (
            text.replace("&amp;", "&")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
            .replace("&nbsp;", " ")
            .replace("&#39;", "'")
            .replace("&quot;", '"')
        )
        text = re.sub(r"\s+", " ", text).strip()
        if not text or text in ("[Music]", "[Applause]"):
            continue
        if lines and lines[-1] == text:
            continue
        lines.append(text)
    return paragraphs(" ".join(lines))


def paragraphs(text: str, target: int = 700) -> str:
    """One wall of speech -> readable paragraphs of roughly `target` chars.

    Breaks after a sentence when there are sentences; auto-captions have no
    punctuation, so failing that, at the next word boundary.
    """
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return ""
    out: list[str] = []
    current = ""
    for sentence in re.split(r"(?<=[.!?])\s+", text):
        words = sentence.split(" ")
        for word in words:
            current = f"{current} {word}" if current else word
            if len(current) >= target * 1.6:
                out.append(current)
                current = ""
        if len(current) >= target:
            out.append(current)
            current = ""
    if current:
        out.append(current)
    return "\n\n".join(p.strip() for p in out if p.strip())


# --------------------------------------------------------------------------
# yt-dlp
# --------------------------------------------------------------------------


def _ydl_opts(**extra: Any) -> dict[str, Any]:
    opts: dict[str, Any] = {
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
        "socket_timeout": 30,
        "retries": 3,
    }
    if COOKIES_FILE:
        opts["cookiefile"] = COOKIES_FILE
    if YTDLP_PROXY:
        opts["proxy"] = YTDLP_PROXY
    opts.update(extra)
    return opts


def _friendly_download_error(error: Exception) -> str:
    message = redact(str(error))
    lowered = message.lower()
    # Kept in full in the Railway logs; the teacher gets a sentence.
    print(f"download failed: {message}", flush=True)
    how = f" How to fix it: {COOKIES_HELP_URL}"
    if "proxy" in lowered and ("unable to connect" in lowered or "tunnel" in lowered or "407" in lowered):
        return (
            "The video service couldn't connect through its proxy. Check YTDLP_PROXY in Railway — "
            "the address and password, and that the proxy plan still has data left."
        )
    if "not a bot" in lowered or "confirm you" in lowered:
        if YTDLP_PROXY:
            return (
                "YouTube is blocking the video service even through its proxy. Use a residential, "
                "sticky proxy (not datacenter or rotating), or add cookies." + how
            )
        if COOKIES_FILE:
            return (
                "YouTube is still blocking the video service even with cookies — "
                "they may have expired, or the server's address is blocked." + how
            )
        return "YouTube is asking the video service to prove it isn't a bot, so it needs YouTube cookies." + how
    if "age" in lowered and ("confirm" in lowered or "restricted" in lowered):
        return "That video is age-restricted, so the video service needs a signed-in account (cookies)." + how
    if "sign in" in lowered or "login" in lowered or "log in" in lowered or "cookies" in lowered:
        if COOKIES_FILE:
            return "That video needs a login, and the video service's cookies didn't work — they may have expired." + how
        return "That video needs a login, and the video service isn't signed in to that site." + how
    if "private" in lowered:
        return "That video is private."
    if "unavailable" in lowered or "not available" in lowered or "removed" in lowered:
        return "That video isn't available any more."
    if "429" in lowered or "too many requests" in lowered:
        return "The site is rate-limiting the video service. Try again in a while."
    return "Couldn't download that video. " + message.replace("ERROR: ", "")[:200]


def _pick_captions(info: dict[str, Any]) -> Optional[tuple[str, str]]:
    """(caption url, language) for the best caption track we'd accept."""

    def vtt_url(tracks: list[dict[str, Any]]) -> Optional[str]:
        for track in tracks or []:
            if track.get("ext") == "vtt" and track.get("url"):
                return track["url"]
        return None

    def wanted(lang: str) -> bool:
        base = lang.lower().split("-")[0]
        return lang.lower() in CAPTION_LANGS or base in CAPTION_LANGS

    # Captions a person uploaded beat machine ones.
    manual = info.get("subtitles") or {}
    for pref in CAPTION_LANGS:
        for lang, tracks in manual.items():
            if lang.lower() == pref or lang.lower().startswith(pref + "-"):
                url = vtt_url(tracks)
                if url:
                    return url, lang

    # Machine captions only in the video's own language. YouTube offers
    # auto-translations into dozens of languages too; those read badly.
    auto = info.get("automatic_captions") or {}
    video_lang = (info.get("language") or "").lower()
    for lang, tracks in auto.items():
        if lang.endswith("-orig") and wanted(lang[: -len("-orig")]):
            url = vtt_url(tracks)
            if url:
                return url, lang
    if video_lang and wanted(video_lang):
        for lang, tracks in auto.items():
            if lang.lower() == video_lang:
                url = vtt_url(tracks)
                if url:
                    return url, lang
    return None


def _download_audio(job_id: str, url: str, workdir: Path) -> Path:
    def hook(status: dict[str, Any]) -> None:
        if status.get("status") != "downloading":
            return
        total = status.get("total_bytes") or status.get("total_bytes_estimate") or 0
        done = status.get("downloaded_bytes") or 0
        if total:
            fraction = min(1.0, done / total)
            _update(
                job_id,
                progress=round(0.05 + 0.3 * fraction, 3),
                message=f"Downloading the audio… {int(fraction * 100)}%",
            )

    opts = _ydl_opts(
        # A modest-bitrate audio stream where there is one: the audio is
        # squashed to 48 kbps mono for Whisper anyway, and through a proxy
        # that bills per GB, an hour at ~64 kbps is ~30 MB instead of ~60+.
        format="bestaudio[abr<=80]/bestaudio/best",
        outtmpl=str(workdir / "source.%(ext)s"),
        progress_hooks=[hook],
    )
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([url])

    files = [p for p in workdir.iterdir() if p.name.startswith("source.") and not p.name.endswith(".part")]
    if not files:
        raise RuntimeError("The download finished but no audio file was written.")
    return files[0]


def _split_audio(source: Path, workdir: Path) -> list[Path]:
    """Small mono MP3 chunks: ~3.5 MB per 10 minutes, far under Groq's limit."""
    out_dir = workdir / "chunks"
    out_dir.mkdir()
    command = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-i", str(source),
        "-t", str(MAX_DURATION_MINUTES * 60),
        "-vn", "-ac", "1", "-ar", "16000",
        "-c:a", "libmp3lame", "-b:a", "48k",
        "-f", "segment", "-segment_time", str(CHUNK_MINUTES * 60),
        "-reset_timestamps", "1",
        str(out_dir / "chunk_%03d.mp3"),
    ]
    result = subprocess.run(command, capture_output=True, text=True, timeout=1800)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg couldn't read the audio: {result.stderr[-300:]}")
    return sorted(out_dir.glob("chunk_*.mp3"))


# --------------------------------------------------------------------------
# Groq Whisper
# --------------------------------------------------------------------------


def _transcribe_chunk(path: Path, prompt: str) -> str:
    data = {"model": GROQ_MODEL, "response_format": "json", "temperature": "0"}
    if WHISPER_LANGUAGE:
        data["language"] = WHISPER_LANGUAGE
    if prompt:
        # The end of the previous chunk, so a sentence cut at the boundary
        # and the spelling of names carry across.
        data["prompt"] = prompt[-400:]

    for attempt in range(6):
        with path.open("rb") as handle:
            response = requests.post(
                GROQ_URL,
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                files={"file": (path.name, handle, "audio/mpeg")},
                data=data,
                timeout=300,
            )
        if response.status_code == 200:
            return (response.json().get("text") or "").strip()
        if response.status_code == 429 or response.status_code >= 500:
            retry_after = response.headers.get("retry-after")
            try:
                wait = float(retry_after) if retry_after else 0.0
            except ValueError:
                wait = 0.0
            time.sleep(min(120.0, max(wait, 2.0 * (2**attempt))))
            continue
        raise RuntimeError(f"Transcription failed ({response.status_code}): {response.text[:300]}")
    raise RuntimeError("Transcription kept being rate-limited. Try again later.")


# --------------------------------------------------------------------------
# The job
# --------------------------------------------------------------------------


def run_job(job_id: str, url: str) -> None:
    workdir = Path(tempfile.mkdtemp(prefix="relate-video-"))
    try:
        _update(job_id, status="downloading", progress=0.02, message="Looking the video up…")

        try:
            with yt_dlp.YoutubeDL(_ydl_opts(skip_download=True)) as ydl:
                info = ydl.extract_info(url, download=False)
        except Exception as error:  # yt-dlp raises many kinds
            _update(job_id, status="error", error=_friendly_download_error(error))
            return

        if info.get("_type") == "playlist":
            _update(job_id, status="error", error="That's a playlist — paste a link to one video.")
            return

        title = info.get("title")
        duration = info.get("duration")
        _update(job_id, title=title, duration_seconds=duration)

        if duration and duration > MAX_DURATION_MINUTES * 60:
            _update(
                job_id,
                status="error",
                error=f"That video is over {MAX_DURATION_MINUTES // 60} hours — too long for one lesson.",
            )
            return

        # 1. Captions, when there are good ones.
        if PREFER_CAPTIONS:
            picked = _pick_captions(info)
            if picked:
                caption_url, lang = picked
                _update(job_id, progress=0.3, message=f"Reading the video's captions ({lang})…")
                try:
                    with yt_dlp.YoutubeDL(_ydl_opts()) as ydl:
                        vtt = ydl.urlopen(caption_url).read().decode("utf-8", "replace")
                    text = vtt_to_text(vtt)
                except Exception as error:
                    print(f"{job_id}: captions failed, falling back to audio: {redact(str(error))}", flush=True)
                    text = ""
                # A handful of words is a "[Music]" track, not a transcript.
                if len(text) > 200:
                    _update(
                        job_id,
                        status="done",
                        progress=1.0,
                        method="captions",
                        transcript=text,
                        message=None,
                    )
                    return

        # 2. Whisper.
        if not GROQ_API_KEY:
            _update(
                job_id,
                status="error",
                error="This video has no captions, and audio transcription isn't set up (no GROQ_API_KEY).",
            )
            return

        _update(job_id, progress=0.05, message="Downloading the audio…")
        try:
            audio = _download_audio(job_id, url, workdir)
        except Exception as error:
            _update(job_id, status="error", error=_friendly_download_error(error))
            return

        _update(job_id, progress=0.36, message="Preparing the audio…")
        chunks = _split_audio(audio, workdir)
        audio.unlink(missing_ok=True)  # free the disk before the long part
        if not chunks:
            _update(job_id, status="error", error="That video has no audio track.")
            return

        _update(job_id, status="transcribing", progress=0.4)
        parts: list[str] = []
        for index, chunk in enumerate(chunks):
            _update(
                job_id,
                progress=round(0.4 + 0.58 * index / len(chunks), 3),
                message=f"Transcribing part {index + 1} of {len(chunks)}…",
            )
            parts.append(_transcribe_chunk(chunk, parts[-1] if parts else ""))

        text = paragraphs(" ".join(p for p in parts if p))
        if not text:
            _update(job_id, status="error", error="No speech was found in that video.")
            return

        _update(job_id, status="done", progress=1.0, method="whisper", transcript=text, message=None)
    except Exception as error:  # never leave a job stuck "running"
        print(f"{job_id}: failed: {redact(repr(error))}", flush=True)
        _update(job_id, status="error", error=redact(str(error))[:300] or "Something went wrong.")
    finally:
        shutil.rmtree(workdir, ignore_errors=True)


# --------------------------------------------------------------------------
# HTTP
# --------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(_app: FastAPI):
    if not WORKER_SECRET:
        raise RuntimeError("WORKER_SECRET is not set — refusing to start an open video downloader.")
    _load_jobs()
    yield


app = FastAPI(title="Relate video transcriber", docs_url=None, redoc_url=None, lifespan=lifespan)


def require_secret(authorization: str = Header(default="")) -> None:
    expected = f"Bearer {WORKER_SECRET}"
    if not WORKER_SECRET or not hmac.compare_digest(authorization.encode(), expected.encode()):
        raise HTTPException(status_code=401, detail="Wrong or missing secret.")


class NewJob(BaseModel):
    id: str
    url: str


def _public(job: dict[str, Any]) -> dict[str, Any]:
    return {key: job.get(key) for key in (
        "id", "status", "progress", "message", "title", "duration_seconds",
        "method", "transcript", "error",
    )}


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "ok": True,
        "yt_dlp": yt_dlp.version.__version__,
        "ffmpeg": shutil.which("ffmpeg") is not None,
        "groq": bool(GROQ_API_KEY),
        "cookies": bool(COOKIES_FILE),
        "proxy": bool(YTDLP_PROXY),
    }


@app.post("/jobs", status_code=202, dependencies=[Depends(require_secret)])
def create_job(body: NewJob) -> dict[str, Any]:
    if not re.fullmatch(r"[A-Za-z0-9-]{8,64}", body.id):
        raise HTTPException(status_code=400, detail="Bad job id.")
    if not is_allowed_url(body.url):
        raise HTTPException(status_code=400, detail="Only YouTube, Facebook, Instagram, TikTok and Vimeo links are supported.")

    _prune()
    with _lock:
        existing = _jobs.get(body.id)
        if existing:  # the app retried — same id, same job
            return _public(existing)
        now = time.time()
        job = {
            "id": body.id,
            "url": body.url,
            "status": "queued",
            "progress": 0.0,
            "message": "Waiting for a free slot…",
            "created_at": now,
            "updated_at": now,
        }
        _jobs[body.id] = job
    _save(job)
    _pool.submit(run_job, body.id, body.url)
    return _public(job)


@app.get("/jobs/{job_id}", dependencies=[Depends(require_secret)])
def get_job(job_id: str) -> dict[str, Any]:
    with _lock:
        job = _jobs.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="No such job.")
        return _public(dict(job))
