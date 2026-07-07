import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { DateTime } from "luxon";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_TIMEZONE, parseDeadline, toIso } from "../src/time.js";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("time utilities", () => {
  it("parses ISO deadlines", () => {
    const now = DateTime.fromISO("2026-07-07T02:00:00+02:00").setZone("Europe/Warsaw");
    const result = parseDeadline("2026-07-07T06:00:00+02:00", "Europe/Warsaw", now);

    expect(toIso(result.deadlineAt)).toBe("2026-07-07T06:00:00+02:00");
  });

  it("resolves HH:mm to today when the time has not passed", () => {
    const now = DateTime.fromISO("2026-07-07T02:00:00+02:00").setZone("Europe/Warsaw");
    const result = parseDeadline("06:00", "Europe/Warsaw", now);

    expect(toIso(result.deadlineAt)).toBe("2026-07-07T06:00:00+02:00");
  });

  it("resolves HH:mm to tomorrow when the time already passed", () => {
    const now = DateTime.fromISO("2026-07-07T23:00:00+02:00").setZone("Europe/Warsaw");
    const result = parseDeadline("06:00", "Europe/Warsaw", now);

    expect(toIso(result.deadlineAt)).toBe("2026-07-08T06:00:00+02:00");
  });

  it("uses Europe/Warsaw as the default timezone", () => {
    expect(DEFAULT_TIMEZONE).toBe("Europe/Warsaw");
  });

  it("caps deadline by max_work_minutes when earlier", () => {
    const now = DateTime.fromISO("2026-07-07T23:00:00+02:00").setZone("Europe/Warsaw");
    const result = parseDeadline("06:00", "Europe/Warsaw", now, 60);

    expect(toIso(result.deadlineAt)).toBe("2026-07-08T00:00:00+02:00");
  });

  it("does not require a real Owlyn home directory in tests", () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "owlyn-time-"));
    tempDirs.push(dir);

    expect(dir).toContain("owlyn-time-");
  });
});
