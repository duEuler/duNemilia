# duEuler contribution changelog / Registro de alterações

## 2026-11-09 — Phase 7 / Etapa 7
- Added actual Chromium MV3 scripting and synthetic tab-isolation test.
- Checks distinct tabs, correct injection target, no cross-tab state leakage and document replacement after navigation.
- No code from privately shared RC 2.3 published. Not equivalent to consent-based WebMCP E2E.


## 2026-11-09 — Phase 6: Chromium MV3 smoke / Teste real
- Added real Playwright MV3 service worker and popup smoke tests for public extension 2.2.0.
- Fixed GitHub runner compatibility: Ubuntu 26.04 unsupported by Playwright 1.58.0; pinned Ubuntu 24.04.
- Evidence: GitHub Actions run 42704295262 passed 3/3 extension smoke checks; regression run 42704295753 passed.
- Hardened failure reporting: JSON artifact now written for browser launch or assertion failures.
- Private 2.3.0 extension has not passed real Chrome E2E; no private RC source published.


## 2026-11-09 — Phase 5 / Etapa 5
- Reproduced P5-SEC-001 in isolated private RC 2.3 probe: a synthetic ambiguous error led to two effects; a private fail-closed patch reduced effects to one in 18 scenarios.
- Added independent WebMCP policy reference, unit tests, private-source path validator, and bilingual security audit.
- No Nemilia RC 2.3 proprietary artifacts or extension code committed. Real Chrome end-to-end consent remains pending.


## 2026-11-09 — Phase 4 / Etapa 4
- Added / Adicionado: 9 automated isolated WebMCP fixture tests, including missing-hint risk classification.
- Expanded Windows/Linux CI to run all JS behavioral tests and Python/HTML integrity checks.
- Added bilingual traceable test protocols and release blockers.
- Explicit limitation: direct tool-call tests do not prove extension authorization, exactly-once retries or Chrome E2E.


## 2026-11-09 — Phase 3 / Etapa 3
- Fixed exact navigation label matching, whitespace preservation, asynchronous mutation coalescing and accessible language selector.
- Added four-tool WebMCP fixture with **missing-hint** scenario, Node behavior tests, and bilingual traceable documentation.
- Consolidated Phase 2 changes into branch based on current main. All original Nemilia 2.2 assets remain unchanged.
- Remaining: real WebMCP consent, full dynamic i18n and Chrome extension E2E.

- Fixed / Corrigido: tests/test_i18n_build.py now uses UTF-8 explicitly; Windows CP1252 runner had a reproducible UnicodeDecodeError. Root cause confirmed from CI job logs.

## 2026-11-09 — Phase 2: UI static controls + WebMCP laboratory
- Added / Adicionado: 105 English/Portuguese static UI strings; known buttons, labels, options and placeholders.
- Added / Adicionado: disposable WebMCP tools (read, consequential increment, delay), bilingual lab plans and CI contract checks.
- Prototype evidence / Evidência de protótipo: Chromium DOM 15/15 and mock WebMCP 5/5. Not full application E2E.
- Unverified / Não homologado: real browser consent, exactly-once with extension, full localization, encrypted migration.


## 2026-11-09 — Audit + bilingual navigation pilot
- Added / Adicionado: `i18n/runtime.js` EN/PT-BR navigation selector, local persistence.
- Added / Adicionado: `tools/build_i18n.py` offline, reversible HTML build.
- Added / Adicionado: `tests/test_i18n_build.py` guard tests.
- Added / Adicionado: `docs/AUDIT_PT-BR.md` and `docs/AUDIT_EN.md` risk register and lab scenarios.
- Preserved / Preservado: original 2.2 app, original extension, upstream source and license.
- Pending / Pendente: full localization, browser E2E, WebMCP policy verification.

- Added / Adicionado: `tests/test_navigation_contract.py` confirms actual v2.2 sidebar/navigation hook IDs in CI.
