import type { RobotActionId } from "@/features/robot-actions/types";

const labels: Record<RobotActionId, string> = {
  speak: "speaking",
  hear: "listening",
  see: "looking",
  think: "thinking",
  dance: "dancing"
};

export function getStartMessage(actionId: RobotActionId) {
  return `The robot is ${labels[actionId]} now.`;
}

export function getIgnoredMessage(actionId: RobotActionId) {
  return `The robot is busy, so it cannot switch to ${labels[actionId]} yet.`;
}

export function getCompleteMessage(actionId: RobotActionId, detail?: string) {
  return detail ?? `The robot finished ${labels[actionId]}.`;
}

export function getFailureMessage(actionId: RobotActionId, detail: string) {
  return `The robot could not finish ${labels[actionId]}: ${detail}`;
}