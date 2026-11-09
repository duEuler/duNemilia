# duNemilia — Phase 3: localization hardening and WebMCP policy matrix
Date: 2026-11-09. Started from main SHA 4e6dac7. Includes phase 2 changes again because PR #2 was merged into the PR #1 feature branch, **not directly into main**.

## Changes and rationale
- NEM-006: navigation labels previously used `startsWith`, risking partial translation of longer labels; now exact comparison.
- NEM-007: mutation observer rendered on each event; now batches work in a microtask.
- NEM-008: language picker uses semantic `label htmlFor` + matching select ID.
- NEM-009: preserve external whitespace in known string translation and support EN↔PT-BR.
- NEM-010: added a WebMCP tool with deliberately **missing annotations**, affecting only disposable in-memory state.

## Evidence and boundaries
- GitHub CI: Python, JS syntax, offline HTML build, navigation contract and Node behavior tests; see PR #3 runs.
- Real extension consent in supported Chrome, migration 2.2→2.3 and network privacy not certified.
- No proprietary RC 2.3 or original extension modified.

## Laboratory plan
1. Serve fixture over localhost HTTP in a disposable WebMCP-enabled Chrome profile.
2. Discover four tools: read, consequential increment, delayed, unannotated.
3. Deny consequential action (zero changes), then allow once (exactly one change).
4. Missing-hint tool should require explicit consent or be blocked, not silently execute.
5. Reload/navigate/suspend during a call; ensure it cannot execute on a different target.
6. Save sanitized build, browser, arguments, approval, state and logs.

## Suggestions
Prefer source-level keyed i18n once the complete source tree is available. Add Playwright MV3 extension E2E, consent policy tests, idempotent action identifiers, and baseline benchmarks against LibreChat, Open WebUI, Langflow/Flowise, n8n and local model servers, checking licenses before reuse.
