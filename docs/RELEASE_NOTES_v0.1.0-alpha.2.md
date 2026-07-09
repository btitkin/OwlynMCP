# Owlyn MCP v0.1.0-alpha.2

Owlyn MCP — Time-aware work sessions for AI agents.

This alpha focuses on public presentation, GitHub CI, documentation, roadmap clarity, and npm publishing preparation.

## Added

- GitHub Actions CI for Node.js 20
- README badges:
  - CI
  - release
  - license
  - Node.js 20+
- Public documentation:
  - docs/NPM_PUBLISHING.md
  - docs/ROADMAP.md
  - docs/SOCIAL_POST.md
  - docs/FAQ.md
- README links to public docs
- Development command documentation

## Validation

- Remote GitHub Actions CI passed:
  https://github.com/btitkin/OwlynMCP/actions/runs/29006189152
- npm run check passed
- npm pack --dry-run passed
- Codex MCP host validation from v0.1.0-alpha.1 remains recorded

## Runtime changes

None.

This release does not change Owlyn MCP runtime behavior. It is a presentation, documentation, CI, and release-readiness update.

## Known limitations

- Codex MCP host on Windows is validated.
- Other hosts are still pending validation.
- Owlyn does not keep an MCP host alive by itself.
- The host agent must call Owlyn tools and follow the returned policy.
- npm publishing is documented but not performed in this release.
