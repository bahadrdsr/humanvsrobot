import type Phaser from "phaser";

export type SpineRuntime = {
  kind: "spine";
  isAvailable: () => boolean;
  attach: (_scene: Phaser.Scene) => void;
};

export const spineRuntime: SpineRuntime = {
  kind: "spine",
  isAvailable: () => false,
  attach: () => {
    // Asset-backed Spine integration can attach here when animation exports are added.
  }
};