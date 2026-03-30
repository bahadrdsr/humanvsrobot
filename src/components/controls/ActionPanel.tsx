import { actionCatalog } from "@/features/robot-actions/actionCatalog";
import type { RobotActionId } from "@/features/robot-actions/types";

type ActionPanelProps = {
  currentAction: RobotActionId | null;
  onAction: (actionId: RobotActionId) => void;
};

export function ActionPanel({ currentAction, onAction }: ActionPanelProps) {
  const orderedActions = Object.values(actionCatalog);

  return (
    <div className="rounded-[1.5rem] bg-white/70 p-3 shadow-bubble backdrop-blur">
      <div className="grid grid-cols-5 gap-1.5">
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
    </div>
  );
}