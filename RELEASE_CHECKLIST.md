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

## Create alpha tag

Commands:

```bash
git status
npm run check
npm pack --dry-run
git tag v0.1.0-alpha.1
git push origin v0.1.0-alpha.1
```

Then create a GitHub Release from tag:

```txt
v0.1.0-alpha.1
```

Use `docs/RELEASE_NOTES_v0.1.0-alpha.1.md` as the release notes.

Do not create or push the tag until the release owner explicitly approves it.

## Codex validation checklist

Before future releases, verify:

- Codex sees all 8 Owlyn tools
- owlyn_start works
- owlyn_checkpoint works
- owlyn_should_continue works
- owlyn_plan_next works
- owlyn_end works
- structuredContent works
- continuation phrase appears
- approval gate stops continuation
- destructive gate stops continuation
- focused mode stops after current task
- night_shift mode continues before deadline
- report/end output is useful
