"""Run with:  WORKER_SECRET=test python -m pytest test_app.py   (or python test_app.py)"""

import os
import unittest

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


if __name__ == "__main__":
    unittest.main()
