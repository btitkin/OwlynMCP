# npm Publishing

Owlyn MCP is not published to npm yet.

Do not publish without explicit release-owner approval.

## Requirements

- npm account with publish rights for `owlyn-mcp`
- Node.js 20+
- clean Git working tree
- passing validation

## Login

```bash
npm login
```

Check the active account:

```bash
npm whoami
```

## Verify Package Contents

Run:

```bash
npm run check
npm pack --dry-run
npm run validate:pack
```

Review the `npm notice Tarball Contents` output. The package should include:

- `dist/`
- `scripts/`
- `docs/`
- `README.md`
- `LICENSE`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `Owlyn.png`
- `package.json`

It should not include:

- `node_modules/`
- local SQLite databases
- temporary validation databases
- unpublished secrets or credentials
- unrelated project files

## Required Pre-Publish Checklist

Before publishing, complete all of these checks:

- run `npm run check`
- run `npm pack --dry-run`
- run `npm run validate:pack`
- inspect package contents from `npm pack --dry-run`
- install the packed tarball in a temporary directory
- verify the MCP server starts from the packed install
- verify Codex can see all 8 tools when pointed at the packed install path
- publish only after explicit release-owner approval

See [PACKAGE_INSTALL_VALIDATION.md](./PACKAGE_INSTALL_VALIDATION.md) for the full packed-package validation flow.

## Publish

Only run this after explicit approval:

```bash
npm publish --access public
```

## Verify After Publish

After publishing, verify:

```bash
npm view owlyn-mcp
npm view owlyn-mcp version
```

Then test installation from a temporary directory before documenting npm install as generally available.
