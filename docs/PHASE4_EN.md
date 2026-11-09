# duNemilia — Phase 4: automated regression for the safe WebMCP laboratory

Date: 2026-11-09. Base: `main` at `2473a33baf3da2d39637ecafb7ac057cb6a8cc63`.

## Scope
- Test the lab HTML offline using `node:vm` and `node:test`, without external requests.
- Cover tool registration, navigator fallback, unavailable API, read-only execution, one direct increment, invalid args, delayed tool, reset and missing hints.
- Run the pre-existing localization, Python tests, reversible HTML build on Windows/Linux.
- Do not alter `Nemilia-v2_2.html`, original extension or upstream license.

## Evidence limitations
The 'exactly one increment' case calls the tool function **once directly**. It does not demonstrate exactly-once semantics across Nemilia extension retries, reconnection or concurrent runs. Conservative handling of missing hints is a **lab-only assertion**, not a patch to the 2.3 extension.

## Windows PowerShell
```powershell
python -m unittest discover -s tests -v
node --check i18n/runtime.js
node --test tests/*.test.cjs
python tools/build_i18n.py --input Nemilia-v2_2.html --output dist/Nemilia-v2_2-i18n-pilot.html
```

## Release blockers
1. Real Chrome WebMCP + unpacked 2.3.0 extension with recorded consent decisions and versions.
2. Retry/cancel/tab navigation/reload/suspension: no duplicate or wrong-tab execution.
3. 2.3 disposable profiles: encrypted storage, backup, migration and recovery.
4. Network inspection, CSP and prompt injection hardening.
5. Dynamic UI strings through keyed i18n, preserving user data.
6. Research comparison with n8n, Flowise, Langflow, LibreChat and Open WebUI including licenses; no benchmark run here.

## Classification
CI = isolated regression evidence. Real Chrome integration = **not executed**. Full security certification = **not performed**.
