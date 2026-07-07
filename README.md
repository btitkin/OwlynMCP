<p align="center">
  <img src="./Owlyn.png" alt="Owlyn MCP logo" width="420" />
</p>

# Owlyn MCP

<p align="center">
  <strong>Time-aware work sessions for AI agents.</strong>
</p>

AI agents often stop too early.

You ask an agent to work for the night.<br />
It finishes the first task in 20 minutes.<br />
Then it says "done".

Owlyn gives agents a persistent work-session clock, checkpoints, deadlines, and structured continuation decisions so they know when to keep going.

Owlyn MCP is a local-first MCP work-session supervisor for AI coding agents. It is not a simple timer, a todo app, or a background worker.

**Status:** `v0.1.0-alpha.1`<br />
Tested with official MCP SDK stdio integration. Real host validation in progress.

## Quick Start

Requirements:

- Node.js 20+
- npm

Install and build:

```bash
npm install
npm run build
```

Run the stdio MCP server:

```bash
node dist/index.js
```

Run the release checks:

```bash
npm run check
```

Run the manual MCP smoke test:

```bash
npm run smoke:mcp
```

The smoke test uses the official MCP SDK client and calls `owlyn_start`, `owlyn_checkpoint`, `owlyn_should_continue`, `owlyn_plan_next`, and `owlyn_end`.

## Example MCP Config

Generic stdio config:

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["/absolute/path/to/owlyn-mcp/dist/index.js"],
      "env": {
        "OWLYN_DB_PATH": "/absolute/path/to/.owlyn/owlyn.sqlite"
      }
    }
  }
}
```

Windows example:

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["C:\\Users\\you\\Projects\\OwlynMCP\\dist\\index.js"],
      "env": {
        "OWLYN_DB_PATH": "C:\\Users\\you\\.owlyn\\owlyn.sqlite"
      }
    }
  }
}
```

macOS/Linux example:

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["/Users/you/projects/OwlynMCP/dist/index.js"],
      "env": {
        "OWLYN_DB_PATH": "/Users/you/.owlyn/owlyn.sqlite"
      }
    }
  }
}
```

More host examples are in [docs/HOST_SETUP.md](./docs/HOST_SETUP.md).

## Agent Instruction

Copy this into your coding agent instructions when using Owlyn:

```txt
You have access to Owlyn MCP.

At the beginning of work, call owlyn_start with the user's goal and deadline.

After meaningful progress, call owlyn_checkpoint.

Then call owlyn_should_continue.

If should_continue is true, do not stop only because the current task is complete. Pick the next highest-value low-risk task and continue.

If multiple safe next tasks exist, call owlyn_plan_next.

Before final response, call owlyn_end.

Never continue destructive, irreversible, external, expensive, deployment, credential, or approval-requiring work without explicit user approval.
```

See [docs/AGENT_INSTRUCTIONS.md](./docs/AGENT_INSTRUCTIONS.md) for a standalone copy-paste version.

## Tools

| Tool | Purpose |
| --- | --- |
| `owlyn_start` | Start a work session with a goal, deadline, timezone, and mode. |
| `owlyn_status` | Return current time, elapsed time, remaining time, deadline status, and latest checkpoint state. |
| `owlyn_checkpoint` | Save meaningful progress, completed tasks, next tasks, blockers, changed files, validation, confidence, and risk. |
| `owlyn_should_continue` | Decide whether the agent should continue working. |
| `owlyn_plan_next` | Rank candidate next tasks by impact, risk, approval requirement, category, and fit to remaining time. |
| `owlyn_end` | End a session and return a final report. |
| `owlyn_list_sessions` | List active, completed, abandoned, or all sessions. |
| `owlyn_report` | Return a detailed session report without ending the session. |

Full tool documentation is in [docs/TOOLS.md](./docs/TOOLS.md).

## Demo Flow

User:

```txt
Work on this repo until 06:00. If you finish early, continue with safe useful improvements.
```

Agent starts a session:

```json
{
  "tool": "owlyn_start",
  "input": {
    "goal": "Improve the repo safely until morning.",
    "deadline": "06:00",
    "timezone": "Europe/Warsaw",
    "mode": "night_shift"
  }
}
```

Agent finishes the first task and checkpoints:

```json
{
  "tool": "owlyn_checkpoint",
  "input": {
    "summary": "Implemented deadline parsing and added tests.",
    "completed_tasks": ["Added HH:mm deadline parsing", "Added timezone tests"],
    "next_tasks": ["Add policy tests", "Document host setup", "Run release checks"],
    "validation_results": ["npm test passed"],
    "confidence": "high",
    "risk_level": "low"
  }
}
```

Agent asks whether to continue:

```json
{
  "tool": "owlyn_should_continue",
  "input": {
    "current_task_done": true,
    "has_next_tasks": true,
    "requires_user_approval": false,
    "risk_level": "low",
    "destructive_action_pending": false,
    "validation_passed": true
  }
}
```

Expected continuation signal:

```json
{
  "should_continue": true,
  "reason": "The deadline has not been reached and safe next tasks are available.",
  "recommended_action": "Continue with the next highest-value low-risk task. Do not stop only because the current task is complete."
}
```

Longer example: [docs/EXAMPLE_SESSION.md](./docs/EXAMPLE_SESSION.md).

## What Owlyn Stores

Owlyn is local-first and persists session state in SQLite.

Default database path:

```txt
~/.owlyn/owlyn.sqlite
```

Override it with:

```bash
OWLYN_DB_PATH=/custom/path/owlyn.sqlite
```

Owlyn stores only what the agent sends to it:

- session goals
- notes
- checkpoints
- task lists
- file-change notes
- validation notes
- continuation decisions

Do not store secrets in goals, notes, checkpoints, task descriptions, or validation output.

## Safety and Limitations

Owlyn MCP is intentionally conservative.

It should stop when work requires user approval, when destructive action is pending, when the deadline is reached, or when risk is high.

Owlyn v0.1 has:

- local-first SQLite persistence
- stdio MCP transport
- no cloud
- no telemetry
- no auth
- no browser extension
- no dashboard
- no background autonomous worker
- no shell execution by the server
- no project-file modification by the server

Owlyn MCP does not keep your agent alive by itself. It provides session state and continuation policy through MCP tools. Your host agent must call the tools and follow Owlyn's policy.

Host behavior still depends on the MCP client, model, agent instructions, context limits, tool-call limits, user approval gates, rate limits, and runtime timeouts.

## Troubleshooting

`better-sqlite3` native dependency issues:
Make sure Node.js and npm are installed normally for your platform. If installation fails, check that your Node version is supported and that your environment can install native npm packages.

Node version requirement:
Owlyn requires Node.js 20 or newer. Check with `node --version`.

`OWLYN_DB_PATH` usage:
Set `OWLYN_DB_PATH` when you want Owlyn to store its SQLite database somewhere other than `~/.owlyn/owlyn.sqlite`. The parent directory is created automatically.

No active session found:
Call `owlyn_start` first, or pass a known `session_id` to tools that support it. Completed or abandoned sessions are not treated as the latest active session.

Invalid deadline format:
Use ISO datetime or `HH:mm`, for example `2026-07-07T06:00:00+02:00`, `2026-07-07T06:00:00`, or `06:00`.

## Roadmap

Future ideas:

- optional JSON/Markdown export
- optional session templates
- optional host-specific config helpers
- optional durable workflow integration
- optional UI dashboard
- optional per-project session profiles
- optional MCP resources for reports
- optional pause/resume
- optional session budget limits
- optional multi-agent coordination

These are not implemented in v0.1.

## Development

```bash
npm install
npm run typecheck
npm run build
npm test
npm run smoke:mcp
npm run check
```

Release checklist: [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md).

## License

MIT
