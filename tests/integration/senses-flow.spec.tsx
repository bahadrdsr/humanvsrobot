import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSenseController } from "@/features/senses/useSenseController";
import { mockSuccessfulMediaDevices } from "../utils/mockMediaDevices";

vi.mock("@/lib/speech/recognition", () => ({
  recognizeShortPhrase: async () => ({ kind: "success", transcript: "hello robot", message: "The robot heard: hello robot" })
}));

vi.mock("@/lib/speech/synthesis", () => ({
  speakText: async () => undefined
}));

describe("senses flow", () => {
  it("completes Hear with a transcript and feedback timing well under two seconds", async () => {
    mockSuccessfulMediaDevices();

    const { result } = renderHook(() => useSenseController());
    const start = performance.now();

    await act(async () => {
      await result.current.startHear();
    });

    expect(result.current.hearState.transcript).toBe("hello robot");
    expect(performance.now() - start).toBeLessThan(2000);
  });
});