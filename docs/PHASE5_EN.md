# duNemilia — Phase 5: fail-closed WebMCP policy (experimental audit)

Date: 2026-11-09. Public `main`: `db5c21dd14e4ba0ff7b24009ed90da831be7359e`.
The probe was inspected in a privately provided Nemilia 2.3.0 release-candidate extension. **No release-candidate proprietary source is committed into this public fork.**

## P5-SEC-001 — possible duplicate side effect under ambiguous argument errors
In `NEM_WEBMCP_PROBE`, non-consequential tools can be retried with an alternative argument format after a specially recognized argument parsing exception. The client has no proof that the remote tool produced no side effects before the exception.

**Controlled reproduction:** a synthetic tool incremented a disposable counter and raised `Failed to parse input arguments` on its first call. The original isolated probe executed twice on simulated Chrome 154/155/156. A private patched extension classified non-read-only tools as consequential and avoided retry, resulting in one effect.

**Scope:** this is an isolated source-level simulation, not proof of a live-site exploit or approval bypass.

## Recommendation
Treat tools as consequential whenever `readOnlyHint !== true` or `consequentialHint === true`. Avoid automatic replay of potentially mutating tools after ambiguous failures. Genuine exactly-once semantics require destination-supported idempotency keys and a deduplication protocol.

`security/webmcp-policy.js` is an **independent reference implementation**, accompanied by tests and a CLI probe validator. It is **not wired into the original 2.2 extension** and does not ship private 2.3 source.

## Windows run
```powershell
node --test tests/webmcp-policy.test.cjs
node tools/validate_webmcp_probe.cjs "C:\\Nemilia-RC\\background.js" "C:\\Nemilia-RC-Patch\\background.js"
```
Do not run live tools with real credentials during this experiment.

## Still required
Actual Chrome WebMCP capability/consent; concurrent calls, origin changes, reloads, tab discard and recovery; file capture and provider networking.
