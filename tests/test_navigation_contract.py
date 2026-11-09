"""Contract test: navigation hooks are real HTML elements, not JS strings."""
from html.parser import HTMLParser
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]
NAV_IDS={'ni-dashboard','ni-compose','ni-chat','ni-agents','ni-prompts',
         'ni-skills','ni-tasks','ni-workflows','ni-captured','ni-documents',
         'ni-memory','ni-results','ni-mcp'}

class IdParser(HTMLParser):
    def __init__(self):
        super().__init__();self.elements={}
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if attrs.get('id') in NAV_IDS or attrs.get('id')=='sidebar':
            self.elements[attrs['id']]=tag

class NavigationContract(unittest.TestCase):
    def test_original_build_contains_nav_hooks(self):
        source=ROOT/'Nemilia-v2_2.html'
        self.assertTrue(source.is_file(),'Run test in fork repository')
        parser=IdParser()
        parser.feed(source.read_text(encoding='utf-8'))
        self.assertEqual(parser.elements.get('sidebar'),'aside')
        for id in sorted(NAV_IDS):
            self.assertEqual(parser.elements.get(id),'button',f'missing nav button: {id}')
