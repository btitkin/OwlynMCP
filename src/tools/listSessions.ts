import type { OwlynDb } from "../db.js";
import type { ListSessionsInput } from "../schemas.js";
import { envelope } from "./common.js";

export function handleListSessions(db: OwlynDb, input: ListSessionsInput) {
  const sessions = db.listSessions(input.status ?? "all", input.limit ?? 20);

  return envelope(
    {
      sessions: sessions.map((session) => ({
        session_id: session.id,
        goal: session.goal,
        mode: session.mode,
        status: session.status,
        started_at: session.startedAt,
        deadline_at: session.deadlineAt,
        completed_at: session.completedAt,
        checkpoint_count: session.checkpointCount,
      })),
    },
    "Review prior sessions or continue the latest active session if appropriate.",
  );
}
