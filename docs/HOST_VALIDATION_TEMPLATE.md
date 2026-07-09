# Host Validation Template

Copy this template for each real MCP host validation.

```md
## Validation Entry

Host name:

OS:

Owlyn version/tag:

Node version:

Config used:

Command used:

Args used:

OWLYN_DB_PATH used:

All 8 tools visible:
Passed / Failed / Pending

structuredContent worked:
Passed / Failed / Pending

Full session flow passed:
Passed / Failed / Pending

Errors:

Notes:

Final result:
Passed / Failed / Pending
```

## Required Tool List

All 8 tools must be visible:

- owlyn_start
- owlyn_status
- owlyn_checkpoint
- owlyn_should_continue
- owlyn_plan_next
- owlyn_end
- owlyn_list_sessions
- owlyn_report

## Required Session Flow

The host must complete:

```txt
owlyn_start -> owlyn_checkpoint -> owlyn_should_continue -> owlyn_plan_next -> owlyn_end
```

When `owlyn_should_continue` returns `should_continue: true`, the recommendation must include:

```txt
Do not stop only because the current task is complete.
```
