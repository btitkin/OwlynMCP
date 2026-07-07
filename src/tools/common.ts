import type { DateTime } from "luxon";
import { OwlynError } from "../errors.js";
import { elapsedMinutes, isDeadlineReached, remainingMinutes } from "../time.js";
import type { Session } from "../types.js";

export type ToolEnvelope = {
  data: Record<string, unknown>;
  instruction: string;
  safety?: string;
};

export function envelope(data: Record<string, unknown>, instruction: string, safety?: string): ToolEnvelope {
  return { data, instruction, ...(safety ? { safety } : {}) };
}

export function assertActiveSession(session: Session): void {
  if (session.status !== "active") {
    throw new OwlynError("Session is already completed or abandoned.", "SESSION_INACTIVE");
  }
}

export function sessionClock(session: Session, now: DateTime<boolean>) {
  return {
    elapsed_minutes: elapsedMinutes(session.startedAt, now),
    remaining_minutes: remainingMinutes(session.deadlineAt, now),
    deadline_reached: isDeadlineReached(session.deadlineAt, now),
  };
}

export const defaultSafety = "Avoid destructive, irreversible, external, credential-requiring, payment-related, deployment-related, or approval-requiring actions unless the user explicitly approves.";
