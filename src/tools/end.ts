import { DateTime } from "luxon";
import type { OwlynDb } from "../db.js";
import { aggregateCompletedTasks } from "../report.js";
import type { EndInput } from "../schemas.js";
import { elapsedMinutes, toIso } from "../time.js";
import { defaultSafety, envelope } from "./common.js";

export function handleEnd(db: OwlynDb, input: EndInput, now = DateTime.now()) {
  const session = db.resolveSession(input.session_id);
  const localNow = now.setZone(session.timezone);
  const completedAt = toIso(localNow);
  const updatedSession = db.endSession(session.id, input.status ?? "completed", input.final_summary, completedAt);
  const checkpoints = db.listCheckpoints(session.id);

  return envelope(
    {
      session_id: updatedSession.id,
      goal: updatedSession.goal,
      mode: updatedSession.mode,
      started_at: updatedSession.startedAt,
      completed_at: updatedSession.completedAt,
      deadline_at: updatedSession.deadlineAt,
      total_elapsed_minutes: elapsedMinutes(updatedSession.startedAt, localNow),
      checkpoint_count: checkpoints.length,
      final_summary: updatedSession.finalSummary,
      completed_tasks_aggregated: aggregateCompletedTasks(checkpoints),
      remaining_tasks: input.remaining_tasks ?? [],
      validation_results: input.validation_results ?? [],
      final_recommendation: "Session completed. Summarize changes to the user and mention remaining tasks.",
    },
    "Session ended. Summarize changes to the user and mention remaining tasks.",
    defaultSafety,
  );
}
