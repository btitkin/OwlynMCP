# Package Install Validation

## Goal

Validate that Owlyn MCP works from the packed npm package tarball, not only from a source repository checkout.

## Why This Matters

Before publishing to npm, the package must prove that its published file set is complete enough for a real MCP host. Source-tree validation can pass even when the package tarball is missing `dist/`, metadata, docs, assets, or the runnable entry point.

Expected package name:
`owlyn-mcp`

Expected tarball:
`owlyn-mcp-0.1.0.tgz`

## Expected Tools

The installed package should expose all 8 Owlyn MCP tools:

- `owlyn_start`
- `owlyn_status`
- `owlyn_checkpoint`
- `owlyn_should_continue`
- `owlyn_plan_next`
- `owlyn_end`
- `owlyn_list_sessions`
- `owlyn_report`

## Temporary Test Directory Approach

Use a temporary directory outside the source repository, install the packed tarball there, and point the MCP host at the installed package path. Use a temporary SQLite database path so validation does not modify normal working-session data.

## Windows PowerShell

From the repository root:

```powershell
npm run check
npm pack

$testDir = Join-Path $env:TEMP "owlyn-packed-install"
Remove-Item -Recurse -Force $testDir -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $testDir | Out-Null

Push-Location $testDir
npm init -y
npm install "C:\absolute\path\to\OwlynMCP\owlyn-mcp-0.1.0.tgz"

$env:OWLYN_DB_PATH = Join-Path $testDir "owlyn.sqlite"
node ".\node_modules\owlyn-mcp\dist\index.js"
Pop-Location
```

Replace `C:\absolute\path\to\OwlynMCP` with the local repository path.

## macOS/Linux

From the repository root:

```bash
npm run check
npm pack

test_dir="$(mktemp -d)"
cd "$test_dir"
npm init -y
npm install "/absolute/path/to/OwlynMCP/owlyn-mcp-0.1.0.tgz"

export OWLYN_DB_PATH="$test_dir/owlyn.sqlite"
node "./node_modules/owlyn-mcp/dist/index.js"
```

Replace `/absolute/path/to/OwlynMCP` with the local repository path.

## Automated Local Validation

Run:

```bash
npm run validate:pack
```

This script:

- creates a temporary npm project
- runs `npm pack`
- installs the generated tarball
- verifies expected package files
- verifies the `owlyn-mcp` bin entry
- verifies `dist/index.js`
- starts the installed MCP server
- confirms all 8 tools are exposed

Set `OWLYN_KEEP_PACK_VALIDATION_DIR=1` to keep the temporary directory for inspection.

## Codex MCP Host Config for Packed Install

After installing the tarball into a temporary project, point Codex at the installed server path:

```json
{
  "mcpServers": {
    "owlyn": {
      "command": "node",
      "args": [
        "C:/Users/example/AppData/Local/Temp/owlyn-packed-install/node_modules/owlyn-mcp/dist/index.js"
      ],
      "env": {
        "OWLYN_DB_PATH": "C:/Users/example/AppData/Local/Temp/owlyn-packed-install/owlyn.sqlite"
      }
    }
  }
}
```

On macOS/Linux, use the equivalent absolute path under the temporary test directory.

Expected result in Codex:

- all 8 tools are visible
- `owlyn_list_sessions` works
- `owlyn_start` can start a session
- `owlyn_checkpoint` can save progress
- `owlyn_should_continue` returns a structured continuation decision
- `owlyn_end` can complete the session

## Cleanup

Remove the temporary test directory and the generated tarball when validation is complete.
