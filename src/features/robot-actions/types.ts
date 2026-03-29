export type RobotActionId = "speak" | "hear" | "see" | "think" | "dance";

export type RobotActionStatus =
  | "idle"
  | "starting"
  | "active"
  | "succeeded"
  | "failed"
  | "ignored"
  | "cancelled";

export type RobotActionState = {
  currentAction: RobotActionId | null;
  status: RobotActionStatus;
  message: string;
  updatedAt: number;
  lastCompletedAction: RobotActionId | null;
};

export type RobotActionEvent =
  | { type: "START"; actionId: RobotActionId; message: string }
  | { type: "ACTIVATE"; actionId: RobotActionId; message: string }
  | { type: "COMPLETE"; actionId: RobotActionId; message: string }
  | { type: "FAIL"; actionId: RobotActionId; message: string }
  | { type: "IGNORE"; actionId: RobotActionId; message: string }
  | { type: "CANCEL"; actionId: RobotActionId; message: string }
  | { type: "RESET"; message?: string };

export type RobotActionCatalogEntry = {
  id: RobotActionId;
  label: string;
  icon: string;
  description: string;
  cancelSafe: boolean;
};