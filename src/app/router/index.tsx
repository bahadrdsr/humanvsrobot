import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LoginPage } from "@/features/auth/LoginPage";
import { GamePage } from "@/features/game-shell/GamePage";

export const router = createBrowserRouter([
  {
    element: (
      <AppShell>
        <Outlet />
      </AppShell>
    ),
    children: [
      {
        path: "/",
        element: <Navigate to="/game" replace />
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/game",
        element: <GamePage />
      }
    ]
  }
], { basename: import.meta.env.BASE_URL });