import { DateTime } from "luxon";
import type { OwlynDb } from "../db.js";
import { createReadableId } from "../ids.js";
import type { CheckpointInput } from "../schemas.js";
import { toIso } from "../time.js";
import { assertActiveSession, defaultSafety, envelope, sessionClock } from "./common.js";

export function handleCheckpoint(db: OwlynDb, input: CheckpointInput, now = DateTime.now()) {
  const session = db.resolveSession(input.session_id);
  assertActiveSession(session);
  const localNow = now.setZone(session.timezone);

  const checkpoint = db.insertCheckpoint({
    id: createReadableId("chk", localNow),
    sessionId: session.id,
    createdAt: toIso(localNow),
    summary: input.summary,
    completedTasks: input.completed_tasks,
    nextTasks: input.next_tasks,
    blockers: input.blockers ?? [],
    filesChanged: input.files_changed ?? [],
    validationResults: input.validation_results ?? [],
    confidence: input.confidence,
    riskLevel: input.risk_level,
  });

  return envelope(
    {
      checkpoint_id: checkpoint.id,
      session_id: session.id,
      created_at: checkpoint.createdAt,
      summary: checkpoint.summary,
      completed_tasks: checkpoint.completedTasks,
      next_tasks: checkpoint.nextTasks,
      blockers: checkpoint.blockers,
      files_changed: checkpoint.filesChanged,
      validation_results: checkpoint.validationResults,
      confidence: checkpoint.confidence,
      risk_level: checkpoint.riskLevel,
      status_after_checkpoint: {
        ...sessionClock(session, localNow),
        checkpoint_count: db.countCheckpoints(session.id),
      },
    },
    "Checkpoint saved. Call owlyn_should_continue before deciding to stop or continue.",
    defaultSafety,
  );
}
