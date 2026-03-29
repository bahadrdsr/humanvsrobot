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
        <LiveStatus message="The robot is ready." />
      </div>
    );

    expect(screen.getByRole("button", { name: /^Speak/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Hear/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /robot moves/i })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });
});