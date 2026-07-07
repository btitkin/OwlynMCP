import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { getDefaultEnvironment, StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const smokeDir = mkdtempSync(path.join(os.tmpdir(), "owlyn-mcp-smoke-"));
const dbPath = process.env.OWLYN_DB_PATH || path.join(smokeDir, "owlyn.sqlite");

const serverCommand = process.env.OWLYN_SMOKE_COMMAND || process.execPath;
const serverArgs = process.env.OWLYN_SMOKE_ARGS
  ? JSON.parse(process.env.OWLYN_SMOKE_ARGS)
  : [path.join(root, "dist", "index.js")];

const client = new Client({
  name: "owlyn-mcp-smoke",
  version: "0.0.0",
});

function requireStructured(name, result) {
  if (result.isError) {
    throw new Error(`${name} returned an MCP error: ${JSON.stringify(result.content)}`);
  }

  if (!result.structuredContent?.data || !result.structuredContent?.instruction) {
    throw new Error(`${name} did not return valid structuredContent.`);
  }

  return result.structuredContent.data;
}

try {
  await client.connect(
    new StdioClientTransport({
      command: serverCommand,
      args: serverArgs,
      cwd: root,
      env: {
        ...getDefaultEnvironment(),
        OWLYN_DB_PATH: dbPath,
      },
      stderr: "inherit",
    }),
  );

  const start = requireStructured(
    "owlyn_start",
    await client.callTool({
      name: "owlyn_start",
      arguments: {
        goal: "Manual Owlyn smoke test",
        deadline: "06:00",
        timezone: "Europe/Warsaw",
        mode: "night_shift",
        force_new: true,
      },
    }),
  );
  const sessionId = start.session_id;

  requireStructured(
    "owlyn_checkpoint",
    await client.callTool({
      name: "owlyn_checkpoint",
      arguments: {
        session_id: sessionId,
        summary: "Manual smoke checkpoint saved.",
        completed_tasks: ["Started a session through the SDK client"],
        next_tasks: ["Ask whether to continue", "Rank the next task", "End the session"],
        blockers: [],
        files_changed: [],
        validation_results: ["MCP SDK client connected"],
        confidence: "high",
        risk_level: "low",
      },
    }),
  );

  const decision = requireStructured(
    "owlyn_should_continue",
    await client.callTool({
      name: "owlyn_should_continue",
      arguments: {
        session_id: sessionId,
        current_task_done: true,
        has_next_tasks: true,
        requires_user_approval: false,
        risk_level: "low",
        destructive_action_pending: false,
        validation_passed: true,
      },
    }),
  );

  if (decision.should_continue !== true) {
    throw new Error(`Expected owlyn_should_continue to return true, got: ${JSON.stringify(decision)}`);
  }

  requireStructured(
    "owlyn_plan_next",
    await client.callTool({
      name: "owlyn_plan_next",
      arguments: {
        session_id: sessionId,
        candidate_tasks: [
          {
            title: "Review release checklist",
            impact: "high",
            risk: "low",
            estimated_minutes: 10,
            category: "validation",
          },
          {
            title: "Deploy package",
            impact: "high",
            risk: "medium",
            estimated_minutes: 30,
            category: "deploy",
          },
        ],
      },
    }),
  );

  requireStructured(
    "owlyn_end",
    await client.callTool({
      name: "owlyn_end",
      arguments: {
        session_id: sessionId,
        final_summary: "Manual MCP smoke test completed.",
        remaining_tasks: [],
        validation_results: ["owlyn_start, owlyn_checkpoint, owlyn_should_continue, owlyn_plan_next, and owlyn_end passed"],
        status: "completed",
      },
    }),
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        db_path: dbPath,
        session_id: sessionId,
        checked_tools: [
          "owlyn_start",
          "owlyn_checkpoint",
          "owlyn_should_continue",
          "owlyn_plan_next",
          "owlyn_end",
        ],
      },
      null,
      2,
    ),
  );
} finally {
  await client.close();
  if (!process.env.OWLYN_DB_PATH) {
    rmSync(smokeDir, { recursive: true, force: true });
  }
}
