# Example Session

User:

```txt
Work on this repo until 06:00. If you finish early, continue with safe useful improvements.
```

## 1. Start Session

```json
{
  "tool": "owlyn_start",
  "input": {
    "goal": "Improve this repo safely until 06:00.",
    "deadline": "06:00",
    "timezone": "Europe/Warsaw",
    "mode": "night_shift"
  }
}
```

Owlyn returns a session id, deadline, elapsed time, remaining time, and the instruction to checkpoint and ask whether to continue after meaningful progress.

## 2. Agent Completes First Task

The agent implements the first requested fix and validates it.

## 3. Save Checkpoint

```json
{
  "tool": "owlyn_checkpoint",
  "input": {
    "summary": "Implemented deadline parsing and added tests.",
    "completed_tasks": [
      "Added HH:mm deadline parsing",
      "Added ISO deadline parsing",
      "Added timezone tests"
    ],
    "next_tasks": [
      "Add policy engine tests",
      "Document MCP host setup",
      "Run release checks"
    ],
    "blockers": [],
    "files_changed": [
      "src/time.ts",
      "tests/time.test.ts"
    ],
    "validation_results": [
      "npm test passed"
    ],
    "confidence": "high",
    "risk_level": "low"
  }
}
```

## 4. Ask Whether To Continue

```json
{
  "tool": "owlyn_should_continue",
  "input": {
    "current_task_done": true,
    "has_next_tasks": true,
    "requires_user_approval": false,
    "risk_level": "low",
    "destructive_action_pending": false,
    "validation_passed": true
  }
}
```

Expected decision:

```json
{
  "should_continue": true,
  "recommended_action": "Continue with the next highest-value low-risk task. Do not stop only because the current task is complete."
}
```

## 5. Plan Next Task

```json
{
  "tool": "owlyn_plan_next",
  "input": {
    "candidate_tasks": [
      {
        "title": "Add policy engine tests",
        "impact": "high",
        "risk": "low",
        "estimated_minutes": 20,
        "category": "tests"
      },
      {
        "title": "Deploy a package",
        "impact": "high",
        "risk": "medium",
        "estimated_minutes": 30,
        "category": "deploy"
      }
    ]
  }
}
```

Owlyn ranks the safe test task above deployment work.

## 6. Second Checkpoint

```json
{
  "tool": "owlyn_checkpoint",
  "input": {
    "summary": "Added policy engine tests and verified continuation behavior.",
    "completed_tasks": [
      "Added night_shift continuation test",
      "Added focused mode stop test",
      "Added approval-required stop test"
    ],
    "next_tasks": [
      "Document host setup",
      "Run release checklist"
    ],
    "validation_results": [
      "npm test passed"
    ],
    "confidence": "high",
    "risk_level": "low"
  }
}
```

## 7. End Session

```json
{
  "tool": "owlyn_end",
  "input": {
    "final_summary": "Completed deadline parsing and policy tests, then documented remaining setup work.",
    "remaining_tasks": [
      "Validate with more real MCP hosts"
    ],
    "validation_results": [
      "npm run typecheck passed",
      "npm run build passed",
      "npm test passed"
    ],
    "status": "completed"
  }
}
```

## 8. Final Report

Owlyn returns a structured report with total elapsed time, checkpoint count, aggregated completed tasks, remaining tasks, and final recommendation.
