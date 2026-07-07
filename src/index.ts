#!/usr/bin/env node
import { OwlynDb } from "./db.js";
import { startStdioServer } from "./server.js";

const db = new OwlynDb();

process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  db.close();
  process.exit(0);
});

try {
  await startStdioServer(db);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown Owlyn startup error.";
  console.error(`Owlyn MCP failed to start: ${message}`);
  db.close();
  process.exit(1);
}
