import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CameraPreview } from "@/features/senses/CameraPreview";
import { HearAction } from "@/features/senses/HearAction";
import { renderWithProviders } from "../utils/renderWithProviders";

describe("senses accessibility", () => {
  it("shows readable fallback and preview containers", () => {
    renderWithProviders(
      <div>
        <HearAction
          clipDurationMs={0}
          fallbackText=""
          hasRecording={false}
          message="Use the text box if listening is unavailable."
          onPlayRecording={vi.fn(async () => undefined)}
          onSubmitFallback={vi.fn()}
          playbackState="idle"
          transcript=""
        />
        <CameraPreview message="Camera is off." onClose={vi.fn()} stream={null} visible />
      </div>
    );

    expect(screen.getByLabelText("Fallback phrase")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close camera view/i })).toBeInTheDocument();
    expect(screen.getByText(/camera is off/i)).toBeInTheDocument();
  });
});