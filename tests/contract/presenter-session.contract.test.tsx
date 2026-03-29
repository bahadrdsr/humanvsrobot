import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import type { BrowserAuthClient, PresenterSession } from "@/lib/supabase/client";

function createStaticAuthClient(session: PresenterSession | null): BrowserAuthClient {
  return {
    getSession: async () => session,
    signIn: async () => {
      if (!session) {
        throw new Error("No session configured");
      }
      return session;
    },
    signOut: async () => undefined,
    onAuthStateChange: () => () => undefined
  };
}

describe("presenter session contract", () => {
  it("redirects anonymous presenters back to login", async () => {
    const authClient = createStaticAuthClient(null);

    render(
      <AuthProvider authClient={authClient} hydrateSession={false}>
        <MemoryRouter initialEntries={["/game"]}>
          <Routes>
            <Route path="/login" element={<div>login screen</div>} />
            <Route
              path="/game"
              element={
                <ProtectedRoute>
                  <div>game screen</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(await screen.findByText("login screen")).toBeInTheDocument();
  });

  it("allows authenticated presenters into the game route", async () => {
    const session: PresenterSession = {
      user: {
        id: "presenter-1",
        email: "teacher@example.com"
      },
      accessToken: "demo"
    };

    render(
      <AuthProvider authClient={createStaticAuthClient(session)} hydrateSession={false} initialSession={session}>
        <MemoryRouter initialEntries={["/game"]}>
          <Routes>
            <Route
              path="/game"
              element={
                <ProtectedRoute>
                  <div>game screen</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(await screen.findByText("game screen")).toBeInTheDocument();
  });
});