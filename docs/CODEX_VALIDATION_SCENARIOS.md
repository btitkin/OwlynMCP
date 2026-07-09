# Codex Validation Scenarios

Use these scenarios to harden Owlyn MCP behavior in Codex. Do not mark a scenario as passed unless it was actually run in Codex.

## Scenario A: Basic Session Flow

Goal:
Confirm the core lifecycle works.

Tool calls:

- owlyn_start
- owlyn_checkpoint
- owlyn_should_continue
- owlyn_end

Expected result:
The session starts, checkpoint persists, continuation decision returns structured data, and the session ends cleanly.

Pass/fail:
- [ ] Passed
- [ ] Failed

## Scenario B: Continue After First Task

Goal:
Confirm Codex does not stop after the first completed task when Owlyn says to continue.

Tool calls:

- owlyn_start with deadline `06:00`
- owlyn_checkpoint after first task
- owlyn_should_continue with `current_task_done: true`, `has_next_tasks: true`, `risk_level: low`

Expected result:
`should_continue` is true and the recommendation includes `Do not stop only because the current task is complete.`

Pass/fail:
- [ ] Passed
- [ ] Failed

## Scenario C: Multiple Next Tasks

Goal:
Confirm task ranking selects a high-impact low-risk task.

Tool calls:

- owlyn_checkpoint with several next tasks
- owlyn_plan_next with low-risk and higher-risk candidates

Expected result:
The high-impact low-risk task ranks first.

Pass/fail:
- [ ] Passed
- [ ] Failed

## Scenario D: Approval Gate

Goal:
Confirm approval-requiring work stops continuation.

Tool calls:

- owlyn_should_continue with `requires_user_approval: true`

Expected result:
`should_continue` is false and the reason clearly says user approval is required.

Pass/fail:
- [ ] Passed
- [ ] Failed

## Scenario E: Destructive Action Gate

Goal:
Confirm destructive pending work stops continuation.

Tool calls:

- owlyn_should_continue with `destructive_action_pending: true`

Expected result:
`should_continue` is false and the reason clearly says a destructive action is pending.

Pass/fail:
- [ ] Passed
- [ ] Failed

## Scenario F: Deadline Reached

Goal:
Confirm Owlyn stops after the deadline.

Tool calls:

- owlyn_start with a deadline already in the past, or simulate with test utilities if available
- owlyn_should_continue

Expected result:
`should_continue` is false and the reason clearly says the deadline has been reached.

Pass/fail:
- [ ] Passed
- [ ] Failed

## Scenario G: Focused Mode

Goal:
Confirm focused mode stops after the current task is complete.

Tool calls:

- owlyn_start with `mode: focused`
- owlyn_should_continue with `current_task_done: true`

Expected result:
`should_continue` is false and focused mode completion is the stop reason.

Pass/fail:
- [ ] Passed
- [ ] Failed

## Scenario H: Marathon Mode

Goal:
Confirm marathon mode recommends careful validation-heavy continuation.

Tool calls:

- owlyn_start with `mode: marathon`
- owlyn_checkpoint
- owlyn_should_continue with low or medium risk

Expected result:
Owlyn allows careful continuation and recommends checkpointing and validation-heavy work.

Pass/fail:
- [ ] Passed
- [ ] Failed

## Scenario I: Session Report

Goal:
Confirm reports are useful after multiple checkpoints.

Tool calls:

- owlyn_start
- multiple owlyn_checkpoint calls
- owlyn_report
- owlyn_end

Expected result:
The report includes useful session metadata, timeline, completed tasks, latest next tasks, blockers, and decision summary.

Pass/fail:
- [ ] Passed
- [ ] Failed
