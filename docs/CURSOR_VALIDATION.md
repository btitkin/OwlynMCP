# Cursor Validation

Status: Pending validation.

Do not mark Cursor as supported until this flow is completed in Cursor and recorded in [REAL_HOST_VALIDATION.md](./REAL_HOST_VALIDATION.md).

## Expected MCP Config Shape

Cursor MCP configuration usually follows the `mcpServers` object shape. Exact file locations and reload behavior may vary by Cursor version.

## Windows Example

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["C:\\Users\\you\\Projects\\OwlynMCP\\dist\\index.js"],
      "env": {
        "OWLYN_DB_PATH": "C:\\Users\\you\\.owlyn\\cursor-validation.sqlite"
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
        "OWLYN_DB_PATH": "/Users/you/.owlyn/cursor-validation.sqlite"
      }
    }
  }
}
```

## Validation Prompt

Use [VALIDATION_PROMPT.md](./VALIDATION_PROMPT.md).

## Expected Results

- Cursor starts Owlyn MCP over stdio.
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
- Run `npm install` and `npm run build` before starting the host.
- Set `OWLYN_DB_PATH` to a writable local path.
- Restart or reload Cursor after changing MCP configuration.
