import { describe, expect, it } from "vitest";
import { decideContinuation, type ContinuationInput } from "../src/policy.js";

const base: ContinuationInput = {
  mode: "night_shift",
  sessionStatus: "active",
  deadlineReached: false,
  currentTaskDone: true,
  hasNextTasks: true,
  requiresUserApproval: false,
  destructiveActionPending: false,
  riskLevel: "low",
  validationPassed: true,
  remainingMinutes: 120,
};

describe("continuation policy", () => {
  it("night_shift continues before deadline with safe next tasks", () => {
    const decision = decideContinuation(base);

    expect(decision.shouldContinue).toBe(true);
    expect(decision.recommendedAction).toContain("Do not stop only because the current task is complete.");
  });

  it("night_shift stops after deadline", () => {
    const decision = decideContinuation({ ...base, deadlineReached: true, remainingMinutes: 0 });

    expect(decision.shouldContinue).toBe(false);
    expect(decision.reason).toBe("Stop because the deadline has been reached.");
  });

  it("night_shift stops when no next tasks exist", () => {
    const decision = decideContinuation({ ...base, hasNextTasks: false });

    expect(decision.shouldContinue).toBe(false);
    expect(decision.reason).toBe("Stop because no safe next tasks are available.");
  });

  it("focused stops when the current task is done", () => {
    const decision = decideContinuation({ ...base, mode: "focused", currentTaskDone: true });

    expect(decision.shouldContinue).toBe(false);
    expect(decision.reason).toBe("Stop because focused mode ends after the current task is complete.");
  });

  it("focused continues current task when not done and deadline remains", () => {
    const decision = decideContinuation({ ...base, mode: "focused", currentTaskDone: false });

    expect(decision.shouldContinue).toBe(true);
    expect(decision.nextPolicy).toContain("focused mode");
  });

  it("marathon continues low-risk work", () => {
    const decision = decideContinuation({ ...base, mode: "marathon", riskLevel: "low" });

    expect(decision.shouldContinue).toBe(true);
  });

  it("marathon recommends validation and checkpointing", () => {
    const decision = decideContinuation({ ...base, mode: "marathon", validationPassed: false });

    expect(decision.nextPolicy).toContain("Checkpoint");
    expect(decision.safetyNotes.join(" ")).toContain("Validation failed");
  });

  it("requires_user_approval always stops", () => {
    const decision = decideContinuation({ ...base, requiresUserApproval: true });

    expect(decision.shouldContinue).toBe(false);
    expect(decision.reason).toBe("Stop because user approval is required.");
  });

  it("destructive_action_pending always stops", () => {
    const decision = decideContinuation({ ...base, destructiveActionPending: true });

    expect(decision.shouldContinue).toBe(false);
    expect(decision.reason).toBe("Stop because a destructive action is pending.");
  });

  it("high risk stops", () => {
    const decision = decideContinuation({ ...base, riskLevel: "high" });

    expect(decision.shouldContinue).toBe(false);
    expect(decision.reason).toBe("Stop because risk level is high.");
  });

  it("inactive session stops", () => {
    const decision = decideContinuation({ ...base, sessionStatus: "completed" });

    expect(decision.shouldContinue).toBe(false);
    expect(decision.reason).toBe("Stop because the Owlyn session is inactive.");
  });
});
