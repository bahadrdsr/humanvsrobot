import type Phaser from "phaser";

export type DragonBonesRuntime = {
  kind: "dragonbones";
  isAvailable: () => boolean;
  attach: (_scene: Phaser.Scene) => void;
};

export const dragonBonesRuntime: DragonBonesRuntime = {
  kind: "dragonbones",
  isAvailable: () => false,
  attach: () => {
    // Optional DragonBones integration point for future asset smoke tests.
  }
};