# Real Host Validation

Use this matrix to track real MCP host validation. Do not mark a host as passed unless it was actually tested in that host.

Owlyn MCP is currently Codex-first. Other MCP stdio hosts are intended compatibility targets, but they are not the focus until Codex behavior is hardened.

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
| Codex MCP host | Windows | v0.1.0-alpha.1 or later | STDIO, `node dist/index.js`, persistent configured `OWLYN_DB_PATH` | Passed, all 8 tools visible after restart/reload | Passed | Passed | Passed | Basic validation passed in session `owl_20260707_211907_ba3ddd`. Extended Codex scenario matrix passed for continuation, approval, destructive, high-risk, focused, marathon, deadline, ranking, report, end, restart/reload, and persistent configured DB path behavior. Latest validation session: `owl_20260709_172519_69cd94`. Clean temporary DB path validation remains optional/pending unless separately tested. |
| Cursor | Windows | Future target | Pending validation | Pending | Pending | Pending | Pending | Future compatibility target. Use [CURSOR_VALIDATION.md](./CURSOR_VALIDATION.md) when this becomes a priority. |
| Claude Desktop | Windows | Future target | Pending validation | Pending | Pending | Pending | Pending | Future compatibility target. Use [CLAUDE_DESKTOP_VALIDATION.md](./CLAUDE_DESKTOP_VALIDATION.md) when this becomes a priority. |
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
