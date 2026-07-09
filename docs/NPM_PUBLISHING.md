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
