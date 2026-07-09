# Codex Validation Scenarios

Use these scenarios to harden Owlyn MCP behavior in Codex. Do not mark a scenario as passed unless it was actually run in Codex.

Last extended validation run:
2026-07-09 13:18-13:19 Europe/Warsaw, Codex MCP host on Windows, post `v0.1.0-alpha.2` and pre `v0.1.0-alpha.3`.

## Scenario A: Tool Visibility and Status

Goal:
Confirm Codex can see the full Owlyn tool surface and inspect sessions.

Tool calls:

- visible tool list inspection
- owlyn_list_sessions
- owlyn_status if an active session exists

Expected result:
All 8 tools are visible. Session listing works. If no active session exists, record that honestly instead of forcing a status call.

Result:
- [x] Passed
- [ ] Failed
- [ ] Pending

Notes:
All 8 tools were visible. `owlyn_list_sessions` worked. No active session existed at the start of the run, so `owlyn_status` was not called for Scenario A.

## Scenario B: Continue After First Task

Goal:
Confirm Codex does not stop after the first completed task when Owlyn says to continue.

Tool calls:

- owlyn_start with deadline `06:00`, timezone `Europe/Warsaw`, mode `night_shift`, `force_new: true`
- owlyn_checkpoint after first task
- owlyn_should_continue with `current_task_done: true`, `has_next_tasks: true`, `risk_level: low`

Expected result:
`should_continue` is true and the recommendation includes `Do not stop only because the current task is complete.`

Result:
- [x] Passed
- [ ] Failed
- [ ] Pending

Notes:
Session `owl_20260709_131803_461a61`. `should_continue: true`. Required phrase appeared.

## Scenario C: Approval Gate

Goal:
Confirm approval-requiring work stops continuation.

Tool calls:

- owlyn_should_continue with `requires_user_approval: true`

Expected result:
`should_continue` is false and the reason clearly says user approval is required.

Result:
- [x] Passed
- [ ] Failed
- [ ] Pending

Notes:
Owlyn returned `should_continue: false` with reason `Stop because user approval is required.`

## Scenario D: Destructive Action Gate

Goal:
Confirm destructive pending work stops continuation.

Tool calls:

- owlyn_should_continue with `destructive_action_pending: true`

Expected result:
`should_continue` is false and the reason clearly says a destructive action is pending.

Result:
- [x] Passed
- [ ] Failed
- [ ] Pending

Notes:
Owlyn returned `should_continue: false` with reason `Stop because a destructive action is pending.`

## Scenario E: High-Risk Gate

Goal:
Confirm high-risk work stops continuation.

Tool calls:

- owlyn_should_continue with `risk_level: high`

Expected result:
`should_continue` is false unless the policy explicitly restricts continuation to lower-risk safe work. Reason or safety notes should mention high risk.

Result:
- [x] Passed
- [ ] Failed
- [ ] Pending

Notes:
Owlyn returned `should_continue: false` with reason `Stop because risk level is high.`

## Scenario F: Focused Mode Stops After Task Done

Goal:
Confirm focused mode stops after the current task is complete.

Tool calls:

- owlyn_start with `mode: focused`
- owlyn_checkpoint
- owlyn_should_continue with `current_task_done: true`

Expected result:
`should_continue` is false and focused mode completion is the stop reason.

Result:
- [x] Passed
- [ ] Failed
- [ ] Pending

Notes:
Session `owl_20260709_131820_5d592b`. Owlyn returned `should_continue: false` with reason `Stop because focused mode ends after the current task is complete.`

## Scenario G: Marathon Mode Behavior

Goal:
Confirm marathon mode permits only careful safe continuation and recommends checkpointing or validation-heavy work.

Tool calls:

- owlyn_start with `mode: marathon`
- owlyn_checkpoint
- owlyn_should_continue with `risk_level: medium`, `validation_passed: true`

Expected result:
Owlyn allows continuation only if policy permits medium-risk marathon continuation. Recommendation or policy should mention checkpointing, validation, caution, or safe continuation.

Result:
- [x] Passed
- [ ] Failed
- [ ] Pending

Notes:
Session `owl_20260709_131843_389cf6`. Owlyn returned `should_continue: true`; reason said marathon mode allows careful low- or medium-risk work. Policy recommended frequent checkpointing and validation/cleanup near the deadline.

## Scenario H: Deadline Reached

Goal:
Confirm Owlyn stops after the deadline.

Tool calls:

- owlyn_start with deadline `2000-01-01T00:00:00+01:00`
- owlyn_should_continue

Expected result:
`should_continue` is false and the reason clearly says the deadline has been reached.

Result:
- [x] Passed
- [ ] Failed
- [ ] Pending

Notes:
Session `owl_20260709_131857_ea72b6`. Owlyn returned `deadline_reached: true` and `should_continue: false`.

## Scenario I: Plan Next Task Ranking

Goal:
Confirm task ranking recommends useful low-risk work and rejects or deprioritizes high-risk approval-required work.

Tool calls:

- owlyn_start
- owlyn_plan_next with low-risk and high-risk candidate tasks

Expected result:
A low-risk useful task should be recommended. High-risk or approval-required tasks should be rejected or deprioritized with reasons.

Result:
- [x] Passed
- [ ] Failed
- [ ] Pending

Notes:
Session `owl_20260709_131909_043150`. Recommended task was `Validate release checklist commands`. Approval-required tasks were rejected.

## Scenario J: Report and End

Goal:
Confirm report and end return structured session information and complete the active session.

Tool calls:

- owlyn_report
- owlyn_end

Expected result:
The report is useful, end returns a final session report, and the session is marked completed.

Result:
- [x] Passed
- [ ] Failed
- [ ] Pending

Notes:
`owlyn_report` and `owlyn_end` returned structured data for session `owl_20260709_131909_043150`. The report was structurally useful but sparse because the latest active session had no checkpoints.

## Scenario K: Restart/Reload Behavior

Goal:
Confirm Owlyn remains usable after Codex MCP host restart or reload.

Expected result:
After restart/reload, Codex still sees all 8 tools and can continue or inspect persisted sessions.

Result:
- [ ] Passed
- [ ] Failed
- [x] Pending

Notes:
Pending manual restart/reload validation. The running Codex session was not restarted during this validation.

## Scenario L: Persistent vs Clean OWLYN_DB_PATH

Goal:
Confirm behavior with both persistent and clean validation database paths.

Expected result:
Owlyn works with the configured persistent database and with a clean temporary database path.

Result:
- [ ] Passed
- [ ] Failed
- [x] Pending

Notes:
Pending manual database-path validation. The active host configuration was not changed during this validation.
