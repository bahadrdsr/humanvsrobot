import type { RobotActionCatalogEntry, RobotActionId } from "@/features/robot-actions/types";

export const actionCatalog: Record<RobotActionId, RobotActionCatalogEntry> = {
  speak: {
    id: "speak",
    label: "Speak",
    description: "The robot talks back with a cheerful voice.",
    cancelSafe: true
  },
  hear: {
    id: "hear",
    label: "Hear",
    description: "The robot listens, then repeats what it heard.",
    cancelSafe: false
  },
  see: {
    id: "see",
    label: "See",
    description: "The robot opens its camera eyes.",
    cancelSafe: false
  },
  think: {
    id: "think",
    label: "Think",
    description: "The robot asks a simple question.",
    cancelSafe: false
  },
  dance: {
    id: "dance",
    label: "Dance",
    description: "The robot grooves to show it can move!",
    cancelSafe: true
  }
};