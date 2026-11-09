#!/usr/bin/env python3
"""Reversible offline i18n pilot injection; does not modify original HTML."""
from pathlib import Path
import argparse
import re

MARKER = '<!-- duNemilia-i18n-pilot:1 -->'

def build(source: Path, runtime: Path, destination: Path) -> None:
    if source.resolve() == destination.resolve():
        raise ValueError('Refusing to overwrite source')
    data = source.read_text(encoding='utf-8')
    js = runtime.read_text(encoding='utf-8')
    if MARKER in data:
        raise ValueError('Pilot already injected')
    if '</script' in js.lower():
        raise ValueError('Embedded JS contains closing script tag')
    matches = list(re.finditer(r'</body\s*>', data, flags=re.IGNORECASE))
    if not matches:
        raise ValueError('Missing closing body tag')
    index = matches[-1].start()
    result = data[:index] + '\n' + MARKER + '\n<script>\n' + js + '\n</script>\n' + data[index:]
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(result, encoding='utf-8')

if __name__ == '__main__':
    p=argparse.ArgumentParser()
    p.add_argument('--input',type=Path,required=True)
    p.add_argument('--output',type=Path,required=True)
    p.add_argument('--runtime',type=Path,default=Path(__file__).resolve().parent.parent/'i18n/runtime.js')
    a=p.parse_args()
    build(a.input,a.runtime,a.output)
    print('PASS:',a.output)
