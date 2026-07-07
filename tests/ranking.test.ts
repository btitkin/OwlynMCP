import { describe, expect, it } from "vitest";
import { rankCandidateTasks } from "../src/ranking.js";
import type { CandidateTask } from "../src/types.js";

describe("ranking", () => {
  it("high impact low risk wins", () => {
    const tasks: CandidateTask[] = [
      { title: "Tiny cleanup", impact: "low", risk: "low", estimated_minutes: 5 },
      { title: "Add policy tests", impact: "high", risk: "low", estimated_minutes: 20, category: "tests" },
    ];

    const result = rankCandidateTasks(tasks, 60);

    expect(result.recommendedTask?.title).toBe("Add policy tests");
  });

  it("approval-required task is rejected", () => {
    const result = rankCandidateTasks(
      [{ title: "Change production config", impact: "high", risk: "low", requires_user_approval: true }],
      60,
    );

    expect(result.rejectedTasksWithReasons[0]).toEqual({
      title: "Change production config",
      reason: "Requires user approval.",
    });
  });

  it("destructive task is rejected", () => {
    const result = rankCandidateTasks(
      [{ title: "Delete old data", impact: "high", risk: "medium", category: "destructive cleanup" }],
      60,
    );

    expect(result.rejectedTasksWithReasons[0]?.title).toBe("Delete old data");
  });

  it("task exceeding remaining time is deprioritized", () => {
    const result = rankCandidateTasks(
      [
        { title: "Large refactor", impact: "high", risk: "medium", estimated_minutes: 120 },
        { title: "Focused docs", impact: "medium", risk: "low", estimated_minutes: 15, category: "docs" },
      ],
      30,
    );

    expect(result.recommendedTask?.title).toBe("Focused docs");
  });

  it("validation/test/doc cleanup ranks well after implementation", () => {
    const result = rankCandidateTasks(
      [
        { title: "Tidy wording", impact: "medium", risk: "low", estimated_minutes: 10, category: "docs" },
        { title: "Add risky feature", impact: "high", risk: "high", estimated_minutes: 20 },
      ],
      25,
    );

    expect(result.recommendedTask?.title).toBe("Tidy wording");
  });
});
