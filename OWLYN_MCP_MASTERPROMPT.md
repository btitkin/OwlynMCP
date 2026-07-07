# Owlyn MCP — Masterprompt for Coding Agent

> **Product tagline:** Time-aware work sessions for AI agents.  
> **Repository/package name:** `owlyn-mcp`  
> **Primary brand:** `Owlyn`  
> **Technical product name:** `Owlyn MCP`

---

## Copy/paste this entire document into the coding agent

You are building a production-quality MVP called **Owlyn MCP**.

Owlyn MCP is a local-first Model Context Protocol server that gives AI coding agents runtime time awareness, persistent work-session memory, checkpoints, deadlines, and structured continuation decisions.

The core idea is simple:

> AI agents often finish the first task and stop, even when the user intended a longer work session. Owlyn MCP gives the agent a persistent work-session clock, checkpoint memory, deadline awareness, and a continuation policy so it knows whether to keep working safely.

Owlyn is not a normal timer.  
Owlyn is not a billing time tracker.  
Owlyn is not a todo app.  
Owlyn is not a project manager.  
Owlyn is not an autonomous background daemon.

Owlyn is an **agent work-session supervisor**.

It helps an agent stop behaving like:

> “I completed the first task, so I am done.”

And start behaving like:

> “I have a work session until the deadline. I completed this task, checkpointed progress, checked remaining time, and should continue with the next useful safe task.”

---

# 1. Product identity

## 1.1 Name

Use:

```txt
Owlyn MCP
```

The main brand is:

```txt
Owlyn
```

The technical suffix is:

```txt
MCP
```

Do not make `MCP` visually or semantically more important than `Owlyn`.

## 1.2 Tagline

Use this tagline in the README and package description:

```txt
Time-aware work sessions for AI agents.
```

## 1.3 Short product description

Use this description:

```txt
Owlyn MCP gives AI agents work-session awareness: deadlines, checkpoints, elapsed time, remaining time, and structured decisions about whether to continue.
```

## 1.4 Longer product description

Use this where more explanation is useful:

```txt
Owlyn MCP is a local-first work-session supervisor for AI coding agents. It helps agents track when a session started, how much time remains until the deadline, what has been completed, what is left, and whether it is safe and useful to continue. It is designed for long-running agent workflows where the user expects the agent to keep working until a deadline instead of stopping after the first completed task.
```

## 1.5 Brand direction

Owlyn has an owl-inspired brand, but the implementation does not need to generate or edit logos.

The agreed brand direction:

- main symbol concept: abstract **Owlyn Knot** / infinity-owl mark
- visual meaning: continuous work loop, watchfulness, persistence, night-shift style focus
- primary style: white mark on very dark background
- product name: `Owlyn`
- `MCP` should be smaller, suffix-like, or used only in technical contexts
- the main logo can use the symbol as the `O` in `Owlyn`, but this is a brand asset concern, not an MVP requirement

Do not spend implementation time generating logos or doing design work.  
If an asset folder is added, only add placeholders or simple documentation.

Suggested optional asset paths:

```txt
assets/brand/owlyn-symbol.svg
assets/brand/owlyn-logo-horizontal.svg
assets/brand/owlyn-logo-dark.svg
```

This is optional and must not block the MVP.

---

# 2. Core mission

Build a working local MCP server that provides tools for:

1. Starting a work session with a goal and deadline.
2. Checking current time, elapsed time, and remaining time.
3. Saving checkpoints after meaningful progress.
4. Deciding whether the agent should continue working.
5. Ranking possible next tasks.
6. Ending a session with a final report.
7. Listing previous sessions.
8. Producing a session report.

The most important behavior:

> When `owlyn_should_continue` returns `true`, the response must clearly tell the agent:  
> **“Do not stop only because the current task is complete.”**

The second most important behavior:

> When `owlyn_should_continue` returns `false`, the response must clearly explain why:
> deadline reached, user approval required, destructive action pending, no safe next tasks, high risk, focused mode complete, or inactive session.

---

# 3. Main user story

A user says to an AI coding agent:

```txt
Work on this project until 06:00. If you finish the first task early, keep improving the project safely.
```

The agent should:

1. Call `owlyn_start`.
2. Work on the first task.
3. Call `owlyn_checkpoint`.
4. Call `owlyn_should_continue`.
5. If Owlyn says continue, pick the next highest-value safe task.
6. Continue until the deadline, no safe task remains, or user approval is required.
7. End with `owlyn_end` and summarize.

Example behavior:

```txt
User starts session at 23:00 with deadline 06:00.
Agent completes original task at 23:42.
Agent checkpoints.
Agent asks Owlyn if it should continue.
Owlyn sees 378 minutes remaining and safe next tasks exist.
Owlyn returns should_continue: true.
Agent continues instead of stopping.
```

---

# 4. Non-goals for v0.1

Do not build these in v0.1:

- web dashboard
- UI
- cloud sync
- auth
- billing
- telemetry
- analytics
- browser extension
- background autonomous daemon
- task management app
- calendar integration
- GitHub integration
- IDE plugin
- project file modification
- shell execution
- network calls
- automatic scheduled wakeups
- external deployment
- logo generator

Owlyn MCP is a local MCP server.  
It only provides tools and structured guidance.  
The host agent decides when to call the tools.

---

# 5. Critical limitation to document

Owlyn MCP does **not** force the host agent to keep running.

It gives the agent time/session awareness and continuation decisions. The actual behavior depends on:

- the host MCP client
- the model
- the agent instructions
- context limits
- tool-call limits
- user approval gates
- rate limits
- runtime timeouts

The README must state:

```txt
Owlyn MCP does not keep your agent alive by itself. It provides session state and continuation policy through MCP tools. Your host agent must call these tools and follow the returned guidance.
```

---

# 6. Tech stack

Use:

```txt
Node.js 20+
TypeScript
Official Model Context Protocol TypeScript SDK
Zod
SQLite
stdio transport
```

Recommended packages:

```txt
@modelcontextprotocol/sdk
zod
luxon
better-sqlite3
typescript
tsx
vitest
@types/node
```

Notes:

- Use `luxon` or another robust timezone-aware library.
- Do not hand-roll fragile timezone math.
- Use SQLite for persistence.
- Use stdio as the default MCP transport.
- Avoid unnecessary dependencies.
- Keep TypeScript strict.

If `better-sqlite3` causes install/build issues in the target environment, use a reliable SQLite alternative, but keep the public behavior the same.

---

# 7. Runtime and storage

## 7.1 Default database path

Use:

```txt
~/.owlyn/owlyn.sqlite
```

## 7.2 Environment override

Allow:

```txt
OWLYN_DB_PATH=/custom/path/owlyn.sqlite
```

## 7.3 Directory creation

Create the parent database directory automatically if missing.

## 7.4 Cross-platform behavior

Support:

- Windows
- macOS
- Linux

Do not hardcode Unix-only paths.

---

# 8. Project structure

Create this project structure:

```txt
owlyn-mcp/
  package.json
  tsconfig.json
  README.md
  LICENSE
  .gitignore

  src/
    index.ts
    server.ts
    db.ts
    time.ts
    policy.ts
    ranking.ts
    ids.ts
    errors.ts
    schemas.ts
    types.ts
    report.ts

    tools/
      start.ts
      status.ts
      checkpoint.ts
      shouldContinue.ts
      planNext.ts
      end.ts
      listSessions.ts
      reportSession.ts

  tests/
    time.test.ts
    policy.test.ts
    ranking.test.ts
    db.test.ts

  data/
    .gitkeep

  assets/
    brand/
      README.md
```

The `assets/brand` directory is optional. If added, keep it lightweight.

---

# 9. Package configuration

## 9.1 package.json requirements

Use:

```json
{
  "name": "owlyn-mcp",
  "version": "0.1.0",
  "description": "Time-aware work sessions for AI agents.",
  "type": "module",
  "bin": {
    "owlyn-mcp": "./dist/index.js"
  },
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

Adjust as needed, but keep equivalent scripts.

## 9.2 TypeScript

Use strict TypeScript.

`tsconfig.json` should include:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

Adjust if needed for the SDK, but do not weaken type safety unnecessarily.

---

# 10. MCP server

Use the official MCP TypeScript SDK.

Recommended approach if compatible with the installed SDK:

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
```

If SDK APIs differ, inspect the installed SDK examples and adapt while preserving tool names and behavior.

The server must start over stdio.

The server name should be:

```txt
owlyn-mcp
```

Version:

```txt
0.1.0
```

---

# 11. Database schema

Create migrations automatically on startup.

Use ISO 8601 timestamps.

## 11.1 sessions

```sql
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  goal TEXT NOT NULL,
  mode TEXT NOT NULL,
  timezone TEXT NOT NULL,
  started_at TEXT NOT NULL,
  deadline_at TEXT NOT NULL,
  status TEXT NOT NULL,
  max_work_minutes INTEGER NULL,
  notes TEXT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT NULL,
  final_summary TEXT NULL
);
```

Allowed `status`:

```txt
active
completed
abandoned
```

Allowed `mode`:

```txt
focused
night_shift
marathon
```

## 11.2 checkpoints

```sql
CREATE TABLE IF NOT EXISTS checkpoints (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  summary TEXT NOT NULL,
  completed_tasks_json TEXT NOT NULL,
  next_tasks_json TEXT NOT NULL,
  blockers_json TEXT NOT NULL,
  files_changed_json TEXT NOT NULL,
  validation_results_json TEXT NOT NULL,
  confidence TEXT NOT NULL,
  risk_level TEXT NULL,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);
```

Allowed `confidence`:

```txt
low
medium
high
```

Allowed `risk_level`:

```txt
low
medium
high
```

## 11.3 continuation_decisions

```sql
CREATE TABLE IF NOT EXISTS continuation_decisions (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  should_continue INTEGER NOT NULL,
  reason TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  policy_json TEXT NOT NULL,
  FOREIGN KEY(session_id) REFERENCES sessions(id)
);
```

## 11.4 Optional migrations table

Add if helpful:

```sql
CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TEXT NOT NULL
);
```

For v0.1, simple idempotent schema creation is acceptable.

---

# 12. IDs

Create readable unique IDs.

Session ID example:

```txt
owl_20260707_231502_ab12cd
```

Checkpoint ID example:

```txt
chk_20260707_233040_ab12cd
```

Decision ID example:

```txt
dec_20260707_233050_ab12cd
```

Use `crypto.randomUUID()` or random bytes for uniqueness.

---

# 13. Time behavior

## 13.1 Default timezone

Default timezone:

```txt
Europe/Warsaw
```

## 13.2 Supported deadline input

`deadline` must accept:

```txt
2026-07-07T06:00:00+02:00
2026-07-07T06:00:00
06:00
23:30
```

## 13.3 HH:mm deadline resolution

If deadline is `HH:mm`:

- interpret it in the selected timezone
- if that local time has not passed today, use today
- if that local time has already passed today, use tomorrow

Example:

```txt
now: 2026-07-07 23:00 Europe/Warsaw
deadline input: 06:00
resolved deadline: 2026-07-08 06:00 Europe/Warsaw
```

Example:

```txt
now: 2026-07-07 02:00 Europe/Warsaw
deadline input: 06:00
resolved deadline: 2026-07-07 06:00 Europe/Warsaw
```

## 13.4 max_work_minutes

If `max_work_minutes` is provided, apply the earlier of:

- resolved `deadline_at`
- `started_at + max_work_minutes`

Document this behavior.

---

# 14. Work modes

## 14.1 focused

Purpose:

```txt
Finish the current task safely. Do not automatically continue to unrelated tasks after the current task is complete.
```

Policy:

- if current task is not done and deadline remains, allow continuing current task
- if current task is done, stop
- if deadline reached, stop
- if approval required, stop
- if destructive action pending, stop

## 14.2 night_shift

Purpose:

```txt
Continue working safely until the deadline when useful next tasks exist.
```

Policy:

- if deadline remains and next tasks exist and risk is low/medium, continue
- if current task is done but safe next tasks exist, continue
- if no next tasks, stop
- if deadline reached, stop
- if approval required, stop
- if destructive action pending, stop
- if high risk, stop unless the agent can switch to low-risk validation/documentation work

This is the default mode.

## 14.3 marathon

Purpose:

```txt
Longer careful work session with more validation and checkpointing.
```

Policy:

- continue only with low-risk or medium-risk work
- recommend more frequent checkpoints
- prefer validation, tests, documentation, cleanup, and small safe improvements
- if validation failed, prioritize validation/fix work before new features
- stop on high risk, approval requirement, or destructive operations

---

# 15. Core workflow

The README and tool responses must encourage this workflow:

```txt
1. Agent starts session:
   owlyn_start(goal, deadline, mode)

2. Agent works.

3. After meaningful progress:
   owlyn_checkpoint(...)

4. Agent asks:
   owlyn_should_continue(...)

5. If true:
   - do not stop only because current task is complete
   - choose next useful safe task
   - optionally call owlyn_plan_next

6. If false:
   - stop
   - summarize
   - ask user if needed

7. End:
   owlyn_end(...)
```

---

# 16. Tool names

Implement these MCP tools exactly:

```txt
owlyn_start
owlyn_status
owlyn_checkpoint
owlyn_should_continue
owlyn_plan_next
owlyn_end
owlyn_list_sessions
owlyn_report
```

Use Zod schemas for all inputs.

---

# 17. Tool: owlyn_start

## 17.1 Purpose

Start a work session.

## 17.2 Input schema

```ts
{
  goal: string;
  deadline: string;
  timezone?: string; // default "Europe/Warsaw"
  mode?: "focused" | "night_shift" | "marathon"; // default "night_shift"
  max_work_minutes?: number;
  notes?: string;
  force_new?: boolean; // default false
}
```

## 17.3 Behavior

- Validate input.
- Resolve timezone.
- Resolve deadline.
- Create session.
- If an active session already exists and `force_new` is false:
  - return the existing active session
  - include a warning
  - do not create duplicate session
- If `force_new` is true:
  - create a new active session

## 17.4 Output

Return:

```json
{
  "session_id": "owl_...",
  "goal": "...",
  "mode": "night_shift",
  "timezone": "Europe/Warsaw",
  "started_at": "...",
  "deadline_at": "...",
  "elapsed_minutes": 0,
  "remaining_minutes": 420,
  "status": "active",
  "initial_instruction": "At every meaningful completion point, call owlyn_checkpoint, then owlyn_should_continue. Do not stop only because the first task is complete if Owlyn says to continue."
}
```

## 17.5 Required language

The initial instruction must include:

```txt
Do not stop only because the first task is complete if Owlyn says to continue.
```

---

# 18. Tool: owlyn_status

## 18.1 Purpose

Return current work-session status.

## 18.2 Input schema

```ts
{
  session_id?: string;
}
```

## 18.3 Behavior

- If `session_id` omitted, use latest active session.
- If no active session exists, return a clear error.
- Include current time, elapsed, remaining, deadline status, checkpoint state.

## 18.4 Output

```json
{
  "session_id": "owl_...",
  "goal": "...",
  "mode": "night_shift",
  "timezone": "Europe/Warsaw",
  "now": "...",
  "started_at": "...",
  "deadline_at": "...",
  "elapsed_minutes": 82,
  "remaining_minutes": 338,
  "deadline_reached": false,
  "status": "active",
  "checkpoint_count": 3,
  "last_checkpoint_summary": "...",
  "last_checkpoint_at": "...",
  "next_tasks_from_last_checkpoint": ["..."],
  "blockers_from_last_checkpoint": ["..."]
}
```

---

# 19. Tool: owlyn_checkpoint

## 19.1 Purpose

Save a meaningful progress checkpoint.

## 19.2 Input schema

```ts
{
  session_id?: string;
  summary: string;
  completed_tasks: string[];
  next_tasks: string[];
  blockers?: string[];
  files_changed?: string[];
  validation_results?: string[];
  confidence: "low" | "medium" | "high";
  risk_level?: "low" | "medium" | "high";
}
```

Defaults:

```txt
blockers = []
files_changed = []
validation_results = []
```

## 19.3 Behavior

- Resolve session.
- Save checkpoint.
- Return checkpoint and updated status.
- Do not require next tasks to be non-empty.
- If next tasks are empty, the next `owlyn_should_continue` may stop.

## 19.4 Output

```json
{
  "checkpoint_id": "chk_...",
  "session_id": "owl_...",
  "created_at": "...",
  "summary": "...",
  "completed_tasks": ["..."],
  "next_tasks": ["..."],
  "blockers": [],
  "files_changed": ["..."],
  "validation_results": ["..."],
  "confidence": "high",
  "risk_level": "low",
  "status_after_checkpoint": {
    "elapsed_minutes": 84,
    "remaining_minutes": 336,
    "checkpoint_count": 4
  }
}
```

---

# 20. Tool: owlyn_should_continue

## 20.1 Purpose

Return a structured decision telling the agent whether it should continue.

This is the most important tool in the project.

## 20.2 Input schema

```ts
{
  session_id?: string;
  current_task_done: boolean;
  has_next_tasks: boolean;
  requires_user_approval?: boolean; // default false
  risk_level: "low" | "medium" | "high";
  destructive_action_pending?: boolean; // default false
  validation_passed?: boolean;
  notes?: string;
}
```

## 20.3 Behavior

- Resolve session.
- Calculate current time.
- Calculate elapsed time.
- Calculate remaining time.
- Check deadline.
- Check latest checkpoint.
- Apply mode policy.
- Persist decision to `continuation_decisions`.

## 20.4 Stop rules

Always return `should_continue: false` if:

- no active session exists
- session status is not active
- deadline has been reached
- `requires_user_approval` is true
- `destructive_action_pending` is true
- risk level is high and the agent cannot switch to safe low-risk work

## 20.5 Focused mode

If `mode = focused`:

- if `current_task_done = true`, stop
- if `current_task_done = false` and deadline remains, continue current task
- do not continue into unrelated next tasks

## 20.6 Night shift mode

If `mode = night_shift`:

- if deadline remains
- and safe next tasks exist
- and risk is low or medium
- continue

If current task is complete but next tasks exist, continue.

This is the main Owlyn behavior.

## 20.7 Marathon mode

If `mode = marathon`:

- continue only with low-risk or medium-risk work
- recommend checkpointing and validation
- if validation failed, recommend validation/fix work before feature work
- avoid risky refactors late in the session

## 20.8 Output

```json
{
  "session_id": "owl_...",
  "now": "...",
  "started_at": "...",
  "deadline_at": "...",
  "elapsed_minutes": 84,
  "remaining_minutes": 336,
  "deadline_reached": false,
  "mode": "night_shift",
  "should_continue": true,
  "reason": "The deadline has not been reached and safe next tasks are available.",
  "recommended_action": "Continue with the next highest-value low-risk task. Do not stop only because the current task is complete.",
  "next_policy": "Pick a safe task from the latest checkpoint or call owlyn_plan_next if multiple candidate tasks exist.",
  "safety_notes": [
    "Avoid destructive or irreversible actions without explicit user approval.",
    "Checkpoint again after meaningful progress."
  ]
}
```

## 20.9 Required phrase when continuing

When `should_continue` is `true`, include this exact sentence:

```txt
Do not stop only because the current task is complete.
```

## 20.10 Required clarity when stopping

When `should_continue` is `false`, explain the stop reason clearly.

Examples:

```txt
Stop because the deadline has been reached.
Stop because user approval is required.
Stop because a destructive action is pending.
Stop because focused mode ends after the current task is complete.
Stop because no safe next tasks are available.
Stop because risk level is high.
```

---

# 21. Tool: owlyn_plan_next

## 21.1 Purpose

Help the agent choose the next useful safe task.

## 21.2 Input schema

```ts
{
  session_id?: string;
  candidate_tasks: Array<{
    title: string;
    description?: string;
    impact: "low" | "medium" | "high";
    risk: "low" | "medium" | "high";
    estimated_minutes?: number;
    requires_user_approval?: boolean;
    category?: string;
  }>;
}
```

Default:

```txt
requires_user_approval = false
```

## 21.3 Ranking policy

Prefer tasks that are:

- high impact
- low risk
- fit remaining time
- do not require user approval
- continue the user's stated goal
- improve correctness
- improve validation
- add tests
- update docs
- reduce obvious bugs
- improve stability
- clean up small safe issues

Avoid tasks that are:

- high risk
- destructive
- irreversible
- require user approval
- require secrets
- require credentials
- require payment
- require external deployment
- require uploading data
- too large for the remaining time
- unrelated to the original goal

## 21.4 Suggested scoring

Use a simple deterministic scoring system.

Example:

```txt
impact:
  high = +30
  medium = +15
  low = +5

risk:
  low = +25
  medium = +5
  high = -40

requires_user_approval:
  true = reject or -100

estimated_minutes:
  fits remaining time = +10
  unknown = 0
  exceeds remaining time = -20

category:
  validation/tests/docs after implementation = +10
  destructive/deploy/secrets = reject
```

The exact numbers may vary, but the behavior must match the policy.

## 21.5 Output

```json
{
  "session_id": "owl_...",
  "remaining_minutes": 336,
  "recommended_task": {
    "title": "...",
    "impact": "high",
    "risk": "low",
    "estimated_minutes": 25,
    "reason": "High impact, low risk, fits remaining time, and does not require approval."
  },
  "ranked_tasks": [
    {
      "title": "...",
      "score": 65,
      "reason": "..."
    }
  ],
  "rejected_tasks_with_reasons": [
    {
      "title": "...",
      "reason": "Requires user approval."
    }
  ],
  "planning_notes": [
    "Prefer safe validation or documentation if the session is close to deadline."
  ]
}
```

---

# 22. Tool: owlyn_end

## 22.1 Purpose

End a session and produce a final report.

## 22.2 Input schema

```ts
{
  session_id?: string;
  final_summary: string;
  remaining_tasks?: string[];
  validation_results?: string[];
  status?: "completed" | "abandoned";
}
```

Defaults:

```txt
remaining_tasks = []
validation_results = []
status = completed
```

## 22.3 Behavior

- Resolve session.
- Mark session completed or abandoned.
- Save final summary.
- Save completed timestamp.
- Return final report.

## 22.4 Output

```json
{
  "session_id": "owl_...",
  "goal": "...",
  "mode": "night_shift",
  "started_at": "...",
  "completed_at": "...",
  "deadline_at": "...",
  "total_elapsed_minutes": 412,
  "checkpoint_count": 9,
  "final_summary": "...",
  "completed_tasks_aggregated": ["..."],
  "remaining_tasks": ["..."],
  "validation_results": ["..."],
  "final_recommendation": "Session completed. Summarize changes to the user and mention remaining tasks."
}
```

---

# 23. Tool: owlyn_list_sessions

## 23.1 Purpose

List sessions.

## 23.2 Input schema

```ts
{
  status?: "active" | "completed" | "abandoned" | "all";
  limit?: number;
}
```

Defaults:

```txt
status = all
limit = 20
```

## 23.3 Output

```json
{
  "sessions": [
    {
      "session_id": "owl_...",
      "goal": "...",
      "mode": "night_shift",
      "status": "completed",
      "started_at": "...",
      "deadline_at": "...",
      "completed_at": "...",
      "checkpoint_count": 7
    }
  ]
}
```

---

# 24. Tool: owlyn_report

## 24.1 Purpose

Return a detailed report without ending the session.

## 24.2 Input schema

```ts
{
  session_id?: string;
}
```

## 24.3 Output

```json
{
  "session_id": "owl_...",
  "goal": "...",
  "mode": "night_shift",
  "status": "active",
  "started_at": "...",
  "deadline_at": "...",
  "elapsed_minutes": 120,
  "remaining_minutes": 300,
  "checkpoint_count": 4,
  "timeline": [
    {
      "type": "checkpoint",
      "created_at": "...",
      "summary": "..."
    },
    {
      "type": "decision",
      "created_at": "...",
      "should_continue": true,
      "reason": "..."
    }
  ],
  "completed_tasks_aggregated": ["..."],
  "next_tasks_latest": ["..."],
  "blockers_latest": ["..."],
  "decisions_summary": {
    "continue_count": 3,
    "stop_count": 0
  }
}
```

---

# 25. Tool response format

All tool responses must be structured and easy for an LLM agent to follow.

If the MCP SDK supports structured content, use it.  
If not, return clear JSON text.

Each successful tool response should include:

1. Machine-readable data.
2. A short human-readable instruction.
3. Safety note when applicable.

Example:

```json
{
  "data": {
    "should_continue": true
  },
  "instruction": "Continue with the next highest-value low-risk task. Do not stop only because the current task is complete.",
  "safety": "Avoid destructive or irreversible work without explicit user approval."
}
```

Do not return vague responses.

---

# 26. Error handling

Errors must be explicit and useful.

Do not expose raw stack traces to the MCP client.

Examples:

```txt
No active Owlyn session found. Call owlyn_start first.
Invalid deadline format. Use ISO datetime or HH:mm.
Session not found.
Session is already completed.
Cannot continue because the deadline has been reached.
Cannot continue because user approval is required.
```

Create typed errors if helpful.

---

# 27. Safety rules

Owlyn MCP must not:

- execute shell commands
- edit user project files
- call external networks
- upload data
- read unrelated files
- store secrets
- ask for API keys
- perform deployment
- run hidden background loops
- make autonomous decisions outside tool calls
- bypass user approval
- encourage destructive actions
- recommend irreversible changes without approval

Owlyn MCP may:

- read/write its own SQLite database
- create its own config/data directory
- return structured work-session guidance
- persist checkpoints and decisions

---

# 28. Agent behavioral instruction to include in README

Add this as a copy-paste block in the README:

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

---

# 29. Example session for README

Include a realistic example.

## 29.1 User request

```txt
Work on this repo until 06:00. If you finish the first task early, keep improving the project safely.
```

## 29.2 Agent starts session

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

## 29.3 Agent checkpoints

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

## 29.4 Agent asks whether to continue

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

## 29.5 Expected result

```json
{
  "should_continue": true,
  "reason": "The deadline has not been reached and safe next tasks are available.",
  "recommended_action": "Continue with the next highest-value low-risk task. Do not stop only because the current task is complete."
}
```

---

# 30. MCP client config examples

Include generic examples.  
Do not overpromise exact compatibility for every host.

## 30.1 Built from source

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

## 30.2 Using npm global install

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

## 30.3 Development mode

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

Only include `cwd` if the host supports it.  
If not, tell the user to run from the project directory or use an absolute node path.

---

# 31. README requirements

Write a strong README with these sections:

```txt
# Owlyn MCP
Tagline
What it does
Why it exists
What it does not do
How it works
Installation
Build
Run
MCP client configuration
Tools
Example workflow
Agent instruction
Storage
Environment variables
Safety
Limitations
Roadmap
Development
Testing
License
```

## 31.1 README must explain what Owlyn does

Include:

```txt
Owlyn MCP gives agents a persistent work-session state: start time, deadline, elapsed time, remaining time, checkpoints, next tasks, and continuation decisions.
```

## 31.2 README must explain why Owlyn exists

Include:

```txt
Many agents complete the first requested task and stop, even when the user intended a longer work session. Owlyn helps agents keep working safely until a deadline by making the continuation decision explicit.
```

## 31.3 README must explain what Owlyn does not do

Include:

```txt
Owlyn does not run your agent in the background.
Owlyn does not bypass host limits.
Owlyn does not execute shell commands.
Owlyn does not modify your project files.
Owlyn does not call external services.
Owlyn does not make destructive actions safe.
```

## 31.4 README must include tool table

Include each tool:

```txt
owlyn_start
owlyn_status
owlyn_checkpoint
owlyn_should_continue
owlyn_plan_next
owlyn_end
owlyn_list_sessions
owlyn_report
```

## 31.5 README must include safety note

Include:

```txt
Owlyn is intentionally conservative. It should stop when work requires user approval, when destructive action is pending, when the deadline is reached, or when risk is high.
```

---

# 32. Tests

Use Vitest.

Create tests for:

## 32.1 Time parsing

- ISO deadline works
- HH:mm deadline today works
- HH:mm deadline tomorrow works when time already passed
- default timezone is Europe/Warsaw
- max_work_minutes caps deadline if earlier

## 32.2 Policy

- night_shift continues before deadline with safe next tasks
- night_shift stops after deadline
- night_shift stops when no next tasks
- focused stops when current task is done
- focused continues current task when not done and deadline remains
- marathon continues low-risk work
- marathon recommends validation/checkpointing
- requires_user_approval always stops
- destructive_action_pending always stops
- high risk stops
- inactive session stops

## 32.3 Ranking

- high impact low risk wins
- approval-required task is rejected
- destructive task is rejected
- task exceeding remaining time is deprioritized
- validation/test/doc cleanup ranks well after implementation

## 32.4 Database

- DB initializes
- session persists
- checkpoint persists
- decision persists
- latest active session resolves
- completed session is not treated as active
- list sessions works

Use temporary database paths in tests.  
Do not write tests to the user's real `~/.owlyn` directory.

---

# 33. Acceptance criteria

The MVP is complete when:

```txt
npm install succeeds
npm run build succeeds
npm run typecheck succeeds
npm test succeeds
MCP server starts over stdio
All tools validate input with Zod
SQLite database initializes automatically
SQLite persists sessions between restarts
owlyn_start creates or returns an active session
owlyn_status returns current elapsed and remaining time
owlyn_checkpoint stores progress
owlyn_should_continue returns true in night_shift mode before deadline when safe next tasks exist
owlyn_should_continue returns false after deadline
owlyn_should_continue returns false when approval is required
owlyn_plan_next ranks safe useful tasks
owlyn_end marks session complete and returns report
owlyn_list_sessions lists previous sessions
owlyn_report returns a detailed timeline
README explains setup, use, tools, limitations, and safety
```

---

# 34. Implementation plan

Follow this order:

## Step 1 — Scaffold

- Create TypeScript project.
- Add dependencies.
- Add tsconfig.
- Add package scripts.
- Add MCP server entry.

## Step 2 — Database

- Implement DB path resolution.
- Implement DB directory creation.
- Implement schema initialization.
- Implement session/checkpoint/decision CRUD helpers.

## Step 3 — Time utilities

- Implement `nowInTimezone`.
- Implement `parseDeadline`.
- Implement elapsed/remaining calculations.
- Add tests.

## Step 4 — Policy engine

- Implement continuation policy as pure functions.
- Add tests.
- Keep the policy deterministic and easy to inspect.

## Step 5 — Ranking engine

- Implement `rankCandidateTasks`.
- Add tests.
- Keep scoring simple and explainable.

## Step 6 — Tools

Implement tools:

```txt
owlyn_start
owlyn_status
owlyn_checkpoint
owlyn_should_continue
owlyn_plan_next
owlyn_end
owlyn_list_sessions
owlyn_report
```

## Step 7 — README

Write complete README.

## Step 8 — Validation

Run:

```txt
npm run typecheck
npm run build
npm test
```

Fix until green.

---

# 35. Policy engine details

Implement policy in `src/policy.ts`.

Suggested function:

```ts
type ContinuationInput = {
  mode: "focused" | "night_shift" | "marathon";
  sessionStatus: "active" | "completed" | "abandoned";
  deadlineReached: boolean;
  currentTaskDone: boolean;
  hasNextTasks: boolean;
  requiresUserApproval: boolean;
  destructiveActionPending: boolean;
  riskLevel: "low" | "medium" | "high";
  validationPassed?: boolean;
  remainingMinutes: number;
};

type ContinuationDecision = {
  shouldContinue: boolean;
  reason: string;
  recommendedAction: string;
  nextPolicy: string;
  safetyNotes: string[];
};
```

The function should be pure and tested.

Pseudo-logic:

```txt
if session inactive:
  stop

if deadline reached:
  stop

if requires user approval:
  stop

if destructive action pending:
  stop

if risk high:
  stop or recommend switching to low-risk validation/docs only

if mode focused:
  if current task done:
    stop
  else:
    continue current task

if mode night_shift:
  if has next tasks:
    continue
  else:
    stop

if mode marathon:
  if risk low or medium:
    continue carefully
  else:
    stop
```

Do not overcomplicate.

---

# 36. Ranking engine details

Implement ranking in `src/ranking.ts`.

Candidate tasks should be ranked by:

```txt
impact
risk
estimated duration
approval requirement
remaining time
category
```

Use deterministic scoring.

Always return reasons.

Reject tasks requiring approval.

Reject destructive tasks if represented by category or description.

Deprioritize tasks estimated longer than remaining time.

Prefer safe validation/documentation/cleanup late in the session.

---

# 37. Reports

Implement report generation in `src/report.ts`.

Reports should aggregate:

- session metadata
- checkpoint timeline
- continuation decision timeline
- completed tasks
- latest next tasks
- latest blockers
- validation results
- elapsed/remaining time

Do not generate overly verbose prose by default.  
Return structured data.

---

# 38. Data privacy

Owlyn stores only what the agent sends to it:

- session goals
- checkpoints
- files changed
- validation notes
- task lists
- decisions

Document that users should not store secrets in checkpoint summaries.

Do not inspect project files.  
Do not collect environment data.  
Do not transmit anything.

---

# 39. Security posture

Owlyn is local-only.

No network.

No telemetry.

No shell execution.

No file editing except its own SQLite DB.

No credentials.

No destructive operations.

No automatic background loop.

---

# 40. Future roadmap — document only, do not implement

Add a README roadmap section:

```txt
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
```

Do not implement these in v0.1.

---

# 41. Development rules

- Keep the MVP focused.
- Do not add UI.
- Do not add a web server.
- Do not add background scheduling.
- Do not add cloud.
- Do not add telemetry.
- Do not make tool responses vague.
- Do not bury the continuation decision.
- Do not continue destructive or approval-requiring work.
- Do not over-engineer.

Good enough means:

```txt
Works locally.
Persists sessions.
Provides useful tool decisions.
Has tests.
Has README.
Can be connected to an MCP host.
```

---

# 42. Final response after implementation

When done, respond with:

```txt
Summary
- what was built

Files created/changed
- list

Commands run
- npm install
- npm run typecheck
- npm run build
- npm test

Results
- typecheck result
- build result
- test result

How to run
- command

Example MCP config
- JSON snippet

Limitations
- honest notes

Next recommended milestone
- one short recommendation
```

Do not claim success if commands failed.  
If something failed, explain exactly what failed and what to do next.

---

# 43. Absolute success condition

Owlyn MCP is successful when an agent can do this:

```txt
1. Start a session until 06:00.
2. Finish the first task at 00:30.
3. Save a checkpoint.
4. Ask Owlyn whether to continue.
5. Receive should_continue: true.
6. Continue with safe next work instead of stopping.
7. Stop only when the deadline is reached, approval is required, risk is too high, or no safe next tasks remain.
```

That is the heart of Owlyn.

Build that first.
