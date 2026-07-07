# Host Validation Log

## 2026-07-07T21:19:33+02:00

OS:
Windows

Node version:
v22.13.0

Host tested:
Codex MCP host

Config path if used:
Current Codex MCP host session with Owlyn available over stdio. The intended validation config is `STDIO, node dist/index.js, OWLYN_DB_PATH host-validation.sqlite`.

Command used:

```txt
node dist/index.js
```

Tools visible:
All 8 Owlyn tools were visible:

- owlyn_start
- owlyn_status
- owlyn_checkpoint
- owlyn_should_continue
- owlyn_plan_next
- owlyn_end
- owlyn_list_sessions
- owlyn_report

structuredContent:
Yes. Tool responses returned structured `data`, `instruction`, and `safety`.

Session:
`owl_20260707_211907_ba3ddd`

Session flow result:
Passed.

Flow:
`owlyn_start` -> `owlyn_checkpoint` -> `owlyn_should_continue` -> `owlyn_plan_next` -> `owlyn_end`

Continuation result:
`owlyn_should_continue` returned `should_continue: true`.

Required phrase:
The `recommended_action` included `Do not stop only because the current task is complete.`

Errors:
None.

Final conclusion:
Owlyn MCP v0.1.0-alpha.1 is validated in Codex MCP host on Windows over STDIO.

## 2026-07-07T16:48:04.9070517+02:00

OS:
Microsoft Windows 11 Pro 10.0.26200, 64-bit

Node version:
v22.13.0

Host tested:
No real MCP host validation was completed in this run.

Reason host could not be tested:
The current environment is a Codex desktop session, but this running session does not expose an in-session mechanism to add or reload a new local MCP stdio server from config. Tool discovery showed active MCP tools from existing servers, but no Owlyn tools and no config-loader tool for attaching `node dist/index.js` as a new MCP server.

Config path if used:
None. No real host config was applied during this run.

Command intended for real host validation:

```txt
node C:\Users\btitk\Documents\OwlynMCP\dist\index.js
```

Suggested validation database:

```txt
C:\Users\btitk\.owlyn\host-validation.sqlite
```

Tools discovered:

- Real host: not discovered, because the host could not be reconfigured in-session.
- SDK stdio validation: all 8 tools are covered by `tests/mcp.integration.test.ts`.
- Manual smoke script: `owlyn_start`, `owlyn_checkpoint`, `owlyn_should_continue`, `owlyn_plan_next`, and `owlyn_end` passed through the official MCP SDK stdio client.

Session flow result:
Not run in a real host. The SDK stdio smoke flow passed, but this is not counted as real host validation.

Errors:
No Owlyn runtime errors were observed. The blocker is host-environment access: no available tool or UI path in this session to register a new local MCP server and reload the current host.

Final conclusion:
Real host validation is still required. Use `docs/REAL_HOST_VALIDATION.md` to test Codex, Cursor, or Claude Desktop with `node dist/index.js` and `OWLYN_DB_PATH=C:\Users\btitk\.owlyn\host-validation.sqlite`.
