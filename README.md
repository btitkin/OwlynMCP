# Owlyn MCP

Time-aware work sessions for AI agents.

Owlyn MCP gives AI agents work-session awareness: deadlines, checkpoints, elapsed time, remaining time, and structured decisions about whether to continue.

## What It Does

Owlyn MCP gives agents a persistent work-session state: start time, deadline, elapsed time, remaining time, checkpoints, next tasks, and continuation decisions.

It is a local-first Model Context Protocol server for AI coding agents. It helps agents track when a session started, how much time remains until the deadline, what has been completed, what is left, and whether it is safe and useful to continue.

## Why It Exists

Many agents complete the first requested task and stop, even when the user intended a longer work session. Owlyn helps agents keep working safely until a deadline by making the continuation decision explicit.

The key behavior is:

```txt
Finish meaningful work.
Checkpoint it.
Ask Owlyn whether to continue.
If Owlyn says continue, do not stop only because the current task is complete.
```

## What It Does Not Do

Owlyn is not a normal timer, billing tracker, todo app, project manager, or autonomous daemon.

Owlyn does not run your agent in the background.
Owlyn does not bypass host limits.
Owlyn does not execute shell commands.
Owlyn does not modify your project files.
Owlyn does not call external services.
Owlyn does not make destructive actions safe.

Owlyn MCP does not keep your agent alive by itself. It provides session state and continuation policy through MCP tools. Your host agent must call these tools and follow the returned guidance.

## How It Works

1. The agent starts a session with `owlyn_start`.
2. The agent works on the requested goal.
3. After meaningful progress, the agent calls `owlyn_checkpoint`.
4. The agent calls `owlyn_should_continue`.
5. If `should_continue` is true, the agent picks the next useful safe task and continues.
6. If `should_continue` is false, the agent stops and explains why.
7. The agent ends the session with `owlyn_end`.

## Installation

From source:

```bash
npm install
npm run build
```

Owlyn requires Node.js 20 or newer.

## Build

```bash
npm run typecheck
npm run build
```

## Run

Development mode:

```bash
npm run dev
```

Built mode:

```bash
node dist/index.js
```

The server runs over MCP stdio transport.

## MCP Client Configuration

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

Windows path example:

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["C:\\Users\\you\\Projects\\owlyn-mcp\\dist\\index.js"],
      "env": {
        "OWLYN_DB_PATH": "C:\\Users\\you\\.owlyn\\owlyn.sqlite"
      }
    }
  }
}
```

macOS/Linux path example:

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["/Users/you/projects/owlyn-mcp/dist/index.js"],
      "env": {
        "OWLYN_DB_PATH": "/Users/you/.owlyn/owlyn.sqlite"
      }
    }
  }
}
```

Using npm global install:

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "owlyn-mcp",
      "args": []
    }
  }
}
```

Development mode:

```json
{
  "mcpServers": {
    "owlyn-dev": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "/absolute/path/to/owlyn-mcp"
    }
  }
}
```

Only use `cwd` if your MCP host supports it. If it does not, run from the project directory or use an absolute `node` path.

## Tools

| Tool | Purpose |
| --- | --- |
| `owlyn_start` | Start a work session with a goal, deadline, timezone, and mode. |
| `owlyn_status` | Return current time, elapsed time, remaining time, deadline status, and checkpoint state. |
| `owlyn_checkpoint` | Save meaningful progress, completed tasks, next tasks, blockers, changed files, validation, confidence, and risk. |
| `owlyn_should_continue` | Decide whether the agent should continue working. |
| `owlyn_plan_next` | Rank candidate next tasks by impact, risk, approval requirement, category, and fit to remaining time. |
| `owlyn_end` | End a session and return a final report. |
| `owlyn_list_sessions` | List previous sessions. |
| `owlyn_report` | Return a detailed report without ending the session. |

## Example Workflow

User request:

```txt
Work on this repo until 06:00. If you finish the first task early, keep improving the project safely.
```

Agent starts session:

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

Agent checkpoints:

```json
{
  "tool": "owlyn_checkpoint",
  "input": {
    "summary": "Implemented deadline parsing and added tests.",
    "completed_tasks": [
      "Added HH:mm deadline parsing",
      "Added ISO deadline parsing",
      "Added timezone default"
    ],
    "next_tasks": [
      "Add policy engine tests",
      "Document example host configuration",
      "Add final report generation"
    ],
    "blockers": [],
    "files_changed": [
      "src/time.ts",
      "tests/time.test.ts"
    ],
    "validation_results": [
      "npm test passed for time.test.ts"
    ],
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

Expected result:

```json
{
  "should_continue": true,
  "reason": "The deadline has not been reached and safe next tasks are available.",
  "recommended_action": "Continue with the next highest-value low-risk task. Do not stop only because the current task is complete."
}
```

## Agent Instruction

Copy this into your coding agent instructions when using Owlyn:

```txt
You have access to Owlyn MCP.

At the beginning of work, call owlyn_start with the user's goal and deadline.

After every meaningful completed task, call owlyn_checkpoint.

Then call owlyn_should_continue.

If should_continue is true, do not stop only because the current task is complete. Pick the next highest-value low-risk task and continue.

If multiple safe next tasks exist, call owlyn_plan_next.

If should_continue is false, stop and summarize why.

Never perform destructive, irreversible, external, credential-requiring, payment-related, deployment-related, or approval-requiring actions unless the user explicitly approves.
```

## Storage

Default database path:

```txt
~/.owlyn/owlyn.sqlite
```

Owlyn creates the parent directory automatically.

It stores only what the agent sends to it:

- session goals
- checkpoints
- files changed
- validation notes
- task lists
- continuation decisions

Do not store secrets in checkpoint summaries, task descriptions, notes, or validation output.

## Environment Variables

Override the database path:

```bash
OWLYN_DB_PATH=/custom/path/owlyn.sqlite
```

If `max_work_minutes` is provided to `owlyn_start`, Owlyn uses the earlier of the resolved deadline and `started_at + max_work_minutes`.

## Safety

Owlyn is intentionally conservative. It should stop when work requires user approval, when destructive action is pending, when the deadline is reached, or when risk is high.

Owlyn does not execute shell commands, edit project files, call networks, upload data, deploy, collect telemetry, ask for credentials, or run a hidden background loop.

## Limitations

Owlyn depends on the host MCP client, model behavior, agent instructions, context limits, tool-call limits, user approval gates, rate limits, and runtime timeouts.

It gives an agent structured session memory and continuation guidance. It cannot force the host agent to keep running or guarantee the agent follows the returned guidance.

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
npm run dev
```

Project layout:

```txt
src/
  index.ts
  server.ts
  db.ts
  time.ts
  policy.ts
  ranking.ts
  report.ts
  tools/
tests/
```

## Testing

```bash
npm run typecheck
npm run build
npm test
```

Tests use temporary SQLite database paths and do not write to the user's real `~/.owlyn` directory.

Manual MCP smoke test after building:

```bash
npm run build
npm run smoke:mcp
```

The smoke test uses the official MCP SDK client and calls:

- `owlyn_start`
- `owlyn_checkpoint`
- `owlyn_should_continue`
- `owlyn_plan_next`
- `owlyn_end`

It uses a temporary SQLite database unless `OWLYN_DB_PATH` is set.

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

## License

MIT
