import type { RobotActionCatalogEntry, RobotActionId } from "@/features/robot-actions/types";

export const actionCatalog: Record<RobotActionId, RobotActionCatalogEntry> = {
  speak: {
    id: "speak",
    label: "Konus",
    icon: "\ud83d\udde3\ufe0f",
    description: "Bilgisayar neseli bir sesle karsilik verir.",
    cancelSafe: true
  },
  hear: {
    id: "hear",
    label: "Dinle",
    icon: "\ud83d\udc42",
    description: "Bilgisayar dinler, sonra duydugunu tekrar eder.",
    cancelSafe: false
  },
  see: {
    id: "see",
    label: "Gor",
    icon: "\ud83d\udc41\ufe0f",
    description: "Bilgisayar kamera goruntusunu acar.",
    cancelSafe: false
  },
  think: {
    id: "think",
    label: "Dusun",
    icon: "\ud83e\udd14",
    description: "Bilgisayardan iki el isaretini toplamasini iste.",
    cancelSafe: false
  },
  dance: {
    id: "dance",
    label: "Dans",
    icon: "\ud83d\udd7a",
    description: "Bilgisayar hareket edebildigini gostermek icin dans eder!",
    cancelSafe: true
  }
};