import type { RiskLevel, SessionStatus, WorkMode } from "./types.js";

export type ContinuationInput = {
  mode: WorkMode;
  sessionStatus: SessionStatus;
  deadlineReached: boolean;
  currentTaskDone: boolean;
  hasNextTasks: boolean;
  requiresUserApproval: boolean;
  destructiveActionPending: boolean;
  riskLevel: RiskLevel;
  validationPassed?: boolean;
  remainingMinutes: number;
};

export type ContinuationDecision = {
  shouldContinue: boolean;
  reason: string;
  recommendedAction: string;
  nextPolicy: string;
  safetyNotes: string[];
};

const baselineSafetyNotes = [
  "Avoid destructive or irreversible actions without explicit user approval.",
  "Checkpoint again after meaningful progress.",
];

function stop(reason: string, recommendedAction: string, nextPolicy = "Stop and summarize the reason to the user."): ContinuationDecision {
  return {
    shouldContinue: false,
    reason,
    recommendedAction,
    nextPolicy,
    safetyNotes: baselineSafetyNotes,
  };
}

function proceed(reason: string, recommendedAction: string, nextPolicy: string, extraSafetyNotes: string[] = []): ContinuationDecision {
  return {
    shouldContinue: true,
    reason,
    recommendedAction,
    nextPolicy,
    safetyNotes: [...baselineSafetyNotes, ...extraSafetyNotes],
  };
}

export function decideContinuation(input: ContinuationInput): ContinuationDecision {
  if (input.sessionStatus !== "active") {
    return stop("Stop because the Owlyn session is inactive.", "Stop because there is no active session to continue.");
  }

  if (input.deadlineReached || input.remainingMinutes <= 0) {
    return stop("Stop because the deadline has been reached.", "Stop because the deadline has been reached.");
  }

  if (input.requiresUserApproval) {
    return stop("Stop because user approval is required.", "Ask the user for explicit approval before continuing.");
  }

  if (input.destructiveActionPending) {
    return stop("Stop because a destructive action is pending.", "Ask the user for explicit approval before any destructive or irreversible action.");
  }

  if (input.riskLevel === "high") {
    return stop(
      "Stop because risk level is high.",
      "Stop or ask the user whether to switch to low-risk validation or documentation work.",
      "Do not continue high-risk work without explicit user approval.",
    );
  }

  if (input.mode === "focused") {
    if (input.currentTaskDone) {
      return stop(
        "Stop because focused mode ends after the current task is complete.",
        "Summarize the completed focused task and wait for the user.",
      );
    }

    return proceed(
      "The deadline has not been reached and the focused task is still in progress.",
      "Continue the current focused task. Do not stop only because the current task is incomplete.",
      "Do not switch to unrelated next tasks in focused mode.",
    );
  }

  if (input.mode === "night_shift") {
    if (!input.hasNextTasks) {
      return stop("Stop because no safe next tasks are available.", "Summarize progress and ask the user for the next direction.");
    }

    return proceed(
      "The deadline has not been reached and safe next tasks are available.",
      "Continue with the next highest-value low-risk task. Do not stop only because the current task is complete.",
      "Pick a safe task from the latest checkpoint or call owlyn_plan_next if multiple candidate tasks exist.",
    );
  }

  if (!input.hasNextTasks) {
    return stop("Stop because no safe next tasks are available.", "Summarize progress and ask the user for the next direction.");
  }

  const validationNote =
    input.validationPassed === false
      ? "Validation failed or is incomplete; prioritize validation and fixes before new feature work."
      : "Prefer validation, tests, documentation, cleanup, and small safe improvements.";

  return proceed(
    "The deadline has not been reached and marathon mode allows careful low- or medium-risk work.",
    "Continue carefully with low- or medium-risk work. Do not stop only because the current task is complete.",
    "Checkpoint more frequently and prefer validation or cleanup when close to the deadline.",
    [validationNote],
  );
}
