import { DateTime } from "luxon";
import type { OwlynDb } from "../db.js";
import { rankCandidateTasks } from "../ranking.js";
import type { PlanNextInput } from "../schemas.js";
import { defaultSafety, envelope, sessionClock } from "./common.js";

export function handlePlanNext(db: OwlynDb, input: PlanNextInput, now = DateTime.now()) {
  const session = db.resolveSession(input.session_id);
  const clock = sessionClock(session, now.setZone(session.timezone));
  const ranking = rankCandidateTasks(input.candidate_tasks, clock.remaining_minutes);

  return envelope(
    {
      session_id: session.id,
      remaining_minutes: clock.remaining_minutes,
      recommended_task: ranking.recommendedTask
        ? {
            title: ranking.recommendedTask.title,
            impact: ranking.recommendedTask.impact,
            risk: ranking.recommendedTask.risk,
            estimated_minutes: ranking.recommendedTask.estimated_minutes,
            reason: ranking.recommendedTask.reason,
          }
        : null,
      ranked_tasks: ranking.rankedTasks.map((task) => ({
        title: task.title,
        score: task.score,
        reason: task.reason,
      })),
      rejected_tasks_with_reasons: ranking.rejectedTasksWithReasons,
      planning_notes: ranking.planningNotes,
    },
    ranking.recommendedTask
      ? "Continue with the recommended safe task if owlyn_should_continue also allows continuing."
      : "No acceptable task was found. Stop and ask the user for direction.",
    defaultSafety,
  );
}
