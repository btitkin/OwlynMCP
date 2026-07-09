# Codex Validation Log

## Current Known Validation

Host:
Codex MCP host

OS:
Windows

Status:
Passed basic real-host validation

Validated:

- all 8 tools visible
- structuredContent worked
- owlyn_start worked
- owlyn_checkpoint worked
- owlyn_should_continue worked
- owlyn_plan_next worked
- owlyn_end worked
- required continuation phrase appeared

Session:
`owl_20260707_211907_ba3ddd`

Known remaining Codex validation work:

- run extended scenario matrix
- test approval gate
- test destructive gate
- test focused mode
- test marathon mode
- test stale/active session behavior
- test after Codex restart/reload - passed 2026-07-09
- test with persistent `OWLYN_DB_PATH` - passed 2026-07-09
- test with clean temporary `OWLYN_DB_PATH`

## Extended Validation: 2026-07-09 13:18-13:19 Europe/Warsaw

Host:
Codex MCP host

OS:
Windows

Owlyn version/context:
post `v0.1.0-alpha.2`, pre `v0.1.0-alpha.3`

Current commit:
`03ac21c` or newer documentation-only state

Tool visibility:
Passed. All 8 Owlyn tools were visible in the current Codex MCP host:

- owlyn_start
- owlyn_status
- owlyn_checkpoint
- owlyn_should_continue
- owlyn_plan_next
- owlyn_end
- owlyn_list_sessions
- owlyn_report

Structured data:
Passed. Real tool calls returned structured data objects with session state, continuation decisions, reports, and safety/instruction fields.

Scenario results:

| Scenario | Result | Session IDs | Notes |
| -------- | ------ | ----------- | ----- |
| A. Tool visibility and status | Passed | n/a | All 8 tools visible. `owlyn_list_sessions` worked. No active session existed at the start, so `owlyn_status` was not called. |
| B. Continue after first task | Passed | `owl_20260709_131803_461a61` | `should_continue: true`; `recommended_action` included `Do not stop only because the current task is complete.` |
| C. Approval gate | Passed | `owl_20260709_131803_461a61` | `should_continue: false`; reason: `Stop because user approval is required.` |
| D. Destructive action gate | Passed | `owl_20260709_131803_461a61` | `should_continue: false`; reason: `Stop because a destructive action is pending.` |
| E. High-risk gate | Passed | `owl_20260709_131803_461a61` | `should_continue: false`; reason: `Stop because risk level is high.` |
| F. Focused mode stops after task done | Passed | `owl_20260709_131820_5d592b` | `should_continue: false`; reason: `Stop because focused mode ends after the current task is complete.` |
| G. Marathon mode behavior | Passed | `owl_20260709_131843_389cf6` | `should_continue: true`; policy recommended careful low- or medium-risk work, frequent checkpointing, and validation/cleanup. |
| H. Deadline reached | Passed | `owl_20260709_131857_ea72b6` | Past ISO deadline produced `deadline_reached: true` and `should_continue: false`. |
| I. Plan next task ranking | Passed | `owl_20260709_131909_043150` | Recommended `Validate release checklist commands`; rejected approval-required high-risk tasks. |
| J. Report and end | Passed with caveat | `owl_20260709_131909_043150` | `owlyn_report` and `owlyn_end` returned structured data. Report was sparse because the latest active session had no checkpoints. |
| K. Restart/reload behavior | Passed | `owl_20260709_172519_69cd94` | After Codex restart/reload, all 8 Owlyn tools were visible, `owlyn_list_sessions` worked, and a new validation session was started, checkpointed, evaluated with `owlyn_should_continue`, and ended. |
| L. Persistent vs clean `OWLYN_DB_PATH` | Passed for persistent configured DB path | `owl_20260709_172519_69cd94` | Previous Owlyn sessions remained visible after restart/reload. `owlyn_list_sessions` returned 7 sessions, including the latest validation session. Clean temporary DB path validation remains optional/pending unless separately tested. |

Errors:
None during the executed scenarios.

Final conclusion:
Extended Codex MCP host validation passed for tool visibility, session start/checkpoint/continue flow, approval gate, destructive gate, high-risk gate, focused mode, marathon mode, deadline reached behavior, task ranking, report, end, restart/reload behavior, and persistent configured `OWLYN_DB_PATH` behavior. Clean temporary database-path validation remains optional/pending unless separately tested.

## Final Codex Restart and Persistence Validation: 2026-07-09 17:25 Europe/Warsaw

Host:
Codex MCP host

OS:
Windows

Result:
Passed

Validated:

- all 8 Owlyn tools remained visible after Codex restart/reload
- `owlyn_list_sessions` returned persisted prior sessions
- latest validation session `owl_20260709_172519_69cd94` was present after restart/reload
- configured persistent `OWLYN_DB_PATH` behavior passed

Observed session count:
7 sessions were visible during persistence validation.

Scenario results:

| Scenario | Result | Notes |
| -------- | ------ | ----- |
| K. Restart/reload behavior | Passed | Owlyn MCP remained available after Codex restart/reload. |
| L. Persistent vs clean `OWLYN_DB_PATH` | Passed for persistent configured DB path | Sessions persisted after restart/reload. Clean temporary DB path validation remains optional/pending unless separately tested. |
