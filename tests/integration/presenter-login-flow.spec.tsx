import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { LoginPage } from "@/features/auth/LoginPage";

describe("presenter login flow", () => {
  it("opens the game route from the placeholder preview screen", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/game" element={<div>game screen</div>} />
        </Routes>
      </MemoryRouter>
    );

    const start = performance.now();
    await user.click(screen.getByRole("button", { name: /bilgisayar sahnesini ac/i }));
    await screen.findByText("game screen");
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(1000);
  });
});