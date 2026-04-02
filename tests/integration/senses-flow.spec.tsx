import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSenseController } from "@/features/senses/useSenseController";
import { mockSuccessfulMediaDevices } from "../utils/mockMediaDevices";

const audioMocks = vi.hoisted(() => ({
  captureTemporaryAudio: vi.fn(async () => ({ audioUrl: "blob:clip", durationMs: 3200, supported: true, mimeType: "audio/mp4" })),
  playTemporaryAudio: vi.fn(async () => undefined),
  revokeTemporaryAudio: vi.fn()
}));

vi.mock("@/lib/audio/temporaryClip", () => ({
  captureTemporaryAudio: audioMocks.captureTemporaryAudio,
  playTemporaryAudio: audioMocks.playTemporaryAudio,
  revokeTemporaryAudio: audioMocks.revokeTemporaryAudio
}));

vi.mock("@/lib/speech/recognition", () => ({
  recognizeShortPhrase: async () => ({ kind: "success", transcript: "merhaba bilgisayar", message: "Bilgisayar sunu duydu: merhaba bilgisayar" })
}));

vi.mock("@/lib/speech/synthesis", () => ({
  speakText: async () => undefined
}));

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
}

function mockTouchPoints(value: number) {
  Object.defineProperty(window.navigator, "maxTouchPoints", {
    configurable: true,
    value
  });
}

describe("senses flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMatchMedia(false);
    mockTouchPoints(0);
  });

  it("completes Dinle with a transcript and feedback timing well under two seconds", async () => {
    mockSuccessfulMediaDevices();

    const { result } = renderHook(() => useSenseController());
    const start = performance.now();

    await act(async () => {
      await result.current.startHear();
    });

    expect(result.current.hearState.transcript).toBe("merhaba bilgisayar");
    expect(result.current.hearState.requiresManualPlayback).toBe(false);
    expect(audioMocks.playTemporaryAudio).toHaveBeenCalledTimes(1);
    expect(performance.now() - start).toBeLessThan(2000);
  });

  it("waits for a manual replay tap on touch devices before playing the saved clip", async () => {
    mockSuccessfulMediaDevices();
    mockMatchMedia(true);
    mockTouchPoints(5);

    const { result } = renderHook(() => useSenseController());

    await act(async () => {
      await result.current.startHear();
    });

    expect(result.current.hearState.requiresManualPlayback).toBe(true);
    expect(result.current.hearState.playbackState).toBe("ready");
    expect(result.current.hearState.message).toContain("Klibi oynat");
    expect(audioMocks.playTemporaryAudio).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.playHearRecording();
    });

    expect(audioMocks.playTemporaryAudio).toHaveBeenCalledTimes(1);
    expect(result.current.hearState.playbackState).toBe("ready");
  });
});