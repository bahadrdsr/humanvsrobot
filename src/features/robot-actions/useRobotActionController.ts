import { useMemo, useReducer } from "react";
import { actionCatalog } from "@/features/robot-actions/actionCatalog";
import { robotActionReducer, initialRobotActionState } from "@/features/robot-actions/actionMachine";
import { getCompleteMessage, getFailureMessage, getIgnoredMessage, getStartMessage } from "@/features/robot-actions/statusMessages";
import type { RobotActionId } from "@/features/robot-actions/types";

export function useRobotActionController() {
  const [state, dispatch] = useReducer(robotActionReducer, initialRobotActionState);

  const startAction = (actionId: RobotActionId, message = getStartMessage(actionId)) => {
    if (state.currentAction) {
      const currentEntry = actionCatalog[state.currentAction];
      if (!currentEntry.cancelSafe) {
        dispatch({ type: "IGNORE", actionId, message: getIgnoredMessage(actionId) });
        return false;
      }

      dispatch({ type: "CANCEL", actionId: state.currentAction, message: `${currentEntry.label} durduruldu, bilgisayar baska bir eyleme gecti.` });
    }

    dispatch({ type: "START", actionId, message });
    dispatch({ type: "ACTIVATE", actionId, message });
    return true;
  };

  const completeAction = (actionId: RobotActionId, detail?: string) => {
    dispatch({ type: "COMPLETE", actionId, message: getCompleteMessage(actionId, detail) });
  };

  const failAction = (actionId: RobotActionId, detail: string) => {
    dispatch({ type: "FAIL", actionId, message: getFailureMessage(actionId, detail) });
  };

  const resetAction = (message?: string) => {
    dispatch({ type: "RESET", message });
  };

  const runAction = async (actionId: RobotActionId, runner: () => Promise<string | void>) => {
    const canStart = startAction(actionId);
    if (!canStart) {
      return false;
    }

    try {
      const result = await runner();
      completeAction(actionId, typeof result === "string" ? result : undefined);
      return true;
    } catch (reason: unknown) {
      failAction(actionId, reason instanceof Error ? reason.message : "Bir seyler ters gitti.");
      return false;
    }
  };

  const sceneState = useMemo(() => ({
    actionId: state.currentAction,
    status: state.status,
    message: state.message
  }), [state.currentAction, state.message, state.status]);

  return {
    state,
    sceneState,
    startAction,
    completeAction,
    failAction,
    resetAction,
    runAction
  };
}