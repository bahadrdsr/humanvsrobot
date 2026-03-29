import { useNavigate } from "react-router-dom";
import { recordTelemetryEvent } from "@/lib/telemetry/logger";

export function LoginPage() {
  const navigate = useNavigate();
  const openPreview = () => {
    recordTelemetryEvent({
      eventType: "login_success",
      sessionId: "local-preview",
      details: { mode: "auth_placeholder" }
    });
    navigate("/game", { replace: true });
  };

  return (
    <section className="grid h-full place-items-center p-6">
      <div className="max-w-2xl rounded-[2.5rem] bg-white/78 p-8 text-skyplay-navy shadow-bubble backdrop-blur lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-skyplay-teal">Preview mode</p>
        <h1 className="mt-3 font-display text-4xl leading-tight">Auth is paused while we focus on the robot demo.</h1>
        <p className="mt-4 text-base leading-7 text-skyplay-navy/75">
          The stage opens directly now so the layout, controls, and robot animation can be refined first.
          When auth comes back, this screen can become the real presenter sign-in again.
        </p>
        <button
          className="mt-8 rounded-full bg-skyplay-teal px-7 py-4 text-lg font-bold text-white transition hover:scale-[1.01]"
          onClick={openPreview}
          type="button"
        >
          Open the robot stage
        </button>
      </div>
    </section>
  );
}