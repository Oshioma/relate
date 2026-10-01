"""
Relate video transcriber.

A small web service that turns a YouTube / Facebook / Instagram video link, or
a teacher's own video or audio file, into plain text for the lesson composer.
The Relate app starts a job and polls it; this service never calls the app and
holds no database credentials.

    POST /jobs        {"id": "<uuid>", "url": "<video link>"}             -> 202
    POST /jobs        {"id", "kind": "file", "url": "<storage URL>", "file_name"}
    POST /jobs        {"id", "kind": "direct", "file_name"}               -> 202
    PUT  /jobs/{id}/upload   the file itself, for a "direct" job
    GET  /jobs/{id}                                                       -> job status
    GET  /health                                                          -> ok + versions

POST /jobs and GET /jobs/{id} need "Authorization: Bearer <WORKER_SECRET>".
PUT /jobs/{id}/upload comes from the teacher's browser, so it can't carry the
secret: it needs "Authorization: Upload <token>", a short-lived HMAC the app
signs for that one job (see verify_upload_token).

Three kinds of job:
  link    a video link, fetched with yt-dlp — see below.
  file    an upload the app kept in Supabase Storage (≤ 200 MB). Fetched from
          its public URL with plain HTTP, only from UPLOAD_HOST_SUFFIXES.
  direct  an upload too big for Storage. The browser PUTs it straight here.
Files always go the Whisper way: a file has no captions to read.

How a video link becomes text, cheapest first:
  1. Captions. If the platform already has captions in a language we want
     (most YouTube videos do), download those. Free, and takes seconds.
  2. Whisper. Otherwise download just the audio, squash it to small mono
     chunks with ffmpeg, and send each chunk to Groq's Whisper API
     (about $0.04 per hour of audio).

Configuration is all environment variables — see .env.example.
"""

from __future__ import annotations

import base64
import hashlib
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
from fastapi import Depends, FastAPI, Header, HTTPException, Request
from pydantic import BaseModel
from starlette.requests import ClientDisconnect

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
YTDLP_PROXY = os.environ.get("YTDLP_PROXY", "").strip() or None

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
ALLOWED_HOSTS = ("youtube.com", "youtu.be", "facebook.com", "fb.watch", "instagram.com")

# Where "file" jobs may be fetched from: the app's Supabase Storage. Same
# reasoning as ALLOWED_HOSTS — the app only ever sends its own bucket's URLs,
# so anything else is somebody trying to use the worker as a downloader.
UPLOAD_HOST_SUFFIXES = tuple(
    suffix.strip().lower().lstrip(".")
    for suffix in os.environ.get("UPLOAD_HOST_SUFFIXES", "supabase.co,supabase.in").split(",")
    if suffix.strip()
)

# The biggest file accepted, fetched or uploaded. Big enough for a couple of
# hours of phone video; everything past MAX_DURATION_MINUTES is cut anyway.
MAX_UPLOAD_MB = _env_int("MAX_UPLOAD_MB", 4000)
MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024

JOB_KINDS = ("link", "file", "direct")

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


def is_allowed_upload_url(raw: str) -> bool:
    """A "file" job's URL: https, on the app's own Storage host."""
    try:
        parsed = urlparse(raw)
    except ValueError:
        return False
    if parsed.scheme != "https" or parsed.username or parsed.password:
        return False
    host = (parsed.hostname or "").lower()
    return any(host == suffix or host.endswith("." + suffix) for suffix in UPLOAD_HOST_SUFFIXES)


def sign_upload_token(job_id: str, expires_at: int, secret: Optional[str] = None) -> str:
    """The token's signature. The app makes these; see src/lib/school/upload-token.ts."""
    key = (WORKER_SECRET if secret is None else secret).encode()
    return hmac.new(key, f"{job_id}.{expires_at}".encode(), hashlib.sha256).hexdigest()


def verify_upload_token(job_id: str, token: str, now: Optional[float] = None, secret: Optional[str] = None) -> bool:
    """"<expiry unix seconds>.<hex HMAC-SHA256(secret, '<job id>.<expiry>')>", for this job, not expired.

    The browser sending a direct upload can't be given WORKER_SECRET, so the app
    signs one of these for one job and a couple of hours instead.
    """
    if not (WORKER_SECRET if secret is None else secret):
        return False
    expiry, _, signature = token.partition(".")
    if not expiry.isdigit() or not signature:
        return False
    if int(expiry) < (time.time() if now is None else now):
        return False
    expected = sign_upload_token(job_id, int(expiry), secret)
    return hmac.compare_digest(signature.encode(), expected.encode())


def title_from_file_name(name: Optional[str]) -> Optional[str]:
    """ "Lecture 3.mp4" -> "Lecture 3". """
    if not name:
        return None
    stem = re.sub(r"\.[A-Za-z0-9]{1,8}$", "", name).strip()
    return (stem or name)[:200]


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
    message = str(error)
    lowered = message.lower()
    # Kept in full in the Railway logs; the teacher gets a sentence.
    print(f"download failed: {message}", flush=True)
    how = f" How to fix it: {COOKIES_HELP_URL}"
    if "not a bot" in lowered or "confirm you" in lowered:
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
                    print(f"{job_id}: captions failed, falling back to audio: {error}", flush=True)
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

        _whisper(job_id, audio, workdir)
    except Exception as error:  # never leave a job stuck "running"
        print(f"{job_id}: failed: {error!r}", flush=True)
        _update(job_id, status="error", error=str(error)[:300] or "Something went wrong.")
    finally:
        shutil.rmtree(workdir, ignore_errors=True)


def _whisper(job_id: str, audio: Path, workdir: Path, what: str = "video") -> None:
    """Downloaded audio (or video) -> chunks -> Groq Whisper -> a finished job."""
    _update(job_id, progress=0.36, message="Preparing the audio…")
    chunks = _split_audio(audio, workdir)
    audio.unlink(missing_ok=True)  # free the disk before the long part
    if not chunks:
        _update(job_id, status="error", error=f"That {what} has no audio track.")
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
        _update(job_id, status="error", error=f"No speech was found in that {what}.")
        return

    _update(job_id, status="done", progress=1.0, method="whisper", transcript=text, message=None)


# --------------------------------------------------------------------------
# Uploaded files
# --------------------------------------------------------------------------


def _probe_duration(path: Path) -> Optional[float]:
    """Seconds of media in a file, or None if ffprobe can't tell."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
            capture_output=True, text=True, timeout=120,
        )
        return float(result.stdout.strip()) if result.returncode == 0 else None
    except (OSError, ValueError, subprocess.SubprocessError):
        return None


class TooBig(Exception):
    pass


def _fetch_file(job_id: str, url: str, workdir: Path) -> Path:
    """A kept upload, fetched from Storage. Streamed to disk, capped at MAX_UPLOAD_MB.

    Plain HTTP rather than yt-dlp: it is one file at a known address, and
    redirects are refused so the host check can't be walked around.
    """
    target = workdir / "source.upload"
    with requests.get(url, stream=True, timeout=(15, 120), allow_redirects=False) as response:
        if response.status_code != 200:
            raise RuntimeError(f"Couldn't fetch the uploaded file ({response.status_code}).")
        total = int(response.headers.get("content-length") or 0)
        if total > MAX_UPLOAD_BYTES:
            raise TooBig()
        done = 0
        last_report = 0.0
        with target.open("wb") as handle:
            for block in response.iter_content(chunk_size=1024 * 1024):
                done += len(block)
                if done > MAX_UPLOAD_BYTES:
                    raise TooBig()
                handle.write(block)
                if total and time.time() - last_report > 1:
                    last_report = time.time()
                    fraction = min(1.0, done / total)
                    _update(
                        job_id,
                        progress=round(0.05 + 0.3 * fraction, 3),
                        message=f"Fetching the file… {int(fraction * 100)}%",
                    )
    return target


def _check_duration(job_id: str, source: Path) -> bool:
    """Records the length; False (and an error on the job) if it's too long."""
    duration = _probe_duration(source)
    if duration:
        _update(job_id, duration_seconds=int(duration))
        if duration > MAX_DURATION_MINUTES * 60:
            _update(
                job_id,
                status="error",
                error=f"That recording is over {MAX_DURATION_MINUTES // 60} hours — too long for one lesson.",
            )
            return False
    return True


def run_file_job(job_id: str, url: str) -> None:
    """A "file" job: fetch the kept upload from Storage, then Whisper."""
    workdir = Path(tempfile.mkdtemp(prefix="relate-file-"))
    try:
        _update(job_id, status="downloading", progress=0.05, message="Fetching the file…")
        try:
            source = _fetch_file(job_id, url, workdir)
        except TooBig:
            _update(job_id, status="error", error=f"That file is over {MAX_UPLOAD_MB} MB.")
            return
        except requests.RequestException as error:
            print(f"{job_id}: fetch failed: {error!r}", flush=True)
            _update(job_id, status="error", error="Couldn't fetch the uploaded file. Try again.")
            return
        if _check_duration(job_id, source):
            _whisper(job_id, source, workdir, what="recording")
    except Exception as error:  # never leave a job stuck "running"
        print(f"{job_id}: failed: {error!r}", flush=True)
        _update(job_id, status="error", error=str(error)[:300] or "Something went wrong.")
    finally:
        shutil.rmtree(workdir, ignore_errors=True)


def run_uploaded_job(job_id: str, source: Path, workdir: Path) -> None:
    """A "direct" job, once its file has arrived: straight to Whisper."""
    try:
        if _check_duration(job_id, source):
            _whisper(job_id, source, workdir, what="recording")
    except Exception as error:  # never leave a job stuck "running"
        print(f"{job_id}: failed: {error!r}", flush=True)
        _update(job_id, status="error", error=str(error)[:300] or "Something went wrong.")
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

_UPLOAD_ROUTE = re.compile(r"^/jobs/[^/]+/upload$")
_UPLOAD_CORS = [
    # Any origin: the browser is on the Relate site, or a community's own
    # domain, or localhost in development. The per-job token is the guard,
    # not the origin — and no cookies are involved, so "*" is safe.
    (b"access-control-allow-origin", b"*"),
    (b"access-control-allow-methods", b"PUT, OPTIONS"),
    (b"access-control-allow-headers", b"Authorization, Content-Type"),
    (b"access-control-max-age", b"86400"),
]


class UploadCors:
    """CORS for the one route a browser calls, and nothing else.

    Plain ASGI rather than Starlette's CORSMiddleware or a BaseHTTPMiddleware,
    so the request body streams straight through to the route untouched —
    the body here can be gigabytes.
    """

    def __init__(self, app: Any) -> None:
        self.app = app

    async def __call__(self, scope: dict[str, Any], receive: Any, send: Any) -> None:
        if scope["type"] != "http" or not _UPLOAD_ROUTE.match(scope.get("path", "")):
            await self.app(scope, receive, send)
            return
        if scope["method"] == "OPTIONS":
            await send({"type": "http.response.start", "status": 204, "headers": _UPLOAD_CORS})
            await send({"type": "http.response.body", "body": b""})
            return

        async def send_with_cors(message: dict[str, Any]) -> None:
            if message["type"] == "http.response.start":
                message = {**message, "headers": [*message.get("headers", []), *_UPLOAD_CORS]}
            await send(message)

        await self.app(scope, receive, send_with_cors)


app.add_middleware(UploadCors)


def require_secret(authorization: str = Header(default="")) -> None:
    expected = f"Bearer {WORKER_SECRET}"
    if not WORKER_SECRET or not hmac.compare_digest(authorization.encode(), expected.encode()):
        raise HTTPException(status_code=401, detail="Wrong or missing secret.")


class NewJob(BaseModel):
    id: str
    # Required for "link" and "file"; a "direct" job's file arrives later.
    url: Optional[str] = None
    kind: str = "link"
    file_name: Optional[str] = None


def validate_new_job(body: NewJob) -> None:
    """Raises a 400 for anything the worker shouldn't start."""
    if not re.fullmatch(r"[A-Za-z0-9-]{8,64}", body.id):
        raise HTTPException(status_code=400, detail="Bad job id.")
    if body.kind not in JOB_KINDS:
        raise HTTPException(status_code=400, detail="Unknown kind of job.")
    if body.kind == "link":
        if not body.url or not is_allowed_url(body.url):
            raise HTTPException(status_code=400, detail="Only YouTube, Facebook and Instagram links are supported.")
        return
    # Files have no captions, so without Whisper there is no point taking one
    # — least of all a multi-GB upload.
    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=400,
            detail="Transcribing uploaded files isn't set up on the video service (no GROQ_API_KEY).",
        )
    if body.kind == "file" and (not body.url or not is_allowed_upload_url(body.url)):
        raise HTTPException(status_code=400, detail="That file isn't in the app's storage.")
    if body.kind == "direct" and body.url:
        raise HTTPException(status_code=400, detail="A direct upload is sent to /jobs/{id}/upload, not fetched.")


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
    }


@app.post("/jobs", status_code=202, dependencies=[Depends(require_secret)])
def create_job(body: NewJob) -> dict[str, Any]:
    validate_new_job(body)

    _prune()
    with _lock:
        existing = _jobs.get(body.id)
        if existing:  # the app retried — same id, same job
            return _public(existing)
        now = time.time()
        job = {
            "id": body.id,
            "kind": body.kind,
            "url": body.url,
            "title": title_from_file_name(body.file_name),
            "status": "queued",
            "progress": 0.0,
            "message": "Waiting for the upload…" if body.kind == "direct" else "Waiting for a free slot…",
            # A direct job is only a placeholder until its file arrives.
            "awaiting_upload": body.kind == "direct",
            "created_at": now,
            "updated_at": now,
        }
        _jobs[body.id] = job
    _save(job)
    if body.kind == "link":
        _pool.submit(run_job, body.id, body.url)
    elif body.kind == "file":
        _pool.submit(run_file_job, body.id, body.url)
    return _public(job)


def _claim_upload(job_id: str) -> None:
    """Marks a direct job as receiving its file, so a second PUT can't race it."""
    with _lock:
        job = _jobs.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="No such job.")
        if job.get("kind") != "direct" or not job.get("awaiting_upload"):
            raise HTTPException(status_code=409, detail="That job isn't waiting for a file.")
        job["awaiting_upload"] = False
    _update(job_id, status="downloading", progress=0.02, message="Receiving the upload…")


@app.put("/jobs/{job_id}/upload", status_code=202)
async def upload_file(job_id: str, request: Request, authorization: str = Header(default="")) -> dict[str, Any]:
    scheme, _, token = authorization.partition(" ")
    if scheme != "Upload" or not verify_upload_token(job_id, token.strip()):
        raise HTTPException(status_code=401, detail="That upload link has expired or isn't valid.")

    declared = int(request.headers.get("content-length") or 0)
    if declared > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail=f"That file is over {MAX_UPLOAD_MB} MB.")

    _claim_upload(job_id)
    workdir = Path(tempfile.mkdtemp(prefix="relate-upload-"))
    source = workdir / "source.upload"
    received = 0
    last_report = 0.0
    try:
        with source.open("wb") as handle:
            async for block in request.stream():
                received += len(block)
                if received > MAX_UPLOAD_BYTES:
                    raise HTTPException(status_code=413, detail=f"That file is over {MAX_UPLOAD_MB} MB.")
                handle.write(block)
                if declared and time.time() - last_report > 2:
                    last_report = time.time()
                    fraction = min(1.0, received / declared)
                    _update(
                        job_id,
                        progress=round(0.02 + 0.33 * fraction, 3),
                        message=f"Receiving the upload… {int(fraction * 100)}%",
                    )
    except HTTPException as error:
        shutil.rmtree(workdir, ignore_errors=True)
        _update(job_id, status="error", error=str(error.detail))
        raise
    except ClientDisconnect:
        shutil.rmtree(workdir, ignore_errors=True)
        _update(job_id, status="error", error="The upload was cut off. Start it again.")
        raise HTTPException(status_code=400, detail="The upload was cut off.")

    if received == 0:
        shutil.rmtree(workdir, ignore_errors=True)
        _update(job_id, status="error", error="The upload was empty.")
        raise HTTPException(status_code=400, detail="The upload was empty.")

    _update(job_id, progress=0.35, message="Uploaded — waiting for a free slot…")
    _pool.submit(run_uploaded_job, job_id, source, workdir)
    with _lock:
        return _public(dict(_jobs[job_id]))


@app.get("/jobs/{job_id}", dependencies=[Depends(require_secret)])
def get_job(job_id: str) -> dict[str, Any]:
    with _lock:
        job = _jobs.get(job_id)
        if not job:
            raise HTTPException(status_code=404, detail="No such job.")
        return _public(dict(job))
