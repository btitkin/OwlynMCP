# Changelog

## v0.1.0-alpha.3

### Added

- Codex-first validation documentation updates.
- Final Codex restart/reload validation results.
- Persistent `OWLYN_DB_PATH` validation results.

### Validation

- Extended Codex MCP host validation passed on Windows.
- All 8 Owlyn tools were visible.
- structuredContent worked.
- Continuation behavior passed.
- Approval, destructive, and high-risk safety gates passed.
- Focused, night_shift, and marathon mode behavior passed.
- Deadline-reached behavior passed.
- Task ranking passed.
- Report/end flow passed.
- Restart/reload behavior passed.
- Persistent configured database path behavior passed.

### Runtime

- No runtime behavior changes.

## v0.1.0-alpha.2

### Added

- GitHub Actions CI for Node.js 20.
- README badges for CI, release, license, and Node.js 20+.
- NPM publishing preparation docs.
- Roadmap documentation.
- FAQ documentation.
- Social post draft documentation.

### Changed

- Improved README public presentation and documentation links.

### Validation

- Remote GitHub Actions CI passed.
- npm run check passed.
- npm pack --dry-run passed.

### Runtime

- No runtime behavior changes.

## v0.1.0-alpha.1

Initial public alpha release:

- local stdio MCP server
- SQLite persistence
- Zod validation
- deadline/time handling
- checkpoints
- continuation policy
- task ranking
- session reports
- SDK MCP integration test
- manual MCP smoke script
- release checklist
