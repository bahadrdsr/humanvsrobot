import { actionCatalog } from "@/features/robot-actions/actionCatalog";
import type { RobotActionId } from "@/features/robot-actions/types";

type ActionPanelProps = {
  currentAction: RobotActionId | null;
  onAction: (actionId: RobotActionId) => void;
};

export function ActionPanel({ currentAction, onAction }: ActionPanelProps) {
  const orderedActions = Object.values(actionCatalog);

  return (
    <div className="rounded-[1.75rem] bg-white/70 p-4 shadow-bubble backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-skyplay-teal">Action bar</p>
      <h2 className="mt-2 font-display text-2xl leading-tight text-skyplay-navy">Robot moves</h2>
      <div className="mt-4 flex flex-col gap-3">
        {orderedActions.map((action) => {
          const isActive = currentAction === action.id;
          return (
            <button
              aria-label={action.label}
              aria-pressed={isActive}
              className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${isActive ? "border-skyplay-teal bg-skyplay-teal text-white shadow-lg" : "border-white/70 bg-white/90 text-skyplay-navy shadow"}`}
              key={action.id}
              onClick={() => onAction(action.id)}
              type="button"
            >
              <span className="block font-display text-2xl">{action.label}</span>
              <span className={`mt-1 block text-sm leading-5 ${isActive ? "text-white/90" : "text-skyplay-navy/70"}`}>{action.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}