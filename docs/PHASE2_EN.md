# duNemilia — Phase 2: localization and WebMCP lab
Date: 2026-11-09. Public baseline: Nemilia 2.2, changes isolated from `main`.

## Implementation
- `i18n/runtime.js`: 105 known static controls translated between EN/PT-BR (buttons, labels, options, placeholders), plus navigation, local persistence.
- `labs/webmcp-fixture.html`: disposable `lab_read`, consequential `lab_increment` and `lab_delayed` tools.
- `tests/test_i18n_security_contract.py`: contract assertions for catalog, scope and no-network fixture.
- The 2.2 app and extension remain unchanged. No 2.3 release-candidate source was published.

## Evidence
- Local Chromium 144 language prototype using DOM extracted from 2.3 RC: 15/15 checks passed. **Not full app E2E and not proof of byte-identical deployed runtime.**
- Mock `document.modelContext` lab: 5/5 checks passed. **Not real WebMCP consent validation.**
- The environment blocked full `file://` app loading (ERR_BLOCKED_BY_ADMINISTRATOR), without proving a Nemilia failure.
- GitHub Actions provides syntax, offline build and integrity results on Windows/Linux.

## Manual experiments
1. Use a disposable Chrome profile with synthetic data.
2. Serve the fixture on localhost HTTP and enable WebMCP in a supported Chrome.
3. Discover all three tools; `lab_read` must not change state.
4. Deny `lab_increment` (zero change); approve amount=1 (exactly one increment).
5. During `lab_delayed` ms=5000, reload, navigate and switch tabs; reject wrong-context executions.
6. Repeat on Chrome >=155 and tools with missing hints; mutating tools should fail closed.
7. Log build, Chrome/OS, arguments, decisions, state changes and redacted screenshots.

## Open items
**Not a complete translation.** Dynamic errors and notifications need stable i18n keys at their rendering sites. Never rewrite user content, prompts or AI output. Real WebMCP E2E and migration 2.2→2.3 remain unverified.

## Future research
Versioned key-based catalogs, visual regression, accessibility, origin-isolation and idempotency tests. Review Flowise/Langflow (graphs), n8n (automation), Open WebUI/LibreChat (providers), Browser Use (browser automation) and their licenses. No comparative benchmark was performed.