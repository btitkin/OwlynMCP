import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { DateTime } from "luxon";
import { afterEach, describe, expect, it } from "vitest";
import { OwlynDb } from "../src/db.js";
import { toIso } from "../src/time.js";

const tempDirs: string[] = [];

function tempDb(): OwlynDb {
  const dir = mkdtempSync(path.join(os.tmpdir(), "owlyn-db-"));
  tempDirs.push(dir);
  return new OwlynDb(path.join(dir, "owlyn.sqlite"));
}

function createSession(db: OwlynDb, id = "owl_test") {
  const now = DateTime.fromISO("2026-07-07T23:00:00+02:00").setZone("Europe/Warsaw");
  return db.createSession({
    id,
    goal: "Test Owlyn",
    mode: "night_shift",
    timezone: "Europe/Warsaw",
    startedAt: toIso(now),
    deadlineAt: toIso(now.plus({ hours: 2 })),
    createdAt: toIso(now),
  });
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("database", () => {
  it("initializes", () => {
    const db = tempDb();
    expect(db.path).toContain("owlyn.sqlite");
    db.close();
  });

  it("session persists", () => {
    const db = tempDb();
    const session = createSession(db);

    expect(db.getSession(session.id)?.goal).toBe("Test Owlyn");
    db.close();
  });

  it("checkpoint persists", () => {
    const db = tempDb();
    const session = createSession(db);
    const checkpoint = db.insertCheckpoint({
      id: "chk_test",
      sessionId: session.id,
      createdAt: session.startedAt,
      summary: "Saved checkpoint",
      completedTasks: ["Implemented DB"],
      nextTasks: ["Test DB"],
      blockers: [],
      filesChanged: ["src/db.ts"],
      validationResults: ["unit test"],
      confidence: "high",
      riskLevel: "low",
    });

    expect(db.getCheckpoint(checkpoint.id)?.completedTasks).toEqual(["Implemented DB"]);
    db.close();
  });

  it("decision persists", () => {
    const db = tempDb();
    const session = createSession(db);
    const decision = db.insertDecision({
      id: "dec_test",
      sessionId: session.id,
      createdAt: session.startedAt,
      shouldContinue: true,
      reason: "Safe next tasks exist.",
      recommendedAction: "Continue.",
      policy: { mode: "night_shift" },
    });

    expect(db.getDecision(decision.id)?.shouldContinue).toBe(true);
    db.close();
  });

  it("latest active session resolves", () => {
    const db = tempDb();
    createSession(db, "owl_a");
    createSession(db, "owl_b");

    expect(db.getLatestActiveSession()?.id).toBe("owl_b");
    db.close();
  });

  it("completed session is not treated as active", () => {
    const db = tempDb();
    const session = createSession(db);
    db.endSession(session.id, "completed", "Done", session.deadlineAt);

    expect(db.getLatestActiveSession()).toBeNull();
    db.close();
  });

  it("list sessions works", () => {
    const db = tempDb();
    createSession(db, "owl_list");

    expect(db.listSessions("all", 20)).toHaveLength(1);
    db.close();
  });
});
