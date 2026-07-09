# Host Setup

Owlyn MCP runs as a stdio MCP server. Exact config file locations and supported fields vary by host, so treat these examples as starting points and check your host documentation.

Build first:

```bash
npm install
npm run build
```

## A. Generic stdio MCP Config

Use an absolute path to `dist/index.js`.

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

## B. Codex MCP Host on Windows

Status: validated on Windows.

Known working pattern:

```txt
command:
node

args:
C:\Users\btitk\Documents\OwlynMCP\dist\index.js

env:
OWLYN_DB_PATH=C:\Users\btitk\.owlyn\host-validation.sqlite

working directory:
C:\Users\btitk\Documents\OwlynMCP
```

JSON-style config shape:

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": ["C:\\Users\\btitk\\Documents\\OwlynMCP\\dist\\index.js"],
      "env": {
        "OWLYN_DB_PATH": "C:\\Users\\btitk\\.owlyn\\host-validation.sqlite"
      }
    }
  }
}
```

## C. Cursor

Status: pending validation.

Cursor MCP configuration usually follows the `mcpServers` object shape. File locations, UI settings, and reload behavior may vary by Cursor version.

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

See [CURSOR_VALIDATION.md](./CURSOR_VALIDATION.md).

## D. Claude Desktop

Status: pending validation.

Claude Desktop MCP configuration usually uses a `claude_desktop_config.json` file with an `mcpServers` object. Exact file location depends on OS and Claude Desktop version.

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

See [CLAUDE_DESKTOP_VALIDATION.md](./CLAUDE_DESKTOP_VALIDATION.md).

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
