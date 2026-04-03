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
          message="Dinleme kullanılamazsa metin kutusunu kullan."
          onClose={vi.fn()}
          onPlayRecording={vi.fn(async () => undefined)}
          onSubmitFallback={vi.fn()}
          playbackState="idle"
          requiresManualPlayback={false}
          transcript=""
        />
        <CameraPreview message="Kamera kapalı." onClose={vi.fn()} stream={null} visible />
      </div>
    );

    expect(screen.getByLabelText("Yedek ifade")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dinleme penceresini kapat/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /kamera görünümünü kapat/i })).toBeInTheDocument();
    expect(screen.getByText(/kamera kapalı/i)).toBeInTheDocument();
  });
});