# Tools

All tools return structured MCP content with:

- `data`
- `instruction`
- optional `safety`

## owlyn_start

Purpose: Start a work session with a goal and deadline.

Inputs:

- `goal`: string
- `deadline`: ISO datetime or `HH:mm`
- `timezone`: optional, defaults to `Europe/Warsaw`
- `mode`: optional, `focused`, `night_shift`, or `marathon`
- `max_work_minutes`: optional
- `notes`: optional
- `force_new`: optional

Outputs:

- `session_id`
- `goal`
- `mode`
- `timezone`
- `started_at`
- `deadline_at`
- `elapsed_minutes`
- `remaining_minutes`
- `status`
- `initial_instruction`

Example:

```json
{
  "goal": "Improve the repo safely until morning.",
  "deadline": "06:00",
  "mode": "night_shift"
}
```

## owlyn_status

Purpose: Return current session status.

Inputs:

- `session_id`: optional

Outputs:

- session metadata
- current time
- elapsed and remaining minutes
- deadline status
- checkpoint count
- latest checkpoint summary, next tasks, and blockers

Example:

```json
{
  "session_id": "owl_..."
}
```

## owlyn_checkpoint

Purpose: Save meaningful progress.

Inputs:

- `session_id`: optional
- `summary`: string
- `completed_tasks`: string[]
- `next_tasks`: string[]
- `blockers`: optional string[]
- `files_changed`: optional string[]
- `validation_results`: optional string[]
- `confidence`: `low`, `medium`, or `high`
- `risk_level`: optional `low`, `medium`, or `high`

Outputs:

- checkpoint metadata
- completed tasks
- next tasks
- blockers
- files changed
- validation results
- confidence and risk
- status after checkpoint

Example:

```json
{
  "summary": "Added policy tests.",
  "completed_tasks": ["Added night_shift continuation test"],
  "next_tasks": ["Document host setup"],
  "validation_results": ["npm test passed"],
  "confidence": "high",
  "risk_level": "low"
}
```

## owlyn_should_continue

Purpose: Decide whether the agent should continue working.

Inputs:

- `session_id`: optional
- `current_task_done`: boolean
- `has_next_tasks`: boolean
- `requires_user_approval`: optional boolean
- `risk_level`: `low`, `medium`, or `high`
- `destructive_action_pending`: optional boolean
- `validation_passed`: optional boolean
- `notes`: optional

Outputs:

- `should_continue`
- reason
- recommended action
- next policy
- safety notes
- elapsed and remaining minutes
- deadline status

Example:

```json
{
  "current_task_done": true,
  "has_next_tasks": true,
  "requires_user_approval": false,
  "risk_level": "low",
  "destructive_action_pending": false,
  "validation_passed": true
}
```

## owlyn_plan_next

Purpose: Rank candidate next tasks by impact, risk, approval requirement, time fit, and category.

Inputs:

- `session_id`: optional
- `candidate_tasks`: array of tasks

Each candidate task:

- `title`
- `description`: optional
- `impact`: `low`, `medium`, or `high`
- `risk`: `low`, `medium`, or `high`
- `estimated_minutes`: optional
- `requires_user_approval`: optional
- `category`: optional

Outputs:

- recommended task
- ranked tasks
- rejected tasks with reasons
- planning notes

Example:

```json
{
  "candidate_tasks": [
    {
      "title": "Add integration tests",
      "impact": "high",
      "risk": "low",
      "estimated_minutes": 20,
      "category": "tests"
    }
  ]
}
```

## owlyn_end

Purpose: End a session and return a final report.

Inputs:

- `session_id`: optional
- `final_summary`: string
- `remaining_tasks`: optional string[]
- `validation_results`: optional string[]
- `status`: optional `completed` or `abandoned`

Outputs:

- session metadata
- total elapsed minutes
- checkpoint count
- final summary
- aggregated completed tasks
- remaining tasks
- validation results
- final recommendation

Example:

```json
{
  "final_summary": "Completed release hardening.",
  "remaining_tasks": ["Validate in more hosts"],
  "validation_results": ["npm test passed"],
  "status": "completed"
}
```

## owlyn_list_sessions

Purpose: List previous sessions.

Inputs:

- `status`: optional `active`, `completed`, `abandoned`, or `all`
- `limit`: optional number

Outputs:

- sessions with goal, mode, status, timestamps, and checkpoint count

Example:

```json
{
  "status": "all",
  "limit": 20
}
```

## owlyn_report

Purpose: Return a detailed report without ending the session.

Inputs:

- `session_id`: optional

Outputs:

- session metadata
- elapsed and remaining minutes
- checkpoint count
- timeline
- aggregated completed tasks
- latest next tasks
- latest blockers
- decision summary

Example:

```json
{
  "session_id": "owl_..."
}
```
