import { DateTime } from "luxon";
import type { OwlynDb } from "../db.js";
import { createReadableId } from "../ids.js";
import type { StartInput } from "../schemas.js";
import { DEFAULT_TIMEZONE, parseDeadline, toIso } from "../time.js";
import type { WorkMode } from "../types.js";
import { defaultSafety, envelope, sessionClock } from "./common.js";

const initialInstruction =
  "At every meaningful completion point, call owlyn_checkpoint, then owlyn_should_continue. Do not stop only because the first task is complete if Owlyn says to continue.";

export function handleStart(db: OwlynDb, input: StartInput, now = DateTime.now()) {
  const existing = db.getLatestActiveSession();
  if (existing && input.force_new !== true) {
    return envelope(
      {
        session_id: existing.id,
        goal: existing.goal,
        mode: existing.mode,
        timezone: existing.timezone,
        started_at: existing.startedAt,
        deadline_at: existing.deadlineAt,
        ...sessionClock(existing, now.setZone(existing.timezone)),
        status: existing.status,
        warning: "An active Owlyn session already exists. Returned the existing session because force_new was not true.",
        initial_instruction: initialInstruction,
      },
      initialInstruction,
      defaultSafety,
    );
  }

  const timezone = input.timezone ?? DEFAULT_TIMEZONE;
  const mode: WorkMode = input.mode ?? "night_shift";
  const resolution = parseDeadline(input.deadline, timezone, now.setZone(timezone), input.max_work_minutes);
  const startedAt = toIso(resolution.startedAt);
  const createdAt = startedAt;

  const session = db.createSession({
    id: createReadableId("owl", resolution.startedAt),
    goal: input.goal,
    mode,
    timezone,
    startedAt,
    deadlineAt: toIso(resolution.deadlineAt),
    maxWorkMinutes: input.max_work_minutes,
    notes: input.notes,
    createdAt,
  });

  return envelope(
    {
      session_id: session.id,
      goal: session.goal,
      mode: session.mode,
      timezone: session.timezone,
      started_at: session.startedAt,
      deadline_at: session.deadlineAt,
      ...sessionClock(session, resolution.startedAt),
      status: session.status,
      initial_instruction: initialInstruction,
    },
    initialInstruction,
    defaultSafety,
  );
}
