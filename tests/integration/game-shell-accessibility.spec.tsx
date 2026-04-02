import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActionPanel } from "@/components/controls/ActionPanel";
import { LiveStatus } from "@/components/status/LiveStatus";
import { renderWithProviders } from "../utils/renderWithProviders";

describe("game shell accessibility", () => {
  it("renders labelled action buttons and a live status region", () => {
    renderWithProviders(
      <div>
        <ActionPanel currentAction={null} onAction={() => undefined} />
        <LiveStatus message="Bilgisayar hazir." />
      </div>
    );

    const speakButtons = screen.getAllByRole("button", { name: /^Konus/i });
    const hearButtons = screen.getAllByRole("button", { name: /^Dinle/i });
    expect(speakButtons.length).toBeGreaterThanOrEqual(1);
    expect(hearButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });
});