import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "@/components/layout/AppShell";
import { renderWithProviders } from "../utils/renderWithProviders";

describe("accessibility smoke coverage", () => {
  it("keeps the main region and stage content visible", () => {
    renderWithProviders(
      <AppShell>
        <div>Robot stage content</div>
      </AppShell>
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Robot stage content")).toBeInTheDocument();
  });
});