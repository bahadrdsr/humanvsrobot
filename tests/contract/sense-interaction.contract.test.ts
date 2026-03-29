import { describe, expect, it, vi } from "vitest";
import { createInitialHearState, createInitialSeeState } from "@/features/senses/senseStore";
import { stopStream } from "@/lib/permissions/devicePermissions";

describe("sense interaction contract", () => {
  it("starts with no retained hear transcript and no camera preview", () => {
    const hearState = createInitialHearState();
    const seeState = createInitialSeeState();

    expect(hearState.transcript).toBe("");
    expect(hearState.recordingUrl).toBeNull();
    expect(seeState.previewVisible).toBe(false);
  });

  it("stops every media track during cleanup", () => {
    const stop = vi.fn();
    const stream = {
      getTracks: () => [{ stop }, { stop }]
    } as unknown as MediaStream;

    stopStream(stream);

    expect(stop).toHaveBeenCalledTimes(2);
  });
});