# Real Host Validation

Use this matrix to track real MCP host validation. Do not mark a host as passed unless it was actually tested in that host.

## Validation Goal

Confirm that a real MCP host can:

- start Owlyn MCP over stdio
- list all 8 tools
- call owlyn_start
- call owlyn_checkpoint
- call owlyn_should_continue
- receive structuredContent
- continue work when should_continue is true
- stop when should_continue is false
- call owlyn_plan_next
- call owlyn_end

## Validation Matrix

| Host | OS | Version | Config | Tools visible | structuredContent | Session flow | Status | Notes |
| ---- | -- | ------- | ------ | ------------- | ----------------- | ------------ | ------ | ----- |
| Codex MCP host | Windows | v0.1.0-alpha.1 or later | STDIO, `node dist/index.js`, `OWLYN_DB_PATH` host-validation.sqlite | Passed, all 8 tools visible | Passed | Passed | Passed | Session `owl_20260707_211907_ba3ddd` completed successfully. `owlyn_should_continue` returned `should_continue: true` and included the required continuation phrase. |
| Cursor | Windows | Pending | Pending validation | Pending | Pending | Pending | Pending | Use [CURSOR_VALIDATION.md](./CURSOR_VALIDATION.md). |
| Claude Desktop | Windows | Pending | Pending validation | Pending | Pending | Pending | Pending | Use [CLAUDE_DESKTOP_VALIDATION.md](./CLAUDE_DESKTOP_VALIDATION.md). |
| Generic stdio MCP client | Pending | Pending | Pending validation | Pending | Pending | Pending | Pending | SDK stdio tests pass, but a separate real generic host has not been recorded. |

## Expected Behavior

The host should:

- call owlyn_start at the beginning
- call owlyn_checkpoint after meaningful progress
- call owlyn_should_continue after checkpointing
- not stop only because the first task is complete when should_continue is true
- call owlyn_plan_next if multiple safe next tasks exist
- call owlyn_end before final response

Required continuation phrase:

```txt
Do not stop only because the current task is complete.
```

## Shared Prompt

Use [VALIDATION_PROMPT.md](./VALIDATION_PROMPT.md) for each host.

## Template

Use [HOST_VALIDATION_TEMPLATE.md](./HOST_VALIDATION_TEMPLATE.md) to record a new validation result.
