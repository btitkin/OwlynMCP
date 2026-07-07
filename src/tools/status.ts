import { DateTime } from "luxon";
import type { OwlynDb } from "../db.js";
import type { StatusInput } from "../schemas.js";
import { toIso } from "../time.js";
import { defaultSafety, envelope, sessionClock } from "./common.js";

export function handleStatus(db: OwlynDb, input: StatusInput, now = DateTime.now()) {
  const session = db.resolveSession(input.session_id);
  const localNow = now.setZone(session.timezone);
  const latestCheckpoint = db.getLatestCheckpoint(session.id);

  return envelope(
    {
      session_id: session.id,
      goal: session.goal,
      mode: session.mode,
      timezone: session.timezone,
      now: toIso(localNow),
      started_at: session.startedAt,
      deadline_at: session.deadlineAt,
      ...sessionClock(session, localNow),
      status: session.status,
      checkpoint_count: db.countCheckpoints(session.id),
      last_checkpoint_summary: latestCheckpoint?.summary ?? null,
      last_checkpoint_at: latestCheckpoint?.createdAt ?? null,
      next_tasks_from_last_checkpoint: latestCheckpoint?.nextTasks ?? [],
      blockers_from_last_checkpoint: latestCheckpoint?.blockers ?? [],
    },
    "Use this status to decide whether to checkpoint, continue, or end the session.",
    defaultSafety,
  );
}
