import { DateTime } from "luxon";
import { OwlynError } from "./errors.js";

export const DEFAULT_TIMEZONE = "Europe/Warsaw";

export type DeadlineResolution = {
  startedAt: DateTime<boolean>;
  deadlineAt: DateTime<boolean>;
  uncappedDeadlineAt: DateTime<boolean>;
};

export function assertValidTimezone(timezone: string): void {
  if (!DateTime.now().setZone(timezone).isValid) {
    throw new OwlynError(`Invalid timezone: ${timezone}. Use a valid IANA timezone name.`, "INVALID_TIMEZONE");
  }
}

export function nowInTimezone(timezone = DEFAULT_TIMEZONE): DateTime<boolean> {
  assertValidTimezone(timezone);
  return DateTime.now().setZone(timezone);
}

export function toIso(dt: DateTime<boolean>): string {
  const iso = dt.toISO({ suppressMilliseconds: true });
  if (!iso) {
    throw new OwlynError("Could not serialize timestamp.", "INVALID_TIMESTAMP");
  }
  return iso;
}

export function parseDeadline(
  deadline: string,
  timezone = DEFAULT_TIMEZONE,
  now: DateTime<boolean> = nowInTimezone(timezone),
  maxWorkMinutes?: number,
): DeadlineResolution {
  assertValidTimezone(timezone);
  const clean = deadline.trim();
  let resolved: DateTime<boolean>;

  const hhmm = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(clean);
  if (hhmm) {
    const hour = Number(hhmm[1]);
    const minute = Number(hhmm[2]);
    const localNow = now.setZone(timezone);
    let candidate = localNow.set({ hour, minute, second: 0, millisecond: 0 });
    if (candidate <= localNow) {
      candidate = candidate.plus({ days: 1 });
    }
    resolved = candidate;
  } else {
    resolved = DateTime.fromISO(clean, { zone: timezone }).setZone(timezone);
  }

  if (!resolved.isValid) {
    throw new OwlynError("Invalid deadline format. Use ISO datetime or HH:mm.", "INVALID_DEADLINE");
  }

  const startedAt = now.setZone(timezone);
  const uncappedDeadlineAt = resolved;
  if (maxWorkMinutes !== undefined) {
    const cap = startedAt.plus({ minutes: maxWorkMinutes });
    if (cap < resolved) {
      resolved = cap;
    }
  }

  return { startedAt, deadlineAt: resolved, uncappedDeadlineAt };
}

export function elapsedMinutes(startedAtIso: string, now: DateTime<boolean> = DateTime.now()): number {
  const startedAt = DateTime.fromISO(startedAtIso);
  return Math.max(0, Math.floor(now.diff(startedAt, "minutes").minutes));
}

export function remainingMinutes(deadlineAtIso: string, now: DateTime<boolean> = DateTime.now()): number {
  const deadlineAt = DateTime.fromISO(deadlineAtIso);
  return Math.max(0, Math.floor(deadlineAt.diff(now, "minutes").minutes));
}

export function isDeadlineReached(deadlineAtIso: string, now: DateTime<boolean> = DateTime.now()): boolean {
  const deadlineAt = DateTime.fromISO(deadlineAtIso);
  return now >= deadlineAt;
}
