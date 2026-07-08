<p align="center">
  <img src="./Owlyn.png" alt="Owlyn MCP logo" width="760" />
</p>

# Owlyn MCP

Owlyn MCP is a local-first MCP work-session supervisor for AI coding agents that need deadlines, checkpoints and structured continuation decisions instead of a simple timer.

It is for developers using agentic coding tools who want long-running work sessions to remain explicit, inspectable and bounded by safety rules.

## Preview

Screenshots / GIF demo coming soon.

The repository includes the Owlyn logo above and example session documentation in [docs/EXAMPLE_SESSION.md](./docs/EXAMPLE_SESSION.md).

## Features

- Stdio MCP server built with the official MCP SDK.
- Local SQLite session storage through `better-sqlite3`.
- Work-session lifecycle tools: start, status, checkpoint, should-continue, plan-next, end, list-sessions and report.
- Deadline and timezone handling for time-aware work sessions.
- Conservative continuation policy that stops for high-risk, destructive or approval-requiring work.
- Host setup and agent instruction docs for integrating Owlyn into coding-agent workflows.
- MCP smoke test that exercises the core tool flow.

## Installation

Requirements:

- Node.js 20+
- npm

```bash
git clone https://github.com/btitkin/OwlynMCP.git
cd OwlynMCP
npm install
npm run build
```

Installation instructions are based on the current repository structure and should be verified for each MCP host.

## Quick Start

Run the stdio MCP server:

```bash
node dist/index.js
```

Generic MCP server config:

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["/absolute/path/to/OwlynMCP/dist/index.js"],
      "env": {
        "OWLYN_DB_PATH": "/absolute/path/to/.owlyn/owlyn.sqlite"
      }
    }
  }
}
```

More host setup notes are in [docs/HOST_SETUP.md](./docs/HOST_SETUP.md).

## Examples / Use Cases

- Start a bounded AI-agent work session with a goal and deadline.
- Save checkpoints that include completed work, next tasks, validation and blockers.
- Ask whether the agent should continue after the current task finishes.
- Rank safe next tasks when time remains in a session.
- Produce a session report before ending work.

## Roadmap

- Optional JSON/Markdown export.
- Optional session templates.
- Host-specific config helpers.
- Optional UI dashboard.
- Per-project session profiles.
- Optional pause/resume and session budget controls.

These items are not implemented in the current alpha release.

## Status

Alpha: the repository identifies version `v0.1.0-alpha.1`, includes tests, documentation and a manual MCP smoke test, and has been documented for local MCP host use. Broader host compatibility should still be treated as pending unless verified in the target host.

## License

MIT. See [LICENSE](./LICENSE).

