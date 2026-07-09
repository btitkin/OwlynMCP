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
- test after Codex restart/reload
- test with persistent `OWLYN_DB_PATH`
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
| K. Restart/reload behavior | Pending | n/a | Pending manual restart/reload validation. The running Codex MCP host was not restarted. |
| L. Persistent vs clean `OWLYN_DB_PATH` | Pending | n/a | Pending manual database-path validation. The active host config was not changed. |

Errors:
None during the executed scenarios.

Final conclusion:
Extended Codex MCP host validation passed for tool visibility, session start/checkpoint/continue flow, approval gate, destructive gate, high-risk gate, focused mode, marathon mode, deadline reached behavior, task ranking, report, and end. Restart/reload behavior and persistent-vs-clean database-path behavior remain pending manual validation.
