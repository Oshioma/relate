"""Run with:  WORKER_SECRET=test python -m pytest test_app.py   (or python test_app.py)"""

import os
import shutil
import time
import unittest
from pathlib import Path
from unittest import mock

os.environ.setdefault("WORKER_SECRET", "test-secret")

import app  # noqa: E402


class VttTests(unittest.TestCase):
    def test_rolling_auto_captions_say_each_line_once(self):
        vtt = """WEBVTT
Kind: captions
Language: en

00:00:00.000 --> 00:00:02.000 align:start position:0%
hello<00:00:00.500><c> everyone</c>

00:00:02.000 --> 00:00:02.010
hello everyone

00:00:02.010 --> 00:00:04.000
hello everyone
today we look at volcanoes

00:00:04.000 --> 00:00:06.000
today we look at volcanoes
&amp; how they erupt
"""
        self.assertEqual(
            app.vtt_to_text(vtt),
            "[0:00] hello everyone today we look at volcanoes & how they erupt",
        )

    def test_srt_style_numbers_and_music_are_dropped(self):
        vtt = "WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000\n[Music]\n\n2\n00:00:02.000 --> 00:00:03.000\nRight.\n"
        self.assertEqual(app.vtt_to_text(vtt), "[0:02] Right.")

    def test_each_paragraph_starts_with_its_first_cue_time(self):
        # One sentence per cue, a minute apart, long enough that each cue
        # closes a paragraph at the default target.
        cues = []
        for minute in (0, 4, 65):
            sentence = " ".join([f"volcano{minute}"] * 100) + "."
            hours, mins = divmod(minute, 60)
            stamp = f"{hours:02d}:{mins:02d}:05.250"
            cues.append(f"{stamp} --> {hours:02d}:{mins:02d}:09.000\n{sentence}\n")
        vtt = "WEBVTT\n\n" + "\n".join(cues)
        paras = app.vtt_to_text(vtt).split("\n\n")
        self.assertEqual([p.split(" ")[0] for p in paras], ["[0:05]", "[4:05]", "[1:05:05]"])

    def test_short_cue_timings_without_hours(self):
        vtt = "WEBVTT\n\n01:30.000 --> 01:32.000\nHello there.\n"
        self.assertEqual(app.vtt_to_text(vtt), "[1:30] Hello there.")


class MarkerTests(unittest.TestCase):
    def test_format(self):
        self.assertEqual(app.format_marker(0), "[0:00]")
        self.assertEqual(app.format_marker(245.9), "[4:05]")
        self.assertEqual(app.format_marker(3723), "[1:02:03]")
        self.assertEqual(app.format_marker(-3), "[0:00]")

    def test_paragraph_takes_the_time_of_its_first_word(self):
        pieces = [(0.0, "a" * 50 + "."), (10.0, "b" * 50 + "."), (20.0, "c" * 50 + ".")]
        self.assertEqual(
            app.timed_paragraphs(pieces, target=60),
            "[0:00] " + "a" * 50 + ". " + "b" * 50 + ".\n\n[0:20] " + "c" * 50 + ".",
        )

    def test_nothing_to_say(self):
        self.assertEqual(app.timed_paragraphs([]), "")
        self.assertEqual(app.timed_paragraphs([(3.0, "   ")]), "")


class WhisperTests(unittest.TestCase):
    def test_asks_for_segments_and_parses_them(self):
        sent = {}

        class Response:
            status_code = 200
            headers: dict = {}

            def json(self):
                return {
                    "text": " Hello there. General Kenobi. ",
                    "segments": [
                        {"start": 0.0, "end": 1.5, "text": " Hello there."},
                        {"start": 61.2, "end": 63.0, "text": " General Kenobi."},
                        {"start": 70.0, "end": 71.0, "text": "  "},
                    ],
                }

        def fake_post(url, **kwargs):
            sent.update(kwargs["data"])
            return Response()

        import tempfile
        from pathlib import Path
        from unittest import mock

        with tempfile.NamedTemporaryFile(suffix=".mp3") as handle, mock.patch.object(app.requests, "post", fake_post):
            text, segments = app._transcribe_chunk(Path(handle.name), "x" * 500)
        self.assertEqual(sent["response_format"], "verbose_json")
        self.assertEqual(sent["prompt"], "x" * 400)
        self.assertEqual(text, "Hello there. General Kenobi.")
        self.assertEqual(segments, [(0.0, "Hello there."), (61.2, "General Kenobi.")])

    def test_no_segments_keeps_the_words(self):
        self.assertEqual(app._parse_verbose({"text": "Just text."}), ("Just text.", [(0.0, "Just text.")]))

    def test_chunks_are_offset_and_prompted_with_plain_text(self):
        from pathlib import Path
        from unittest import mock

        prompts = []
        replies = {
            "chunk_000.mp3": ("First chunk.", [(0.0, "First"), (30.0, "chunk.")]),
            "chunk_001.mp3": ("Second chunk.", [(5.0, "Second chunk.")]),
        }

        def fake(path, prompt):
            prompts.append(prompt)
            return replies[path.name]

        with mock.patch.object(app, "_transcribe_chunk", fake), mock.patch.object(app, "CHUNK_MINUTES", 10):
            pieces = app._transcribe_all("no-such-job", [Path("chunk_000.mp3"), Path("chunk_001.mp3")])
        self.assertEqual(prompts, ["", "First chunk."])
        self.assertEqual(pieces, [(0.0, "First"), (30.0, "chunk."), (605.0, "Second chunk.")])
        self.assertEqual(app.timed_paragraphs(pieces, target=5), "[0:00] First chunk.\n\n[10:05] Second chunk.")


class ParagraphTests(unittest.TestCase):
    def test_breaks_after_sentences(self):
        text = " ".join(["This is a sentence of some length."] * 60)
        paras = app.paragraphs(text, target=200).split("\n\n")
        self.assertGreater(len(paras), 5)
        self.assertTrue(all(p.endswith(".") for p in paras))

    def test_breaks_unpunctuated_speech_on_words(self):
        text = " ".join(["word"] * 1000)
        paras = app.paragraphs(text, target=200).split("\n\n")
        self.assertGreater(len(paras), 5)
        self.assertEqual(sum(len(p.split()) for p in paras), 1000)


class HostTests(unittest.TestCase):
    def test_allowed(self):
        for url in [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtu.be/dQw4w9WgXcQ",
            "https://m.facebook.com/x/videos/1/",
            "https://fb.watch/abc/",
            "https://www.instagram.com/reel/abc/",
            "https://www.tiktok.com/@school/video/7234567890123456789",
            "https://vm.tiktok.com/ZMabc123/",
            "https://vimeo.com/76979871",
            "https://player.vimeo.com/video/76979871?h=a1b2c3",
        ]:
            self.assertTrue(app.is_allowed_url(url), url)

    def test_refused(self):
        for url in [
            "http://169.254.169.254/latest/meta-data",
            "https://youtube.com.evil.example/watch",
            "file:///etc/passwd",
            "https://notyoutube.com/watch",
            "https://tiktok.com.evil.example/@school/video/1",
            "https://eviltiktok.com/@school/video/1",
            "https://vimeo.com.evil.example/76979871",
            "https://notvimeo.com/76979871",
        ]:
            self.assertFalse(app.is_allowed_url(url), url)


class CaptionPickTests(unittest.TestCase):
    def test_manual_beats_auto_and_translations_are_ignored(self):
        info = {
            "language": "en",
            "subtitles": {"en-GB": [{"ext": "json3", "url": "x"}, {"ext": "vtt", "url": "manual"}]},
            "automatic_captions": {"en": [{"ext": "vtt", "url": "auto"}]},
        }
        self.assertEqual(app._pick_captions(info), ("manual", "en-GB"))

    def test_auto_translation_of_a_foreign_video_is_not_used(self):
        info = {
            "language": "es",
            "subtitles": {},
            "automatic_captions": {"es-orig": [{"ext": "vtt", "url": "es"}], "en": [{"ext": "vtt", "url": "en"}]},
        }
        self.assertIsNone(app._pick_captions(info))


class CookieTests(unittest.TestCase):
    GOOD = ".youtube.com\tTRUE\t/\tTRUE\t1893456000\tSID\tabc123"

    def test_tabs_turned_to_spaces_are_restored(self):
        pasted = "# Netscape HTTP Cookie File\n# comment\n.youtube.com TRUE / TRUE 1893456000 SID abc123\n"
        self.assertEqual(app.normalise_cookies(pasted), "# Netscape HTTP Cookie File\n" + self.GOOD + "\n")

    def test_flattened_newlines_and_missing_header(self):
        pasted = ".youtube.com TRUE / TRUE 1893456000 SID abc123\\n#HttpOnly_.youtube.com TRUE / TRUE 1893456000 HSID x"
        out = app.normalise_cookies(pasted).splitlines()
        self.assertEqual(out[0], "# Netscape HTTP Cookie File")
        self.assertEqual(out[1], self.GOOD)
        self.assertEqual(out[2], "#HttpOnly_.youtube.com\tTRUE\t/\tTRUE\t1893456000\tHSID\tx")

    def test_empty_value_kept(self):
        out = app.normalise_cookies(".x.com\tTRUE\t/\tFALSE\t0\tEMPTY\t").splitlines()
        self.assertEqual(out[1], ".x.com\tTRUE\t/\tFALSE\t0\tEMPTY\t")

    def test_real_file_passes_through(self):
        real = "# Netscape HTTP Cookie File\n" + self.GOOD + "\n"
        self.assertEqual(app.normalise_cookies(real), real)


class ErrorTests(unittest.TestCase):
    def test_bot_check_is_named(self):
        msg = app._friendly_download_error(Exception("ERROR: [youtube] x: Sign in to confirm you're not a bot. Use --cookies"))
        self.assertIn("bot", msg)
        self.assertTrue(msg.endswith(app.COOKIES_HELP_URL), msg)


class ProxyTests(unittest.TestCase):
    def test_whole_curl_command_is_reduced_to_the_proxy(self):
        pasted = "curl -v -x http://u:p_country-gb_session-x_lifetime-30m@geo.iproyal.com:12321 -L https://ipv4.icanhazip.com"
        self.assertEqual(app.clean_proxy(pasted), "http://u:p_country-gb_session-x_lifetime-30m@geo.iproyal.com:12321")

    def test_plain_values(self):
        self.assertEqual(app.clean_proxy("  http://u:p@h:1  "), "http://u:p@h:1")
        self.assertEqual(app.clean_proxy("socks5://h:1"), "socks5://h:1")
        self.assertEqual(app.clean_proxy("u:p@h:1"), "http://u:p@h:1")
        self.assertIsNone(app.clean_proxy(""))

    def test_credentials_are_redacted(self):
        self.assertEqual(
            app.redact("Unable to connect to proxy http://user:secret@geo.iproyal.com:12321 failed"),
            "Unable to connect to proxy http://***@geo.iproyal.com:12321 failed",
        )
        self.assertEqual(app.redact("https://youtube.com/watch?v=x"), "https://youtube.com/watch?v=x")

    def test_proxy_errors_name_the_proxy_and_hide_the_password(self):
        msg = app._friendly_download_error(
            Exception("Unable to connect to proxy http://user:secret@h:1 Tunnel connection failed: 407")
        )
        self.assertIn("YTDLP_PROXY", msg)
        self.assertNotIn("secret", msg)


class UsageTests(unittest.TestCase):
    def test_byte_counter_banks_each_finished_file(self):
        counter = app.ByteCounter()
        counter.hook({"status": "downloading", "downloaded_bytes": 100})
        counter.hook({"status": "downloading", "downloaded_bytes": 600})
        counter.hook({"status": "finished", "downloaded_bytes": 1000})
        counter.hook({"status": "downloading", "downloaded_bytes": 50})
        self.assertEqual(counter.total, 1050)  # a part-way second file still counts
        counter.hook({"status": "finished", "total_bytes": 80})
        self.assertEqual(counter.total, 1080)

    def test_byte_counter_falls_back_to_last_progress(self):
        counter = app.ByteCounter()
        counter.hook({"status": "downloading", "downloaded_bytes": 400})
        counter.hook({"status": "finished"})
        self.assertEqual(counter.total, 400)

    def test_audio_estimate_is_capped_by_duration(self):
        full = app.CHUNK_MINUTES * 60
        self.assertEqual(app.estimate_audio_seconds(None, 2), 2 * full)
        self.assertEqual(app.estimate_audio_seconds(full + 30, 2), full + 30)
        self.assertEqual(app.estimate_audio_seconds(0, 1), full)

    def test_public_reports_usage(self):
        job = {"id": "x", "status": "done", "audio_seconds": 612.4, "download_bytes": 1234, "proxied": True}
        out = app._public(job)
        self.assertEqual(out["audio_seconds"], 612)
        self.assertEqual(out["download_bytes"], 1234)
        self.assertTrue(out["proxied"])

    def test_public_old_job_has_no_usage(self):
        out = app._public({"id": "x", "status": "done"})
        self.assertIsNone(out["audio_seconds"])
        self.assertIsNone(out["download_bytes"])
        self.assertIsNone(out["proxied"])

    def test_add_usage_accumulates(self):
        app._jobs["usage-test"] = {"id": "usage-test", "created_at": 0}
        old_dir = app.JOBS_DIR
        app.JOBS_DIR = app.Path(app.tempfile.mkdtemp())
        try:
            app._add_usage("usage-test", download_bytes=10)
            app._add_usage("usage-test", download_bytes=5, audio_seconds=30.5)
            job = app._jobs["usage-test"]
            self.assertEqual(job["download_bytes"], 15)
            self.assertEqual(job["audio_seconds"], 30.5)
        finally:
            app._jobs.pop("usage-test", None)
            app.shutil.rmtree(app.JOBS_DIR, ignore_errors=True)
            app.JOBS_DIR = old_dir


class UploadTokenTests(unittest.TestCase):
    # Same vector as src/lib/school/lesson-media.test.ts, so the app's signer
    # and this checker can't drift apart unnoticed.
    TOKEN = "2000000000.db69dbd3f4307d45c1103ba7304ec8f20227f8b9e1508b38798954037af30231"
    NOW = 2_000_000_000 - 7200

    def test_matches_the_apps_signature(self):
        self.assertTrue(app.verify_upload_token("job-12345678", self.TOKEN, now=self.NOW, secret="test-secret"))

    def test_refused_for_another_job_secret_or_after_expiry(self):
        self.assertFalse(app.verify_upload_token("job-other", self.TOKEN, now=self.NOW, secret="test-secret"))
        self.assertFalse(app.verify_upload_token("job-12345678", self.TOKEN, now=self.NOW, secret="wrong"))
        self.assertFalse(app.verify_upload_token("job-12345678", self.TOKEN, now=2_000_000_001, secret="test-secret"))

    def test_malformed_tokens_are_refused(self):
        for token in ["", "garbage", "123.", ".abc", "-5.abc", "2000000000"]:
            self.assertFalse(app.verify_upload_token("job-12345678", token, now=self.NOW, secret="test-secret"), token)

    def test_round_trip_with_the_running_secret(self):
        expiry = int(time.time()) + 60
        token = f"{expiry}.{app.sign_upload_token('job-12345678', expiry)}"
        self.assertTrue(app.verify_upload_token("job-12345678", token))


class UploadHostTests(unittest.TestCase):
    def test_storage_urls_allowed(self):
        for url in [
            "https://abcdefgh.supabase.co/storage/v1/object/public/uploads/u/lesson-media/x.mp4",
            "https://abcdefgh.supabase.in/storage/v1/object/public/uploads/x.mp3",
        ]:
            self.assertTrue(app.is_allowed_upload_url(url), url)

    def test_everything_else_refused(self):
        for url in [
            "http://abcdefgh.supabase.co/storage/v1/object/public/uploads/x.mp4",  # not https
            "https://supabase.co.evil.example/x.mp4",
            "https://evilsupabase.co/x.mp4",
            "https://user:pass@abcdefgh.supabase.co/x.mp4",
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "http://169.254.169.254/latest/meta-data",
            "file:///etc/passwd",
        ]:
            self.assertFalse(app.is_allowed_upload_url(url), url)


class NewJobValidationTests(unittest.TestCase):
    def setUp(self):
        self._groq = app.GROQ_API_KEY
        app.GROQ_API_KEY = "test-key"

    def tearDown(self):
        app.GROQ_API_KEY = self._groq

    def check(self, **fields):
        app.validate_new_job(app.NewJob(**fields))

    def refused(self, **fields):
        with self.assertRaises(app.HTTPException) as caught:
            self.check(**fields)
        return caught.exception

    def test_link_jobs_unchanged(self):
        self.check(id="job-12345678", url="https://youtu.be/dQw4w9WgXcQ")
        self.refused(id="job-12345678", url="https://abcdefgh.supabase.co/x.mp4")
        self.refused(id="job-12345678")

    def test_file_jobs_only_from_storage(self):
        self.check(id="job-12345678", kind="file", url="https://abcdefgh.supabase.co/x.mp4", file_name="a.mp4")
        self.refused(id="job-12345678", kind="file", url="https://youtu.be/dQw4w9WgXcQ")
        self.refused(id="job-12345678", kind="file")

    def test_direct_jobs_take_no_url(self):
        self.check(id="job-12345678", kind="direct", file_name="big.mov")
        self.refused(id="job-12345678", kind="direct", url="https://abcdefgh.supabase.co/x.mp4")

    def test_unknown_kind_and_bad_id(self):
        self.assertEqual(self.refused(id="job-12345678", kind="torrent").detail, "Unknown kind of job.")
        self.refused(id="../etc", url="https://youtu.be/dQw4w9WgXcQ")

    def test_files_need_whisper(self):
        app.GROQ_API_KEY = ""
        self.refused(id="job-12345678", kind="direct", file_name="big.mov")


class DirectUploadRouteTests(unittest.TestCase):
    """The browser-facing route, end to end except for ffmpeg and Whisper."""

    def setUp(self):
        from fastapi.testclient import TestClient

        self.client = TestClient(app.app)
        self.job_id = "job-" + str(int(time.time() * 1000))
        self.submitted = []
        self._submit = app._pool.submit
        app._pool.submit = lambda *args: self.submitted.append(args)
        self._groq = app.GROQ_API_KEY
        app.GROQ_API_KEY = "test-key"
        response = self.client.post(
            "/jobs",
            json={"id": self.job_id, "kind": "direct", "file_name": "Talk.mov"},
            headers={"Authorization": f"Bearer {app.WORKER_SECRET}"},
        )
        self.assertEqual(response.status_code, 202, response.text)
        self.assertEqual(response.json()["message"], "Waiting for the upload…")
        self.assertEqual(response.json()["title"], "Talk")

    def tearDown(self):
        app._pool.submit = self._submit
        app.GROQ_API_KEY = self._groq
        for *_, workdir in self.submitted:
            shutil.rmtree(workdir, ignore_errors=True)

    def token(self, job_id=None):
        job_id = job_id or self.job_id
        expiry = int(time.time()) + 60
        return f"Upload {expiry}.{app.sign_upload_token(job_id, expiry)}"

    def test_preflight_allows_any_origin(self):
        response = self.client.options(
            f"/jobs/{self.job_id}/upload",
            headers={"Origin": "https://relate.click", "Access-Control-Request-Method": "PUT"},
        )
        self.assertEqual(response.status_code, 204)
        self.assertEqual(response.headers["access-control-allow-origin"], "*")
        self.assertIn("PUT", response.headers["access-control-allow-methods"])
        self.assertIn("Authorization", response.headers["access-control-allow-headers"])

    def test_bad_token_refused_with_cors_headers(self):
        response = self.client.put(
            f"/jobs/{self.job_id}/upload",
            content=b"x" * 10,
            headers={"Authorization": self.token("job-someone-else")},
        )
        self.assertEqual(response.status_code, 401)
        # Without this the browser can't even read the refusal.
        self.assertEqual(response.headers["access-control-allow-origin"], "*")
        self.assertEqual(self.submitted, [])

    def test_bearer_secret_is_not_an_upload_token(self):
        response = self.client.put(
            f"/jobs/{self.job_id}/upload",
            content=b"x",
            headers={"Authorization": f"Bearer {app.WORKER_SECRET}"},
        )
        self.assertEqual(response.status_code, 401)

    def test_upload_is_stored_and_handed_on_once(self):
        response = self.client.put(
            f"/jobs/{self.job_id}/upload", content=b"fake media bytes", headers={"Authorization": self.token()}
        )
        self.assertEqual(response.status_code, 202, response.text)
        self.assertEqual(len(self.submitted), 1)
        fn, job_id, source, _ = self.submitted[0]
        self.assertIs(fn, app.run_uploaded_job)
        self.assertEqual(job_id, self.job_id)
        self.assertEqual(Path(source).read_bytes(), b"fake media bytes")

        again = self.client.put(f"/jobs/{self.job_id}/upload", content=b"x", headers={"Authorization": self.token()})
        self.assertEqual(again.status_code, 409)

    def test_over_the_cap_is_refused(self):
        cap = app.MAX_UPLOAD_BYTES
        app.MAX_UPLOAD_BYTES = 8
        try:
            response = self.client.put(
                f"/jobs/{self.job_id}/upload", content=b"0123456789", headers={"Authorization": self.token()}
            )
        finally:
            app.MAX_UPLOAD_BYTES = cap
        self.assertEqual(response.status_code, 413)
        self.assertEqual(self.submitted, [])


class FileJobTests(unittest.TestCase):
    """A kept upload's job, with ffprobe/ffmpeg and Whisper stubbed out."""

    def test_fetches_then_transcribes(self):
        job_id = "job-file-" + str(int(time.time() * 1000))
        app._jobs[job_id] = {"id": job_id, "status": "queued", "created_at": time.time()}

        class FakeResponse:
            status_code = 200
            headers = {"content-length": "6"}

            def __enter__(self):
                return self

            def __exit__(self, *exc):
                return False

            def iter_content(self, chunk_size):
                yield b"abc"
                yield b"def"

        seen = {}

        def fake_whisper(jid, source, workdir, what="video"):
            seen["bytes"] = Path(source).read_bytes()
            app._update(jid, status="done", transcript="hello", method="whisper")

        with mock.patch.object(app.requests, "get", return_value=FakeResponse()) as get, \
                mock.patch.object(app, "_probe_duration", return_value=90.0), \
                mock.patch.object(app, "_whisper", side_effect=fake_whisper):
            app.run_file_job(job_id, "https://x.supabase.co/storage/v1/object/public/uploads/a.mp4")

        self.assertFalse(get.call_args.kwargs["allow_redirects"])
        self.assertEqual(seen["bytes"], b"abcdef")
        self.assertEqual(app._jobs[job_id]["status"], "done")
        self.assertEqual(app._jobs[job_id]["duration_seconds"], 90)

    def test_too_long_recording_is_refused_before_whisper(self):
        job_id = "job-long-" + str(int(time.time() * 1000))
        app._jobs[job_id] = {"id": job_id, "status": "queued", "created_at": time.time()}
        with mock.patch.object(app, "_probe_duration", return_value=app.MAX_DURATION_MINUTES * 60 + 1), \
                mock.patch.object(app, "_whisper") as whisper:
            self.assertFalse(app._check_duration(job_id, Path("/nonexistent")))
        whisper.assert_not_called()
        self.assertEqual(app._jobs[job_id]["status"], "error")


class MergedWhisperTests(unittest.TestCase):
    """The shared Whisper step, as uploads, timestamps and usage all use it."""

    def test_whisper_writes_timed_transcript_and_counts_audio(self):
        job_id = "whisper-merge-test"
        app._jobs[job_id] = {"id": job_id, "created_at": 0, "audio_seconds": 0}
        old_dir = app.JOBS_DIR
        app.JOBS_DIR = app.Path(app.tempfile.mkdtemp())
        workdir = app.Path(app.tempfile.mkdtemp())
        audio = workdir / "source.upload"
        audio.write_bytes(b"x")
        chunks = [workdir / "c0.mp3", workdir / "c1.mp3"]

        def fake_chunk(path, prompt):
            first = path.name == "c0.mp3"
            words = "Volcanoes start deep underground." if first else "Lava cools into new rock."
            return words, [(5.0, words)]

        try:
            with mock.patch.object(app, "_split_audio", return_value=chunks), \
                    mock.patch.object(app, "_probe_seconds", side_effect=[600.0, 95.5]), \
                    mock.patch.object(app, "_transcribe_chunk", side_effect=fake_chunk):
                app._whisper(job_id, audio, workdir, what="recording", duration=695.5)
            job = app._jobs[job_id]
            self.assertEqual(job["status"], "done")
            self.assertEqual(job["method"], "whisper")
            self.assertIn("[0:05] Volcanoes start deep underground.", job["transcript"])
            self.assertIn("Lava cools into new rock.", job["transcript"])
            self.assertEqual(job["audio_seconds"], 695.5)
        finally:
            app._jobs.pop(job_id, None)
            app.shutil.rmtree(app.JOBS_DIR, ignore_errors=True)
            app.shutil.rmtree(workdir, ignore_errors=True)
            app.JOBS_DIR = old_dir


if __name__ == "__main__":
    unittest.main()
