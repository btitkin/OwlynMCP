# FAQ

## Is Owlyn a timer?

No. Owlyn MCP is not a simple timer. It is a local-first MCP work-session supervisor for AI agents. It tracks session state, deadlines, checkpoints, continuation decisions, and safe next-task planning.

## Does Owlyn keep agents alive by itself?

No. Owlyn does not keep an MCP host or model running. The host agent must call Owlyn tools and follow the returned policy.

## Does Owlyn run in the background?

No. Owlyn v0.1 does not include a background autonomous worker, daemon, scheduler, web server, or dashboard.

## Does Owlyn send data anywhere?

No. Owlyn is local-first. It stores session data in a local SQLite database and does not include cloud sync, telemetry, analytics, or network calls.

## Does Owlyn work with Codex?

Yes. Owlyn MCP has been validated in the Codex MCP host on Windows.

## Does Owlyn work with Cursor or Claude Desktop?

Cursor and Claude Desktop validation are still pending. Do not assume support until those hosts are tested and recorded in `docs/REAL_HOST_VALIDATION.md`.

## Where is data stored?

By default:

```txt
~/.owlyn/owlyn.sqlite
```

Owlyn stores only what the agent sends to it, such as goals, checkpoints, next tasks, validation notes, and continuation decisions.

## Can I change the database path?

Yes. Set `OWLYN_DB_PATH`:

```bash
OWLYN_DB_PATH=/custom/path/owlyn.sqlite
```

On Windows:

```powershell
$env:OWLYN_DB_PATH="C:\Users\you\.owlyn\owlyn.sqlite"
```
