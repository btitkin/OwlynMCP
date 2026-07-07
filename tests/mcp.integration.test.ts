import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { getDefaultEnvironment, StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const tempDirs: string[] = [];

function tempDbPath(): string {
  const dir = mkdtempSync(path.join(os.tmpdir(), "owlyn-mcp-sdk-"));
  tempDirs.push(dir);
  return path.join(dir, "owlyn.sqlite");
}

function structured(result: CallToolResult) {
  expect(result.isError).not.toBe(true);
  expect(result.structuredContent).toBeDefined();
  expect(result.structuredContent).toHaveProperty("data");
  expect(result.structuredContent).toHaveProperty("instruction");
  return result.structuredContent as {
    data: Record<string, unknown>;
    instruction: string;
    safety?: string;
  };
}

async function createClient(dbPath: string) {
  const client = new Client({
    name: "owlyn-mcp-integration-test",
    version: "0.0.0",
  });

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.join(process.cwd(), "node_modules", "tsx", "dist", "cli.mjs"), "src/index.ts"],
    cwd: process.cwd(),
    env: {
      ...getDefaultEnvironment(),
      OWLYN_DB_PATH: dbPath,
    },
    stderr: "pipe",
  });

  await client.connect(transport);
  return client;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("MCP SDK integration", () => {
  it("calls every exposed tool through the SDK client and receives structuredContent", async () => {
    const client = await createClient(tempDbPath());

    try {
      const tools = await client.listTools();
      expect(tools.tools.map((tool) => tool.name).sort()).toEqual([
        "owlyn_checkpoint",
        "owlyn_end",
        "owlyn_list_sessions",
        "owlyn_plan_next",
        "owlyn_report",
        "owlyn_should_continue",
        "owlyn_start",
        "owlyn_status",
      ]);

      const start = structured(
        await client.callTool({
          name: "owlyn_start",
          arguments: {
            goal: "SDK integration test session",
            deadline: "06:00",
            timezone: "Europe/Warsaw",
            mode: "night_shift",
            force_new: true,
          },
        }),
      );
      const sessionId = String(start.data.session_id);
      expect(start.data.initial_instruction).toContain(
        "Do not stop only because the first task is complete if Owlyn says to continue.",
      );

      const status = structured(
        await client.callTool({
          name: "owlyn_status",
          arguments: { session_id: sessionId },
        }),
      );
      expect(status.data.session_id).toBe(sessionId);

      const checkpoint = structured(
        await client.callTool({
          name: "owlyn_checkpoint",
          arguments: {
            session_id: sessionId,
            summary: "Saved SDK integration checkpoint.",
            completed_tasks: ["Started SDK-backed session"],
            next_tasks: ["Rank next task", "End session"],
            blockers: [],
            files_changed: ["tests/mcp.integration.test.ts"],
            validation_results: ["SDK client connected"],
            confidence: "high",
            risk_level: "low",
          },
        }),
      );
      expect(checkpoint.data.checkpoint_id).toMatch(/^chk_/);

      const shouldContinue = structured(
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
      expect(shouldContinue.data.should_continue).toBe(true);
      expect(shouldContinue.data.recommended_action).toContain("Do not stop only because the current task is complete.");

      const planNext = structured(
        await client.callTool({
          name: "owlyn_plan_next",
          arguments: {
            session_id: sessionId,
            candidate_tasks: [
              {
                title: "Add integration test coverage",
                impact: "high",
                risk: "low",
                estimated_minutes: 15,
                category: "tests",
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
      expect(planNext.data.recommended_task).toMatchObject({ title: "Add integration test coverage" });

      const report = structured(
        await client.callTool({
          name: "owlyn_report",
          arguments: { session_id: sessionId },
        }),
      );
      expect(report.data.checkpoint_count).toBe(1);

      const listSessions = structured(
        await client.callTool({
          name: "owlyn_list_sessions",
          arguments: { status: "all", limit: 10 },
        }),
      );
      expect(Array.isArray(listSessions.data.sessions)).toBe(true);

      const end = structured(
        await client.callTool({
          name: "owlyn_end",
          arguments: {
            session_id: sessionId,
            final_summary: "SDK integration test completed.",
            remaining_tasks: [],
            validation_results: ["SDK integration flow passed"],
            status: "completed",
          },
        }),
      );
      expect(end.data.session_id).toBe(sessionId);
      expect(end.data.final_recommendation).toBe(
        "Session completed. Summarize changes to the user and mention remaining tasks.",
      );
    } finally {
      await client.close();
    }
  });
});
