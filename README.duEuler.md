# duNemilia — Contribution / Contribuição

A reversible, minimal **EN/PT-BR navigation-only pilot** for the public Nemilia 2.2 single-file application. This is NOT the complete Nemilia 2.3 release candidate.

### Windows PowerShell
```powershell
python -m unittest discover -s tests -v
node --check i18n/runtime.js
python tools/build_i18n.py --input Nemilia-v2_2.html --output dist/Nemilia-v2_2-i18n-pilot.html
```
Open the generated HTML in Chrome; the Language / Idioma control appears in the sidebar when it uses `id="sidebar"`. Original application remains unmodified. This pilot only translates supported navigation IDs, not dialogs, messages, prompts or user content.

Upstream BSL 1.1 is preserved. This original pilot code is offered under MIT, without relicensing upstream artifacts.
