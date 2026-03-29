import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useThinkController } from "@/features/thinking/useThinkController";

describe("think flow", () => {
  it("starts a puzzle, picks hand signs, and resolves the answer", () => {
    const { result } = renderHook(() => useThinkController());
    const start = performance.now();

    act(() => {
      result.current.startPuzzle();
    });

    act(() => {
      result.current.setLeft(3);
      result.current.setRight(4);
    });

    act(() => {
      result.current.submitPuzzle(result.current.state.left, result.current.state.right);
    });

    expect(result.current.state.phase).toBe("answered");
    expect(result.current.state.answer).toBe(7);
    expect(result.current.state.resultMessage.length).toBeGreaterThan(0);
    expect(performance.now() - start).toBeLessThan(1000);
  });
});