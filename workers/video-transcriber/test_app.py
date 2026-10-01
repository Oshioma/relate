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
            "hello everyone today we look at volcanoes & how they erupt",
        )

    def test_srt_style_numbers_and_music_are_dropped(self):
        vtt = "WEBVTT\n\n1\n00:00:01.000 --> 00:00:02.000\n[Music]\n\n2\n00:00:02.000 --> 00:00:03.000\nRight.\n"
        self.assertEqual(app.vtt_to_text(vtt), "Right.")


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
        ]:
            self.assertTrue(app.is_allowed_url(url), url)

    def test_refused(self):
        for url in [
            "http://169.254.169.254/latest/meta-data",
            "https://youtube.com.evil.example/watch",
            "file:///etc/passwd",
            "https://notyoutube.com/watch",
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


if __name__ == "__main__":
    unittest.main()
