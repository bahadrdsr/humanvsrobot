import { actionCatalog } from "@/features/robot-actions/actionCatalog";
import type { RobotActionId } from "@/features/robot-actions/types";

type ActionPanelProps = {
  currentAction: RobotActionId | null;
  onAction: (actionId: RobotActionId) => void;
};

export function ActionPanel({ currentAction, onAction }: ActionPanelProps) {
  const orderedActions = Object.values(actionCatalog);

  return (
    <div className="rounded-[1.5rem] bg-white/70 p-3 shadow-bubble backdrop-blur lg:rounded-[1.75rem] lg:p-4">
      {/* Mobile: compact icon grid */}
      <div className="grid grid-cols-5 gap-1.5 lg:hidden">
        {orderedActions.map((action) => {
          const isActive = currentAction === action.id;
          return (
            <button
              aria-label={action.label}
              aria-pressed={isActive}
              className={`touch-manipulation flex flex-col items-center justify-center gap-0.5 rounded-2xl py-2.5 transition active:scale-95 ${
                isActive
                  ? "bg-skyplay-teal text-white shadow-lg"
                  : "bg-white/90 text-skyplay-navy shadow"
              }`}
              key={action.id}
              onClick={() => onAction(action.id)}
              type="button"
            >
              <span className="text-2xl leading-none">{action.icon}</span>
              <span className="text-[10px] font-bold leading-tight">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop: full descriptive list */}
      <div className="hidden lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-skyplay-teal">Action bar</p>
        <h2 className="mt-2 font-display text-2xl leading-tight text-skyplay-navy">Robot moves</h2>
        <div className="mt-4 flex flex-col gap-3">
          {orderedActions.map((action) => {
            const isActive = currentAction === action.id;
            return (
              <button
                aria-label={action.label}
                aria-pressed={isActive}
                className={`touch-manipulation rounded-[1.5rem] border px-4 py-4 text-left transition active:scale-[0.98] ${
                  isActive
                    ? "border-skyplay-teal bg-skyplay-teal text-white shadow-lg"
                    : "border-white/70 bg-white/90 text-skyplay-navy shadow"
                }`}
                key={action.id}
                onClick={() => onAction(action.id)}
                type="button"
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl leading-none">{action.icon}</span>
                  <span className="font-display text-2xl">{action.label}</span>
                </span>
                <span className={`mt-1 block text-sm leading-5 ${
                  isActive ? "text-white/90" : "text-skyplay-navy/70"
                }`}>{action.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}