import { DateTime } from "luxon";
import type { OwlynDb } from "../db.js";
import { buildSessionReport } from "../report.js";
import type { ReportInput } from "../schemas.js";
import { defaultSafety, envelope } from "./common.js";

export function handleReport(db: OwlynDb, input: ReportInput, now = DateTime.now()) {
  const session = db.resolveSession(input.session_id);
  return envelope(
    buildSessionReport(db, session, now.setZone(session.timezone)),
    "Use this report to summarize progress, continuation decisions, remaining work, and blockers.",
    defaultSafety,
  );
}
