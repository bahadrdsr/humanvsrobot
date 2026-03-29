import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { usePresenterSession } from "@/features/auth/usePresenterSession";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { status, isAuthenticated } = usePresenterSession();

  if (status === "loading" || status === "authenticating") {
    return (
      <div className="rounded-[2rem] bg-white/80 p-8 shadow-bubble">
        <p className="text-lg font-semibold text-skyplay-navy">Checking the presenter pass...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}