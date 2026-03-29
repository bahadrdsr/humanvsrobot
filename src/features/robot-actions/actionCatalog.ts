import type { RobotActionCatalogEntry, RobotActionId } from "@/features/robot-actions/types";

export const actionCatalog: Record<RobotActionId, RobotActionCatalogEntry> = {
  speak: {
    id: "speak",
    label: "Speak",
    icon: "\ud83d\udde3\ufe0f",
    description: "The robot talks back with a cheerful voice.",
    cancelSafe: true
  },
  hear: {
    id: "hear",
    label: "Hear",
    icon: "\ud83d\udc42",
    description: "The robot listens, then repeats what it heard.",
    cancelSafe: false
  },
  see: {
    id: "see",
    label: "See",
    icon: "\ud83d\udc41\ufe0f",
    description: "The robot opens its camera eyes.",
    cancelSafe: false
  },
  think: {
    id: "think",
    label: "Think",
    icon: "\ud83e\udd14",
    description: "Ask the robot to add two hand signs.",
    cancelSafe: false
  },
  dance: {
    id: "dance",
    label: "Dance",
    icon: "\ud83d\udd7a",
    description: "The robot grooves to show it can move!",
    cancelSafe: true
  }
};