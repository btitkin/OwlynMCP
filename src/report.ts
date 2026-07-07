import { DateTime } from "luxon";
import type { OwlynDb } from "./db.js";
import { elapsedMinutes, isDeadlineReached, remainingMinutes } from "./time.js";
import type { Checkpoint, ContinuationDecisionRecord, Session } from "./types.js";

function unique(items: string[]): string[] {
  return [...new Set(items.filter((item) => item.trim().length > 0))];
}

export function aggregateCompletedTasks(checkpoints: Checkpoint[]): string[] {
  return unique(checkpoints.flatMap((checkpoint) => checkpoint.completedTasks));
}

export function aggregateValidationResults(checkpoints: Checkpoint[]): string[] {
  return unique(checkpoints.flatMap((checkpoint) => checkpoint.validationResults));
}

export function buildTimeline(
  checkpoints: Checkpoint[],
  decisions: ContinuationDecisionRecord[],
): Array<Record<string, unknown>> {
  return [
    ...checkpoints.map((checkpoint) => ({
      type: "checkpoint",
      created_at: checkpoint.createdAt,
      summary: checkpoint.summary,
    })),
    ...decisions.map((decision) => ({
      type: "decision",
      created_at: decision.createdAt,
      should_continue: decision.shouldContinue,
      reason: decision.reason,
    })),
  ].sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
}

export function buildSessionReport(db: OwlynDb, session: Session, now: DateTime<boolean> = DateTime.now()) {
  const checkpoints = db.listCheckpoints(session.id);
  const decisions = db.listDecisions(session.id);
  const latestCheckpoint = checkpoints.at(-1);
  const continueCount = decisions.filter((decision) => decision.shouldContinue).length;
  const stopCount = decisions.length - continueCount;

  return {
    session_id: session.id,
    goal: session.goal,
    mode: session.mode,
    status: session.status,
    started_at: session.startedAt,
    deadline_at: session.deadlineAt,
    elapsed_minutes: elapsedMinutes(session.startedAt, now),
    remaining_minutes: remainingMinutes(session.deadlineAt, now),
    deadline_reached: isDeadlineReached(session.deadlineAt, now),
    checkpoint_count: checkpoints.length,
    timeline: buildTimeline(checkpoints, decisions),
    completed_tasks_aggregated: aggregateCompletedTasks(checkpoints),
    next_tasks_latest: latestCheckpoint?.nextTasks ?? [],
    blockers_latest: latestCheckpoint?.blockers ?? [],
    validation_results_aggregated: aggregateValidationResults(checkpoints),
    decisions_summary: {
      continue_count: continueCount,
      stop_count: stopCount,
    },
  };
}
