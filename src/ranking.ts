import type { CandidateTask, RankedTask, RejectedTask } from "./types.js";

export type RankingResult = {
  recommendedTask: RankedTask | null;
  rankedTasks: RankedTask[];
  rejectedTasksWithReasons: RejectedTask[];
  planningNotes: string[];
};

const impactScore = {
  high: 30,
  medium: 15,
  low: 5,
} as const;

const riskScore = {
  low: 25,
  medium: 5,
  high: -40,
} as const;

const safeCategoryBoost = ["validation", "test", "tests", "documentation", "docs", "cleanup", "stability"];
const rejectedTerms = ["destructive", "delete", "deployment", "deploy", "secret", "credential", "payment", "upload"];

function normalizedText(task: CandidateTask): string {
  return `${task.title} ${task.description ?? ""} ${task.category ?? ""}`.toLowerCase();
}

function rejectionReason(task: CandidateTask): string | null {
  if (task.requires_user_approval) {
    return "Requires user approval.";
  }

  const text = normalizedText(task);
  const rejected = rejectedTerms.find((term) => text.includes(term));
  if (rejected) {
    return `Rejected because it appears to involve ${rejected}.`;
  }

  return null;
}

function scoreTask(task: CandidateTask, remainingMinutes: number): RankedTask {
  let score = impactScore[task.impact] + riskScore[task.risk];
  const reasons = [`${task.impact} impact`, `${task.risk} risk`];

  if (task.estimated_minutes !== undefined) {
    if (task.estimated_minutes <= remainingMinutes) {
      score += 10;
      reasons.push("fits remaining time");
    } else {
      score -= 20;
      reasons.push("exceeds remaining time");
    }
  }

  const category = task.category?.toLowerCase();
  if (category && safeCategoryBoost.some((term) => category.includes(term))) {
    score += 10;
    reasons.push("safe validation/docs/cleanup category");
  }

  if (remainingMinutes <= 30 && category && safeCategoryBoost.some((term) => category.includes(term))) {
    score += 5;
    reasons.push("good late-session task");
  }

  return {
    ...task,
    requires_user_approval: task.requires_user_approval ?? false,
    score,
    reason: reasons.join(", ") + ".",
  };
}

export function rankCandidateTasks(candidateTasks: CandidateTask[], remainingMinutes: number): RankingResult {
  const rejectedTasksWithReasons: RejectedTask[] = [];
  const accepted: CandidateTask[] = [];

  for (const task of candidateTasks) {
    const reason = rejectionReason(task);
    if (reason) {
      rejectedTasksWithReasons.push({ title: task.title, reason });
    } else {
      accepted.push({ ...task, requires_user_approval: task.requires_user_approval ?? false });
    }
  }

  const rankedTasks = accepted
    .map((task) => scoreTask(task, remainingMinutes))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  return {
    recommendedTask: rankedTasks[0] ?? null,
    rankedTasks,
    rejectedTasksWithReasons,
    planningNotes: [
      "Prefer safe validation or documentation if the session is close to deadline.",
      "Avoid approval-requiring, destructive, credential-related, deployment, payment, or upload tasks.",
    ],
  };
}
