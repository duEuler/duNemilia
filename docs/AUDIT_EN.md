# duNemilia — Initial audit, risk register and test plan

Date: 2026-11-09. Public baseline: `cd3218ca1b0f14b5e997636e3d94a7d56c4fa963` (Nemilia 2.2). Luis's Drive release candidate 2.3 is **not in upstream public main**. Do not combine 2.3.0 extension and 2.2 application without compatibility testing.

## Traceable findings
| ID | Evidence | Action |
|---|---|---|
| NEM-001 | Fork and upstream initially shared the same commit | Isolated feature branch; preserve main |
| NEM-002 | WebMCP consequential hint classification needs integration tests | Mock read-only, mutating and missing-hint tools |
| NEM-003 | UI predominantly English | EN/PT-BR **navigation-only** opt-in pilot |
| NEM-004 | Single-file file:// and CSP constraints | Inline, CDN-free, reversible build |
| NEM-005 | JS syntax alone does not establish correct behavior | Browser E2E before release |

## How to test
```powershell
python -m unittest discover -s tests -v
node --check i18n/runtime.js
python tools/build_i18n.py --input Nemilia-v2_2.html --output dist/Nemilia-v2_2-i18n-pilot.html
```
The input file remains unchanged. **Not a full translation:** dialogs, errors, prompts, agent output and user data are unaffected. Validate menu IDs on v2.2 and confirm selector in Chrome.

## Lab scenarios
1. Chrome Windows 149/154/155+, WebMCP tools with read-only, consequential and missing hints; single approval/denial.
2. Exactly-once execution; tab navigation, reload, suspension, timeout, abort.
3. Profile migration 2.2→2.3, passwords, recovery, encrypted backups.
4. Image/local-file captures, concurrent requests and streaming cancellation.
5. Language persistence, screen reader, preservation of user-owned content.
6. Benchmark large document indexing using synthetic data.

## Comparative research backlog (not tested here)
Open WebUI: local models; LibreChat: multi-provider chat; Flowise/Langflow: workflows; n8n: automation/logs; Browser Use: browser agents. Review licenses before reusing implementations.

## Status
**Built:** partial i18n and offline generator. **Not verified:** full Chrome WebMCP, security certification, complete translation or live provider integration.
