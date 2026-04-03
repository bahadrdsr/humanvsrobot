import type { RobotActionId } from "@/features/robot-actions/types";

const labels: Record<RobotActionId, string> = {
  speak: "konuşuyor",
  hear: "dinliyor",
  see: "bakıyor",
  think: "düşünüyor",
  dance: "dans ediyor"
};

const completionLabels: Record<RobotActionId, string> = {
  speak: "konuşmayı",
  hear: "dinlemeyi",
  see: "bakmayı",
  think: "düşünmeyi",
  dance: "dansı"
};

export function getStartMessage(actionId: RobotActionId) {
  return `Bilgisayar şimdi ${labels[actionId]}.`;
}

export function getIgnoredMessage(actionId: RobotActionId) {
  return `Bilgisayar meşgul, henüz ${labels[actionId]} moduna geçemiyor.`;
}

export function getCompleteMessage(actionId: RobotActionId, detail?: string) {
  return detail ?? `Bilgisayar ${completionLabels[actionId]} tamamladi.`;
}

export function getFailureMessage(actionId: RobotActionId, detail: string) {
  return `Bilgisayar ${completionLabels[actionId]} tamamlayamadi: ${detail}`;
}