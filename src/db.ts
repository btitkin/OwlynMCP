import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { OwlynError } from "./errors.js";
import type {
  Checkpoint,
  Confidence,
  ContinuationDecisionRecord,
  RiskLevel,
  Session,
  SessionStatus,
  WorkMode,
} from "./types.js";

type SessionRow = {
  id: string;
  goal: string;
  mode: WorkMode;
  timezone: string;
  started_at: string;
  deadline_at: string;
  status: SessionStatus;
  max_work_minutes: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  final_summary: string | null;
};

type CheckpointRow = {
  id: string;
  session_id: string;
  created_at: string;
  summary: string;
  completed_tasks_json: string;
  next_tasks_json: string;
  blockers_json: string;
  files_changed_json: string;
  validation_results_json: string;
  confidence: Confidence;
  risk_level: RiskLevel | null;
};

type DecisionRow = {
  id: string;
  session_id: string;
  created_at: string;
  should_continue: 0 | 1;
  reason: string;
  recommended_action: string;
  policy_json: string;
};

export type NewSession = {
  id: string;
  goal: string;
  mode: WorkMode;
  timezone: string;
  startedAt: string;
  deadlineAt: string;
  maxWorkMinutes?: number;
  notes?: string;
  createdAt: string;
};

export type NewCheckpoint = {
  id: string;
  sessionId: string;
  createdAt: string;
  summary: string;
  completedTasks: string[];
  nextTasks: string[];
  blockers: string[];
  filesChanged: string[];
  validationResults: string[];
  confidence: Confidence;
  riskLevel?: RiskLevel;
};

export type NewDecision = {
  id: string;
  sessionId: string;
  createdAt: string;
  shouldContinue: boolean;
  reason: string;
  recommendedAction: string;
  policy: Record<string, unknown>;
};

export function defaultDbPath(): string {
  return path.join(os.homedir(), ".owlyn", "owlyn.sqlite");
}

export function resolveDbPath(): string {
  return process.env.OWLYN_DB_PATH?.trim() || defaultDbPath();
}

function ensureParentDirectory(dbPath: string): void {
  mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
}

function parseJsonArray(value: string): string[] {
  const parsed = JSON.parse(value) as unknown;
  return Array.isArray(parsed) ? parsed.map(String) : [];
}

function sessionFromRow(row: SessionRow): Session {
  return {
    id: row.id,
    goal: row.goal,
    mode: row.mode,
    timezone: row.timezone,
    startedAt: row.started_at,
    deadlineAt: row.deadline_at,
    status: row.status,
    maxWorkMinutes: row.max_work_minutes,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    finalSummary: row.final_summary,
  };
}

function checkpointFromRow(row: CheckpointRow): Checkpoint {
  return {
    id: row.id,
    sessionId: row.session_id,
    createdAt: row.created_at,
    summary: row.summary,
    completedTasks: parseJsonArray(row.completed_tasks_json),
    nextTasks: parseJsonArray(row.next_tasks_json),
    blockers: parseJsonArray(row.blockers_json),
    filesChanged: parseJsonArray(row.files_changed_json),
    validationResults: parseJsonArray(row.validation_results_json),
    confidence: row.confidence,
    riskLevel: row.risk_level,
  };
}

function decisionFromRow(row: DecisionRow): ContinuationDecisionRecord {
  return {
    id: row.id,
    sessionId: row.session_id,
    createdAt: row.created_at,
    shouldContinue: row.should_continue === 1,
    reason: row.reason,
    recommendedAction: row.recommended_action,
    policy: JSON.parse(row.policy_json) as Record<string, unknown>,
  };
}

export class OwlynDb {
  readonly path: string;
  private readonly db: Database.Database;

  constructor(dbPath = resolveDbPath()) {
    this.path = dbPath;
    ensureParentDirectory(dbPath);
    this.db = new Database(dbPath);
    this.db.pragma("foreign_keys = ON");
    this.initialize();
  }

  close(): void {
    this.db.close();
  }

  initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        goal TEXT NOT NULL,
        mode TEXT NOT NULL,
        timezone TEXT NOT NULL,
        started_at TEXT NOT NULL,
        deadline_at TEXT NOT NULL,
        status TEXT NOT NULL,
        max_work_minutes INTEGER NULL,
        notes TEXT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        completed_at TEXT NULL,
        final_summary TEXT NULL
      );

      CREATE TABLE IF NOT EXISTS checkpoints (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        summary TEXT NOT NULL,
        completed_tasks_json TEXT NOT NULL,
        next_tasks_json TEXT NOT NULL,
        blockers_json TEXT NOT NULL,
        files_changed_json TEXT NOT NULL,
        validation_results_json TEXT NOT NULL,
        confidence TEXT NOT NULL,
        risk_level TEXT NULL,
        FOREIGN KEY(session_id) REFERENCES sessions(id)
      );

      CREATE TABLE IF NOT EXISTS continuation_decisions (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        should_continue INTEGER NOT NULL,
        reason TEXT NOT NULL,
        recommended_action TEXT NOT NULL,
        policy_json TEXT NOT NULL,
        FOREIGN KEY(session_id) REFERENCES sessions(id)
      );
    `);
  }

  createSession(input: NewSession): Session {
    this.db
      .prepare(
        `INSERT INTO sessions (
          id, goal, mode, timezone, started_at, deadline_at, status,
          max_work_minutes, notes, created_at, updated_at
        ) VALUES (
          @id, @goal, @mode, @timezone, @startedAt, @deadlineAt, 'active',
          @maxWorkMinutes, @notes, @createdAt, @createdAt
        )`,
      )
      .run({
        ...input,
        maxWorkMinutes: input.maxWorkMinutes ?? null,
        notes: input.notes ?? null,
      });

    const session = this.getSession(input.id);
    if (!session) {
      throw new OwlynError("Session was not created.", "SESSION_CREATE_FAILED");
    }
    return session;
  }

  getSession(sessionId: string): Session | null {
    const row = this.db.prepare("SELECT * FROM sessions WHERE id = ?").get(sessionId) as SessionRow | undefined;
    return row ? sessionFromRow(row) : null;
  }

  getLatestActiveSession(): Session | null {
    const row = this.db
      .prepare("SELECT * FROM sessions WHERE status = 'active' ORDER BY started_at DESC, created_at DESC, rowid DESC LIMIT 1")
      .get() as SessionRow | undefined;
    return row ? sessionFromRow(row) : null;
  }

  resolveSession(sessionId?: string): Session {
    const session = sessionId ? this.getSession(sessionId) : this.getLatestActiveSession();
    if (!session) {
      throw new OwlynError("No active Owlyn session found. Call owlyn_start first.", "NO_ACTIVE_SESSION");
    }
    return session;
  }

  insertCheckpoint(input: NewCheckpoint): Checkpoint {
    this.db
      .prepare(
        `INSERT INTO checkpoints (
          id, session_id, created_at, summary, completed_tasks_json, next_tasks_json,
          blockers_json, files_changed_json, validation_results_json, confidence, risk_level
        ) VALUES (
          @id, @sessionId, @createdAt, @summary, @completedTasksJson, @nextTasksJson,
          @blockersJson, @filesChangedJson, @validationResultsJson, @confidence, @riskLevel
        )`,
      )
      .run({
        id: input.id,
        sessionId: input.sessionId,
        createdAt: input.createdAt,
        summary: input.summary,
        completedTasksJson: JSON.stringify(input.completedTasks),
        nextTasksJson: JSON.stringify(input.nextTasks),
        blockersJson: JSON.stringify(input.blockers),
        filesChangedJson: JSON.stringify(input.filesChanged),
        validationResultsJson: JSON.stringify(input.validationResults),
        confidence: input.confidence,
        riskLevel: input.riskLevel ?? null,
      });

    const checkpoint = this.getCheckpoint(input.id);
    if (!checkpoint) {
      throw new OwlynError("Checkpoint was not saved.", "CHECKPOINT_CREATE_FAILED");
    }
    return checkpoint;
  }

  getCheckpoint(checkpointId: string): Checkpoint | null {
    const row = this.db.prepare("SELECT * FROM checkpoints WHERE id = ?").get(checkpointId) as CheckpointRow | undefined;
    return row ? checkpointFromRow(row) : null;
  }

  listCheckpoints(sessionId: string): Checkpoint[] {
    const rows = this.db
      .prepare("SELECT * FROM checkpoints WHERE session_id = ? ORDER BY created_at ASC")
      .all(sessionId) as CheckpointRow[];
    return rows.map(checkpointFromRow);
  }

  getLatestCheckpoint(sessionId: string): Checkpoint | null {
    const row = this.db
      .prepare("SELECT * FROM checkpoints WHERE session_id = ? ORDER BY created_at DESC LIMIT 1")
      .get(sessionId) as CheckpointRow | undefined;
    return row ? checkpointFromRow(row) : null;
  }

  countCheckpoints(sessionId: string): number {
    const row = this.db.prepare("SELECT COUNT(*) AS count FROM checkpoints WHERE session_id = ?").get(sessionId) as
      | { count: number }
      | undefined;
    return row?.count ?? 0;
  }

  insertDecision(input: NewDecision): ContinuationDecisionRecord {
    this.db
      .prepare(
        `INSERT INTO continuation_decisions (
          id, session_id, created_at, should_continue, reason, recommended_action, policy_json
        ) VALUES (
          @id, @sessionId, @createdAt, @shouldContinue, @reason, @recommendedAction, @policyJson
        )`,
      )
      .run({
        id: input.id,
        sessionId: input.sessionId,
        createdAt: input.createdAt,
        shouldContinue: input.shouldContinue ? 1 : 0,
        reason: input.reason,
        recommendedAction: input.recommendedAction,
        policyJson: JSON.stringify(input.policy),
      });

    const decision = this.getDecision(input.id);
    if (!decision) {
      throw new OwlynError("Continuation decision was not saved.", "DECISION_CREATE_FAILED");
    }
    return decision;
  }

  getDecision(decisionId: string): ContinuationDecisionRecord | null {
    const row = this.db
      .prepare("SELECT * FROM continuation_decisions WHERE id = ?")
      .get(decisionId) as DecisionRow | undefined;
    return row ? decisionFromRow(row) : null;
  }

  listDecisions(sessionId: string): ContinuationDecisionRecord[] {
    const rows = this.db
      .prepare("SELECT * FROM continuation_decisions WHERE session_id = ? ORDER BY created_at ASC")
      .all(sessionId) as DecisionRow[];
    return rows.map(decisionFromRow);
  }

  endSession(sessionId: string, status: Exclude<SessionStatus, "active">, finalSummary: string, completedAt: string): Session {
    this.db
      .prepare(
        `UPDATE sessions
         SET status = @status, final_summary = @finalSummary, completed_at = @completedAt, updated_at = @completedAt
         WHERE id = @sessionId`,
      )
      .run({ sessionId, status, finalSummary, completedAt });

    const session = this.getSession(sessionId);
    if (!session) {
      throw new OwlynError("Session not found.", "SESSION_NOT_FOUND");
    }
    return session;
  }

  listSessions(status: SessionStatus | "all", limit: number): Array<Session & { checkpointCount: number }> {
    const where = status === "all" ? "" : "WHERE s.status = @status";
    const rows = this.db
      .prepare(
        `SELECT s.*, COUNT(c.id) AS checkpoint_count
         FROM sessions s
         LEFT JOIN checkpoints c ON c.session_id = s.id
         ${where}
         GROUP BY s.id
         ORDER BY s.started_at DESC
         LIMIT @limit`,
      )
      .all({ status, limit }) as Array<SessionRow & { checkpoint_count: number }>;

    return rows.map((row) => ({
      ...sessionFromRow(row),
      checkpointCount: row.checkpoint_count,
    }));
  }
}
