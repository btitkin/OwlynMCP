# Host Setup

Owlyn MCP runs as a stdio MCP server. Exact config file locations and supported fields vary by host, so treat these examples as starting points and check your host documentation.

Build first:

```bash
npm install
npm run build
```

## Generic stdio MCP Config

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

## Windows Path Example

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

## macOS/Linux Path Example

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

## Codex-Style Config

Use the generic stdio config shape if your Codex environment supports MCP server entries. Prefer an absolute path to `dist/index.js`.

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["/absolute/path/to/OwlynMCP/dist/index.js"]
    }
  }
}
```

## Cursor-Style Config

Cursor MCP configuration usually follows the `mcpServers` object shape. File locations and UI settings may vary by Cursor version.

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

## Claude Desktop-Style Config

Claude Desktop MCP configuration usually uses a `claude_desktop_config.json` file with an `mcpServers` object. Exact file location depends on OS and Claude Desktop version.

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

## Development Mode

For local development only:

```json
{
  "mcpServers": {
    "owlyn-dev": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "/absolute/path/to/OwlynMCP"
    }
  }
}
```

Only use `cwd` if your host supports it.
