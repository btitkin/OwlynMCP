# Owlyn MCP v0.1.0-alpha.1

Owlyn MCP is a local-first MCP work-session supervisor for AI agents.

Tagline:
Time-aware work sessions for AI agents.

Problem:
AI agents often stop too early. You ask an agent to work through a longer session, it completes the first task, then says "done."

Owlyn gives agents:

- persistent work-session clock
- deadlines
- checkpoints
- continuation decisions
- task ranking
- session reports

Included in this alpha:

- local stdio MCP server
- SQLite persistence
- Zod input validation
- timezone-aware deadline handling
- owlyn_start
- owlyn_status
- owlyn_checkpoint
- owlyn_should_continue
- owlyn_plan_next
- owlyn_end
- owlyn_list_sessions
- owlyn_report
- SDK MCP integration test
- manual MCP smoke script
- README, host setup docs, tool docs, agent instructions, release checklist

Validation:

- npm run typecheck passed
- npm run build passed
- npm test passed
- npm run smoke:mcp passed
- npm run check passed
- npm pack --dry-run passed
- Real-host validation passed in Codex MCP host on Windows.
- All 8 tools were visible.
- structuredContent worked.
- Full session flow passed:
  owlyn_start -> owlyn_checkpoint -> owlyn_should_continue -> owlyn_plan_next -> owlyn_end

Known limitations:

- Tested through the official MCP SDK stdio path.
- Other hosts still need validation.
- Owlyn does not keep an MCP host alive by itself.
- The host agent must call Owlyn tools and follow the returned policy.
- No cloud, no telemetry, no auth, no background worker in v0.1.
