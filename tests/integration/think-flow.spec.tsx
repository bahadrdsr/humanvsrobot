import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useThinkController } from "@/features/thinking/useThinkController";

describe("think flow", () => {
  it("starts a prompt and resolves an answer quickly", () => {
    const { result } = renderHook(() => useThinkController());
    const start = performance.now();

    act(() => {
      result.current.startThink();
    });

    act(() => {
      result.current.submitAnswer("2");
    });

    expect(result.current.state.resultMessage.length).toBeGreaterThan(0);
    expect(performance.now() - start).toBeLessThan(1000);
  });
});