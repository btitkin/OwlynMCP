# Owlyn MCP v0.1 Release Checklist

Run these commands from the repository root before publishing or handing the build to an MCP host.

```bash
npm install
npm run typecheck
npm run build
npm test
npm pack --dry-run
npm run smoke:mcp
```

The MCP smoke test runs these tools through the official MCP SDK client:

- `owlyn_start`
- `owlyn_checkpoint`
- `owlyn_should_continue`
- `owlyn_plan_next`
- `owlyn_end`

Expected result:

```json
{
  "ok": true
}
```

If `OWLYN_DB_PATH` is not set, the smoke test uses a temporary SQLite database and removes it after the run.
