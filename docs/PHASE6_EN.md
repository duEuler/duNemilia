# duNemilia — Phase 6 / Real Chromium MV3 extension startup

## Goal
Launch the **actual Manifest V3 extension** rather than only mocking a WebMCP method. Playwright runs the service worker and popup in Chromium and records JSON evidence. CI uses the public **v2.2** `nemilia-extension.zip`.

## Limitations
Startup smoke tests do NOT certify WebMCP tool execution, permissions, consent, security, or v2.3 compatibility. The release-candidate v2.3 archive remains local and is not published in the fork.

## Windows local command
```powershell
py -m pip install playwright==1.58.0
py -m playwright install chromium
py tests/extension_smoke.py --zip "C:\\Downloads\\nemilia-extension-v2_3_0.zip" --output "artifacts\\nemilia-23-mv3-smoke.json"
```
For genuine WebMCP E2E, use supported Chrome >=149 with a disposable profile and the correct testing flag.

## Previous environment blocker
Chromium 144 did not expose the MV3 service worker in headless mode; the headed attempt also failed to complete. This is **not proven to be a Nemilia application defect**.
