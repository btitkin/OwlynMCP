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
| Codex MCP host | Windows | STDIO, `node dist/index.js`, `OWLYN_DB_PATH` host-validation.sqlite | Passed, all 8 tools visible | Passed | Passed | Session `owl_20260707_211907_ba3ddd` completed successfully. `owlyn_should_continue` returned `should_continue: true` and included the required continuation phrase. |
| Cursor | Windows | Pending | Pending | Pending | Pending | |
| Claude Desktop | Windows | Pending | Pending | Pending | Pending | |

## Manual validation still required for other hosts

Codex MCP host validation passed on Windows. Cursor and Claude Desktop still need real-host validation. Do not treat SDK smoke tests as a replacement for real host validation in those hosts.

Use this server command in a real MCP host:

```txt
node C:\Users\btitk\Documents\OwlynMCP\dist\index.js
```

Use this test database path:

```txt
C:\Users\btitk\.owlyn\host-validation.sqlite
```

Example MCP config:

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["C:\\Users\\btitk\\Documents\\OwlynMCP\\dist\\index.js"],
      "env": {
        "OWLYN_DB_PATH": "C:\\Users\\btitk\\.owlyn\\host-validation.sqlite"
      }
    }
  }
}
```

After adding the config, restart or reload the host if required, then use this instruction:

```txt
Use Owlyn MCP. Start a work session until 06:00 Europe/Warsaw for this goal:
"Validate Owlyn MCP host integration."

After starting, create a checkpoint saying the first host validation step is complete.
Then call owlyn_should_continue with:
current_task_done: true
has_next_tasks: true
requires_user_approval: false
risk_level: low

If Owlyn says should_continue is true, confirm that the returned recommendation includes:
"Do not stop only because the current task is complete."

Then call owlyn_plan_next with 3 safe candidate tasks:
- Review README host setup docs
- Review AGENT_INSTRUCTIONS.md
- Review RELEASE_CHECKLIST.md

Then call owlyn_end with a short final summary.
```

Record whether the host listed all 8 tools, returned structuredContent, and completed the full session flow.
