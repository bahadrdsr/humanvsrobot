import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRobotActionController } from "@/features/robot-actions/useRobotActionController";

describe("performance smoke coverage", () => {
  it("acknowledges lightweight actions within one second in mock mode", async () => {
    const { result } = renderHook(() => useRobotActionController());
    const start = performance.now();

    await act(async () => {
      await result.current.runAction("dance", async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return "Bilgisayar dans etti.";
      });
    });

    expect(result.current.state.message).toContain("dans");
    expect(performance.now() - start).toBeLessThan(1000);
  });
});