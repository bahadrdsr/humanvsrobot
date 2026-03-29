import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThinkPanel } from "@/features/thinking/ThinkPanel";
import { renderWithProviders } from "../utils/renderWithProviders";

describe("think accessibility", () => {
  it("renders prompt answers as buttons", () => {
    renderWithProviders(
      <ThinkPanel
        answerOptions={["1", "2"]}
        onSkip={vi.fn()}
        onSubmitAnswer={vi.fn()}
        prompt="What is one plus one?"
        resultMessage="Pick an answer."
      />
    );

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
  });
});