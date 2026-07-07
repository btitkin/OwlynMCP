# Contributing

Thanks for helping improve Owlyn MCP.

## Requirements

- Node.js 20+
- npm

## Local Setup

```bash
npm install
npm run typecheck
npm run build
npm test
npm run smoke:mcp
```

If available, run the full check command:

```bash
npm run check
```

## Scope

Owlyn v0.1 is a local-first stdio MCP server. Avoid adding cloud services, network calls, telemetry, auth, hosted infrastructure, background workers, or broad product scope without opening a discussion first.

Keep changes focused, tested, and aligned with the existing MCP tool behavior.
