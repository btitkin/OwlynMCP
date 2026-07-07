import { DateTime } from "luxon";
import type { OwlynDb } from "../db.js";
import { OwlynError } from "../errors.js";
import { createReadableId } from "../ids.js";
import { decideContinuation } from "../policy.js";
import type { ShouldContinueInput } from "../schemas.js";
import { toIso } from "../time.js";
import { defaultSafety, envelope, sessionClock } from "./common.js";

export function handleShouldContinue(db: OwlynDb, input: ShouldContinueInput, now = DateTime.now()) {
  let session;
  try {
    session = db.resolveSession(input.session_id);
  } catch (error) {
    if (error instanceof OwlynError && error.code === "NO_ACTIVE_SESSION") {
      return envelope(
        {
          session_id: input.session_id ?? null,
          should_continue: false,
          reason: "Stop because no active Owlyn session exists.",
          recommended_action: "Call owlyn_start before continuing a work session.",
          next_policy: "Start a session or summarize current work to the user.",
          safety_notes: [defaultSafety],
        },
        "Stop because no active Owlyn session exists.",
        defaultSafety,
      );
    }
    throw error;
  }

  const localNow = now.setZone(session.timezone);
  const clock = sessionClock(session, localNow);
  const decision = decideContinuation({
    mode: session.mode,
    sessionStatus: session.status,
    deadlineReached: clock.deadline_reached,
    currentTaskDone: input.current_task_done,
    hasNextTasks: input.has_next_tasks,
    requiresUserApproval: input.requires_user_approval ?? false,
    destructiveActionPending: input.destructive_action_pending ?? false,
    riskLevel: input.risk_level,
    validationPassed: input.validation_passed,
    remainingMinutes: clock.remaining_minutes,
  });

  db.insertDecision({
    id: createReadableId("dec", localNow),
    sessionId: session.id,
    createdAt: toIso(localNow),
    shouldContinue: decision.shouldContinue,
    reason: decision.reason,
    recommendedAction: decision.recommendedAction,
    policy: {
      mode: session.mode,
      input: {
        current_task_done: input.current_task_done,
        has_next_tasks: input.has_next_tasks,
        requires_user_approval: input.requires_user_approval ?? false,
        risk_level: input.risk_level,
        destructive_action_pending: input.destructive_action_pending ?? false,
        validation_passed: input.validation_passed,
        notes: input.notes,
      },
      next_policy: decision.nextPolicy,
      safety_notes: decision.safetyNotes,
    },
  });

  return envelope(
    {
      session_id: session.id,
      now: toIso(localNow),
      started_at: session.startedAt,
      deadline_at: session.deadlineAt,
      ...clock,
      mode: session.mode,
      should_continue: decision.shouldContinue,
      reason: decision.reason,
      recommended_action: decision.recommendedAction,
      next_policy: decision.nextPolicy,
      safety_notes: decision.safetyNotes,
    },
    decision.recommendedAction,
    defaultSafety,
  );
}
