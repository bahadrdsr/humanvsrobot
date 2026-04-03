import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThinkPanel } from "@/features/thinking/ThinkPanel";
import { renderWithProviders } from "../utils/renderWithProviders";

describe("think accessibility", () => {
  it("renders hand sign pickers and the ask-computer button while picking", () => {
    const state = {
      phase: "picking" as const,
      left: 2,
      right: 3,
      answer: null,
      resultMessage: ""
    };
    renderWithProviders(
      <ThinkPanel
        onClose={vi.fn()}
        onSetLeft={vi.fn()}
        onSetRight={vi.fn()}
        onSubmit={vi.fn()}
        state={state}
      />
    );
    expect(screen.getByRole("button", { name: /bilgisayara sor/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /düşünme penceresini kapat/i })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /el işareti/i })).toHaveLength(2);
  });
});