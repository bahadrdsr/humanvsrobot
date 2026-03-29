import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThinkPanel } from "@/features/thinking/ThinkPanel";
import { renderWithProviders } from "../utils/renderWithProviders";

describe("think accessibility", () => {
  it("renders hand sign pickers and ask-robot button while picking", () => {
    const state = {
      phase: "picking" as const,
      left: 2,
      right: 3,
      answer: null,
      resultMessage: ""
    };
    renderWithProviders(
      <ThinkPanel
        onSetLeft={vi.fn()}
        onSetRight={vi.fn()}
        onSubmit={vi.fn()}
        state={state}
      />
    );
    expect(screen.getByRole("button", { name: /ask the robot/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /hand sign/i })).toHaveLength(2);
  });
});