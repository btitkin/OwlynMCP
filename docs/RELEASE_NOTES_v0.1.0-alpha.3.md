# Owlyn MCP v0.1.0-alpha.3

Owlyn MCP - Time-aware work sessions for AI agents.

This alpha focuses on Codex-first validation and hardening.

## Highlights

- Extended Codex MCP host validation completed on Windows.
- All 8 Owlyn MCP tools remained visible and callable in Codex.
- structuredContent worked in real Codex MCP host usage.
- Core continuation behavior passed:
  - `owlyn_should_continue` returned `should_continue: true`
  - recommendation included:
    "Do not stop only because the current task is complete."
- Safety gates passed:
  - approval gate
  - destructive action gate
  - high-risk gate
- Mode behavior passed:
  - focused mode stops after current task
  - night_shift continues before deadline
  - marathon mode provides careful continuation guidance
- Deadline-reached behavior passed.
- Task ranking behavior passed.
- Report/end flow passed.
- Codex restart/reload behavior passed.
- Persistent `OWLYN_DB_PATH` behavior passed.

## Validation

Validated in:

- Codex MCP host on Windows

Extended scenarios passed:

- Tool visibility/status
- Continue after first task
- Approval gate
- Destructive action gate
- High-risk gate
- Focused mode
- Marathon mode
- Deadline reached
- Plan next ranking
- Report/end
- Restart/reload behavior
- Persistent configured database path

## Runtime changes

None.

This release does not change Owlyn MCP runtime behavior. It records and documents deeper Codex validation.

## Known limitations

- Codex MCP host on Windows is the primary validated host.
- Cursor, Claude Desktop, and other MCP stdio hosts remain pending/future validation targets.
- Owlyn does not keep an MCP host alive by itself.
- The host agent must call Owlyn tools and follow the returned policy.
- Clean database path validation is optional/future unless separately tested.
- npm publishing is still not performed in this release.
