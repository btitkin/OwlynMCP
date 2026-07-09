# Codex MCP Setup

Owlyn MCP is currently Codex-first. This guide documents the known working setup pattern for using Owlyn inside a Codex MCP host on Windows.

## Requirements

- Node.js 20+
- built Owlyn MCP project
- Codex MCP host with STDIO server support
- Windows tested

## Build

Run from the repository root:

```bash
npm install
npm run build
```

## Codex MCP Settings

Name:

```txt
owlyn
```

Type:

```txt
STDIO
```

Command:

```txt
node
```

Arguments:

```txt
C:\Users\btitk\Documents\OwlynMCP\dist\index.js
```

Environment variable:

```txt
OWLYN_DB_PATH=C:\Users\btitk\.owlyn\codex.sqlite
```

Working directory:

```txt
C:\Users\btitk\Documents\OwlynMCP
```

Alternative command if `node` is not found:

```txt
C:\Program Files\nodejs\node.exe
```

## Verify

Ask Codex to list Owlyn tools and confirm these 8 tools:

- owlyn_start
- owlyn_status
- owlyn_checkpoint
- owlyn_should_continue
- owlyn_plan_next
- owlyn_end
- owlyn_list_sessions
- owlyn_report

Then run the shared validation prompt in [VALIDATION_PROMPT.md](./VALIDATION_PROMPT.md).

## Troubleshooting

`node` not found:
Use the full Node.js executable path, such as `C:\Program Files\nodejs\node.exe`.

`dist/index.js` missing:
Run `npm run build`.

Forgot to run `npm run build`:
Build from the repository root before configuring Codex.

Wrong working directory:
Use `C:\Users\btitk\Documents\OwlynMCP`.

`OWLYN_DB_PATH` directory missing:
Owlyn creates the parent directory automatically, but the configured path must be valid and writable.

Tool list not refreshing:
Restart or reload the Codex MCP host after changing MCP configuration.

Stale session in database:
Use `owlyn_list_sessions` to inspect sessions, pass `force_new: true` to `owlyn_start`, or use a clean validation database path.

Invalid deadline format:
Use ISO datetime or `HH:mm`, for example `06:00`.
