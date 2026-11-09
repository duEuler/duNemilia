# duNemilia — Phase 7: real MV3 tab isolation automation

**Verified base**: `main` = `0aaed9eb3f75ebd28375700b7a0107ae71afb3b7` (PR #6 merged).

## Scope
Playwright launches the public Nemilia 2.2 extension in actual Chromium. It verifies service worker readiness, distinct synthetic localhost tabs, `chrome.scripting.executeScript`, tab state isolation and navigation replacing page state.

## Local Windows PowerShell
```powershell
py -m pip install playwright==1.58.0
py -m playwright install chromium
py tests/extension_tabs_smoke.py --zip nemilia-extension.zip --output artifacts/extension-tabs.json
```
For release candidate 2.3, pass its zip **only in a local/private environment**. Do not upload the privately shared RC into the public repository.

## Evidence boundaries
The injection function is an independent fixture and does not exercise Nemilia's WebMCP bridge. This is real MV3 integration, **not** real WebMCP approval. No third-party websites, accounts, tokens, or persistent external effects.

## Next experiments
1. Supported Chrome >=149 with native WebMCP enabled and unpacked 2.3 RC.
2. Consequential/missing-hint consent and denial.
3. Navigation, concurrent calls, reload, idempotency, wrong-origin rejection.
4. Redacted screenshots, logs, build and Chrome version.

## Verified automated laboratory result
- GitHub Actions run `42705123950`: **6/6 PASS** with real Chromium and the public v2.2.0 extension.
- Covered real `chrome.scripting.executeScript` into isolated localhost tabs and document replacement after navigation.
- Local v2.3.0 release candidate: blocked by service worker not appearing under Chromium 144; no confirmed product defect.
