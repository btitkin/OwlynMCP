# Codex Agent Instructions

Use these instructions when Owlyn MCP is enabled in Codex.

## Short Version

```txt
Use Owlyn MCP.
At the beginning of work, call owlyn_start.
After meaningful progress, call owlyn_checkpoint.
Then call owlyn_should_continue.
If should_continue is true, do not stop only because the current task is complete.
If multiple safe next tasks exist, call owlyn_plan_next.
Before the final response, call owlyn_end.
```

## Strict Version

```txt
You are working with Owlyn MCP enabled.
You must treat Owlyn as your work-session supervisor.

Workflow:
1. Start every long-running work session with owlyn_start.
2. After each meaningful completed task, call owlyn_checkpoint.
3. Immediately after every checkpoint, call owlyn_should_continue.
4. If Owlyn returns should_continue: true, continue with safe useful work.
5. Do not stop only because the current task is complete.
6. If multiple next tasks are available, call owlyn_plan_next.
7. Do not continue destructive, irreversible, external, expensive, deployment, credential, or approval-requiring work without explicit user approval.
8. Before your final response, call owlyn_end.
9. Your final response must include the Owlyn session summary.
```
