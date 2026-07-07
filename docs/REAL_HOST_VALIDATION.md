# Real Host Validation

Use this checklist to validate Owlyn MCP in real MCP hosts.

## A. Generic Validation Goal

Confirm that a real MCP host can:

- start Owlyn MCP over stdio
- list all 8 tools
- call owlyn_start
- call owlyn_checkpoint
- call owlyn_should_continue
- receive structuredContent
- continue work when should_continue is true
- stop when should_continue is false

## B. Test Scenario

Use this user instruction:

```txt
Use Owlyn MCP. Work on this repository until 06:00. If you finish the first task early, checkpoint progress, ask Owlyn whether to continue, and continue only with safe low-risk improvements.
```

## C. Expected Behavior

The agent should:

- call owlyn_start at the beginning
- call owlyn_checkpoint after meaningful progress
- call owlyn_should_continue after checkpointing
- not stop only because the first task is complete when should_continue is true
- call owlyn_plan_next if multiple safe next tasks exist
- call owlyn_end before final response

## D. Host Result Table

| Host | OS | Config tested | Tools listed | structuredContent | Session flow passed | Notes |
| ---- | -- | ------------- | ------------ | ----------------- | ------------------ | ----- |
| Codex | Windows | Pending | Pending | Pending | Pending | |
| Cursor | Windows | Pending | Pending | Pending | Pending | |
| Claude Desktop | Windows | Pending | Pending | Pending | Pending | |
