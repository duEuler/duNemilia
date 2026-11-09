import pathlib
import tempfile
import unittest
from tools.build_i18n import build,MARKER

R=pathlib.Path(__file__).resolve().parents[1]
class BuildTests(unittest.TestCase):
    def test_reversible_once(self):
        with tempfile.TemporaryDirectory() as d:
            root=pathlib.Path(d);src=root/'input.html';out=root/'out.html'
            src.write_text('<html><body><div id="sidebar"></div></body></html>',encoding='utf-8')
            original=src.read_text(encoding='utf-8')
            build(src,R/'i18n/runtime.js',out)
            self.assertEqual(src.read_text(encoding='utf-8'),original)
            self.assertEqual(out.read_text(encoding='utf-8').count(MARKER),1)
            with self.assertRaises(ValueError):build(out,R/'i18n/runtime.js',root/'again.html')
    def test_no_source_overwrite(self):
        with tempfile.TemporaryDirectory() as d:
            src=pathlib.Path(d)/'test.html';src.write_text('<body></body>')
            with self.assertRaises(ValueError):build(src,R/'i18n/runtime.js',src)
    def test_requires_body(self):
        with tempfile.TemporaryDirectory() as d:
            src=pathlib.Path(d)/'test.html';src.write_text('<body>')
            with self.assertRaises(ValueError):build(src,R/'i18n/runtime.js',pathlib.Path(d)/'out.html')
