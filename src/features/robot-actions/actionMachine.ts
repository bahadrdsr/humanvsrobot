import type { RobotActionEvent, RobotActionState } from "@/features/robot-actions/types";

export const initialRobotActionState: RobotActionState = {
  currentAction: null,
  status: "idle",
  message: "Press a robot button to start the demo.",
  updatedAt: Date.now(),
  lastCompletedAction: null
};

export function robotActionReducer(state: RobotActionState, event: RobotActionEvent): RobotActionState {
  const updatedAt = Date.now();

  switch (event.type) {
    case "START":
      return {
        ...state,
        currentAction: event.actionId,
        status: "starting",
        message: event.message,
        updatedAt
      };
    case "ACTIVATE":
      return {
        ...state,
        currentAction: event.actionId,
        status: "active",
        message: event.message,
        updatedAt
      };
    case "COMPLETE":
      return {
        ...state,
        currentAction: null,
        status: "succeeded",
        message: event.message,
        updatedAt,
        lastCompletedAction: event.actionId
      };
    case "FAIL":
      return {
        ...state,
        currentAction: null,
        status: "failed",
        message: event.message,
        updatedAt
      };
    case "IGNORE":
      return {
        ...state,
        status: "ignored",
        message: event.message,
        updatedAt
      };
    case "CANCEL":
      return {
        ...state,
        currentAction: null,
        status: "cancelled",
        message: event.message,
        updatedAt
      };
    case "RESET":
      return {
        ...state,
        currentAction: null,
        status: "idle",
        message: event.message ?? initialRobotActionState.message,
        updatedAt
      };
    default:
      return state;
  }
}