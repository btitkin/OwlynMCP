# Claude Desktop Validation

Status: Pending validation.

Do not mark Claude Desktop as supported until this flow is completed in Claude Desktop and recorded in [REAL_HOST_VALIDATION.md](./REAL_HOST_VALIDATION.md).

## Expected MCP Config Shape

Claude Desktop MCP configuration usually uses a `claude_desktop_config.json` file with an `mcpServers` object. Exact file location depends on OS and Claude Desktop version.

## Windows Example

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["C:\\Users\\you\\Projects\\OwlynMCP\\dist\\index.js"],
      "env": {
        "OWLYN_DB_PATH": "C:\\Users\\you\\.owlyn\\claude-desktop-validation.sqlite"
      }
    }
  }
}
```

## macOS/Linux Example

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["/Users/you/projects/OwlynMCP/dist/index.js"],
      "env": {
        "OWLYN_DB_PATH": "/Users/you/.owlyn/claude-desktop-validation.sqlite"
      }
    }
  }
}
```

## Validation Prompt

Use [VALIDATION_PROMPT.md](./VALIDATION_PROMPT.md).

## Expected Results

- Claude Desktop starts Owlyn MCP over stdio.
- All 8 Owlyn tools are visible.
- `owlyn_start` works.
- `owlyn_checkpoint` works.
- `owlyn_should_continue` returns `should_continue: true`.
- The required continuation phrase appears.
- structuredContent is available.
- `owlyn_plan_next` works.
- `owlyn_end` works.

## Troubleshooting

- Confirm Node.js 20+ is installed and available as `node`.
- Use an absolute path to `dist/index.js`.
- Run `npm install` and `npm run build` before starting Claude Desktop.
- Set `OWLYN_DB_PATH` to a writable local path.
- Restart Claude Desktop after changing MCP configuration.
