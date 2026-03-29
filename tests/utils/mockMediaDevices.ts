import { vi } from "vitest";

export function mockSuccessfulMediaDevices() {
  const mockTrack = {
    stop: vi.fn()
  };

  const mockStream = {
    getTracks: () => [mockTrack],
    getVideoTracks: () => [mockTrack],
    getAudioTracks: () => [mockTrack]
  } as unknown as MediaStream;

  Object.defineProperty(globalThis.navigator, "mediaDevices", {
    configurable: true,
    value: {
      getUserMedia: vi.fn().mockResolvedValue(mockStream)
    }
  });

  return { mockStream, mockTrack };
}

export function mockFailedMediaDevices(message = "Device unavailable") {
  Object.defineProperty(globalThis.navigator, "mediaDevices", {
    configurable: true,
    value: {
      getUserMedia: vi.fn().mockRejectedValue(new Error(message))
    }
  });
}