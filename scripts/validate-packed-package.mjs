import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { getDefaultEnvironment, StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { existsSync, mkdtempSync, readFileSync, rmSync, unlinkSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const tempDir = mkdtempSync(path.join(os.tmpdir(), "owlyn-packed-install-"));
const dbPath = path.join(tempDir, "owlyn.sqlite");
const expectedTools = [
  "owlyn_start",
  "owlyn_status",
  "owlyn_checkpoint",
  "owlyn_should_continue",
  "owlyn_plan_next",
  "owlyn_end",
  "owlyn_list_sessions",
  "owlyn_report",
];

let tarballPath;
let client;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || root,
    encoding: "utf8",
    shell: process.platform === "win32",
    stdio: options.stdio || "pipe",
  });

  if (result.status !== 0) {
    throw new Error(
      [
        `Command failed: ${command} ${args.join(" ")}`,
        result.stdout?.trim(),
        result.stderr?.trim(),
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  return result;
}

function requirePath(filePath, label) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing ${label}: ${filePath}`);
  }
}

try {
  const pack = run("npm", ["pack", "--json"]);
  const packResult = JSON.parse(pack.stdout);
  const tarball = packResult[0];

  if (!tarball?.filename) {
    throw new Error(`Could not read npm pack output: ${pack.stdout}`);
  }

  tarballPath = path.join(root, tarball.filename);

  run("npm", ["init", "-y"], { cwd: tempDir });
  run("npm", ["install", tarballPath], { cwd: tempDir });

  const installedRoot = path.join(tempDir, "node_modules", "owlyn-mcp");
  const installedPackageJson = path.join(installedRoot, "package.json");
  const installedServer = path.join(installedRoot, "dist", "index.js");

  requirePath(installedPackageJson, "installed package.json");
  requirePath(installedServer, "installed dist/index.js");
  requirePath(path.join(installedRoot, "README.md"), "installed README.md");
  requirePath(path.join(installedRoot, "LICENSE"), "installed LICENSE");
  requirePath(path.join(installedRoot, "CHANGELOG.md"), "installed CHANGELOG.md");
  requirePath(path.join(installedRoot, "Owlyn.png"), "installed Owlyn.png");

  const packageJson = JSON.parse(readFileSync(installedPackageJson, "utf8"));

  if (packageJson.name !== "owlyn-mcp") {
    throw new Error(`Unexpected package name: ${packageJson.name}`);
  }

  if (packageJson.bin?.["owlyn-mcp"] !== "./dist/index.js") {
    throw new Error(`Unexpected bin entry: ${JSON.stringify(packageJson.bin)}`);
  }

  client = new Client({
    name: "owlyn-packed-package-validation",
    version: "0.0.0",
  });

  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [installedServer],
      cwd: installedRoot,
      env: {
        ...getDefaultEnvironment(),
        OWLYN_DB_PATH: dbPath,
      },
      stderr: "pipe",
    }),
  );

  const listedTools = await client.listTools();
  const toolNames = listedTools.tools.map((tool) => tool.name).sort();
  const missingTools = expectedTools.filter((tool) => !toolNames.includes(tool));

  if (missingTools.length > 0) {
    throw new Error(`Installed package MCP server is missing tools: ${missingTools.join(", ")}`);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        package_name: packageJson.name,
        tarball: tarball.filename,
        package_size_bytes: tarball.size,
        unpacked_size_bytes: tarball.unpackedSize,
        file_count: tarball.files?.length,
        temp_dir: tempDir,
        installed_server: installedServer,
        checked_tools: expectedTools,
      },
      null,
      2,
    ),
  );
} finally {
  if (client) {
    await client.close();
  }

  if (tarballPath) {
    unlinkSync(tarballPath);
  }

  if (process.env.OWLYN_KEEP_PACK_VALIDATION_DIR !== "1") {
    rmSync(tempDir, { recursive: true, force: true });
  } else {
    console.error(`Kept packed-package validation directory: ${tempDir}`);
  }
}
