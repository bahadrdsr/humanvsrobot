import { describe, expect, it } from "vitest";
import { evaluateAnswer, normalizeAnswer } from "@/features/thinking/evaluateAnswer";
import { thinkPrompts } from "@/features/thinking/prompts";

describe("think prompt contract", () => {
  it("normalizes answers before comparison", () => {
    expect(normalizeAnswer("  KIRMIZI ")).toBe("kirmizi");
  });

  it("returns a positive response for a correct answer", () => {
    const result = evaluateAnswer(thinkPrompts[2], "kirmizi");
    expect(result.isCorrect).toBe(true);
    expect(result.message).toContain("Kirmizi");
  });

  it("returns a child-friendly correction for an incorrect answer", () => {
    const result = evaluateAnswer(thinkPrompts[1], "3");
    expect(result.isCorrect).toBe(false);
    expect(result.message).toContain("Eglenceli");
  });
});