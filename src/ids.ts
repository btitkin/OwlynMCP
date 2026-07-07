import { randomBytes } from "node:crypto";
import { DateTime } from "luxon";

export function createReadableId(prefix: "owl" | "chk" | "dec", now: DateTime<boolean> = DateTime.now()): string {
  const stamp = now.toFormat("yyyyLLdd_HHmmss");
  const suffix = randomBytes(3).toString("hex");
  return `${prefix}_${stamp}_${suffix}`;
}
