import type { PropsWithChildren } from "react";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="h-screen overflow-hidden bg-transparent text-skyplay-navy">
      <main className="h-full">{children}</main>
    </div>
  );
}