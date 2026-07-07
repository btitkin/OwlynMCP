import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { OwlynDb } from "./db.js";
import { toClientError } from "./errors.js";
import {
  checkpointInputSchema,
  endInputSchema,
  listSessionsInputSchema,
  planNextInputSchema,
  reportInputSchema,
  shouldContinueInputSchema,
  startInputSchema,
  statusInputSchema,
} from "./schemas.js";
import { handleCheckpoint } from "./tools/checkpoint.js";
import type { ToolEnvelope } from "./tools/common.js";
import { handleEnd } from "./tools/end.js";
import { handleListSessions } from "./tools/listSessions.js";
import { handlePlanNext } from "./tools/planNext.js";
import { handleReport } from "./tools/reportSession.js";
import { handleShouldContinue } from "./tools/shouldContinue.js";
import { handleStart } from "./tools/start.js";
import { handleStatus } from "./tools/status.js";

function toolResult(envelope: ToolEnvelope): CallToolResult {
  return {
    structuredContent: envelope,
    content: [
      {
        type: "text",
        text: JSON.stringify(envelope, null, 2),
      },
    ],
  };
}

function toolError(error: unknown): CallToolResult {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: toClientError(error).message,
      },
    ],
  };
}

function safeTool<TArgs>(handler: (args: TArgs) => ToolEnvelope) {
  return async (args: TArgs): Promise<CallToolResult> => {
    try {
      return toolResult(handler(args));
    } catch (error) {
      return toolError(error);
    }
  };
}

export function createOwlynServer(db: OwlynDb): McpServer {
  const server = new McpServer({
    name: "owlyn-mcp",
    version: "0.1.0",
  });

  server.registerTool(
    "owlyn_start",
    {
      title: "Start Owlyn work session",
      description: "Start a work session with a goal, deadline, timezone, and continuation mode.",
      inputSchema: startInputSchema,
    },
    safeTool((args) => handleStart(db, args)),
  );

  server.registerTool(
    "owlyn_status",
    {
      title: "Get Owlyn session status",
      description: "Return current time, elapsed time, remaining time, deadline status, and latest checkpoint state.",
      inputSchema: statusInputSchema,
    },
    safeTool((args) => handleStatus(db, args)),
  );

  server.registerTool(
    "owlyn_checkpoint",
    {
      title: "Save Owlyn checkpoint",
      description: "Save meaningful progress, completed tasks, next tasks, blockers, changed files, validation, and risk.",
      inputSchema: checkpointInputSchema,
    },
    safeTool((args) => handleCheckpoint(db, args)),
  );

  server.registerTool(
    "owlyn_should_continue",
    {
      title: "Decide whether to continue",
      description: "Return a structured continuation decision using deadline, mode, risk, approval, and next-task state.",
      inputSchema: shouldContinueInputSchema,
    },
    safeTool((args) => handleShouldContinue(db, args)),
  );

  server.registerTool(
    "owlyn_plan_next",
    {
      title: "Rank next tasks",
      description: "Rank candidate next tasks by impact, risk, approval requirement, fit to remaining time, and category.",
      inputSchema: planNextInputSchema,
    },
    safeTool((args) => handlePlanNext(db, args)),
  );

  server.registerTool(
    "owlyn_end",
    {
      title: "End Owlyn session",
      description: "End a session, mark it completed or abandoned, and return a final structured report.",
      inputSchema: endInputSchema,
    },
    safeTool((args) => handleEnd(db, args)),
  );

  server.registerTool(
    "owlyn_list_sessions",
    {
      title: "List Owlyn sessions",
      description: "List active, completed, abandoned, or all previous sessions.",
      inputSchema: listSessionsInputSchema,
    },
    safeTool((args) => handleListSessions(db, args)),
  );

  server.registerTool(
    "owlyn_report",
    {
      title: "Report Owlyn session",
      description: "Return a detailed session report without ending the session.",
      inputSchema: reportInputSchema,
    },
    safeTool((args) => handleReport(db, args)),
  );

  return server;
}

export async function startStdioServer(db: OwlynDb): Promise<void> {
  const server = createOwlynServer(db);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
