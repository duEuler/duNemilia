from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]

class LocalizationContract(unittest.TestCase):
    def test_known_controls_are_scoped(self):
        code = (ROOT / 'i18n/runtime.js').read_text(encoding='utf-8')
        for token in ('dictionary=', 'chat-msg', '[contenteditable]', 'data-user-content', 'MutationObserver', 'placeholder', 'languagechange'):
            self.assertIn(token, code)
        self.assertNotIn('innerHTML=', code)
        for token in ('"Save": "Salvar"', '"Cancel": "Cancelar"', '"Name": "Nome"'):
            self.assertIn(token, code)

    def test_webmcp_fixture_is_disposable(self):
        code = (ROOT / 'labs/webmcp-fixture.html').read_text(encoding='utf-8')
        for token in ('lab_read', 'lab_increment', 'lab_delayed', 'readOnlyHint:false', 'consequentialHint:true'):
            self.assertIn(token, code)
        self.assertNotIn('fetch(', code)
        self.assertNotIn('XMLHttpRequest', code)
        self.assertNotIn('https://', code)

if __name__ == '__main__':
    unittest.main()
