import type { RobotActionCatalogEntry, RobotActionId } from "@/features/robot-actions/types";

export const actionCatalog: Record<RobotActionId, RobotActionCatalogEntry> = {
  speak: {
    id: "speak",
    label: "Konuş",
    icon: "\ud83d\udde3\ufe0f",
    description: "Bilgisayar neşeli bir sesle karşılık verir.",
    cancelSafe: true
  },
  hear: {
    id: "hear",
    label: "Dinle",
    icon: "\ud83d\udc42",
    description: "Bilgisayar dinler, sonra duyduğunu tekrar eder.",
    cancelSafe: false
  },
  see: {
    id: "see",
    label: "Gör",
    icon: "\ud83d\udc41\ufe0f",
    description: "Bilgisayar kamera görüntüsünü açar.",
    cancelSafe: false
  },
  think: {
    id: "think",
    label: "Düşün",
    icon: "\ud83e\udd14",
    description: "Bilgisayardan iki el işaretini toplamasını iste.",
    cancelSafe: false
  },
  dance: {
    id: "dance",
    label: "Dans",
    icon: "\ud83d\udd7a",
    description: "Bilgisayar hareket edebildiğini göstermek için dans eder!",
    cancelSafe: true
  }
};