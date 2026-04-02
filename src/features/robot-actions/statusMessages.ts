import type { RobotActionId } from "@/features/robot-actions/types";

const labels: Record<RobotActionId, string> = {
  speak: "konusuyor",
  hear: "dinliyor",
  see: "bakiyor",
  think: "dusunuyor",
  dance: "dans ediyor"
};

const completionLabels: Record<RobotActionId, string> = {
  speak: "konusmayi",
  hear: "dinlemeyi",
  see: "bakmayi",
  think: "dusunmeyi",
  dance: "dansi"
};

export function getStartMessage(actionId: RobotActionId) {
  return `Bilgisayar simdi ${labels[actionId]}.`;
}

export function getIgnoredMessage(actionId: RobotActionId) {
  return `Bilgisayar mesgul, henuz ${labels[actionId]} moduna gecemiyor.`;
}

export function getCompleteMessage(actionId: RobotActionId, detail?: string) {
  return detail ?? `Bilgisayar ${completionLabels[actionId]} tamamladi.`;
}

export function getFailureMessage(actionId: RobotActionId, detail: string) {
  return `Bilgisayar ${completionLabels[actionId]} tamamlayamadi: ${detail}`;
}