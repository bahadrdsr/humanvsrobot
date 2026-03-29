import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/app/providers/AuthProvider";
import type { BrowserAuthClient, PresenterSession } from "@/lib/supabase/client";

type RenderOptions = {
  route?: string;
  authClient?: BrowserAuthClient;
  initialSession?: PresenterSession | null;
};

export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}) {
  const { route = "/", authClient, initialSession = null } = options;

  return render(
    <AuthProvider authClient={authClient} hydrateSession={false} initialSession={initialSession}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}