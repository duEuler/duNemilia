# duEuler contribution changelog / Registro de alterações

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
