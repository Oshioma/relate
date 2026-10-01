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


if __name__ == "__main__":
    unittest.main()
