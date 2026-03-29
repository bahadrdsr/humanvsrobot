import type Phaser from "phaser";
import { dragonBonesRuntime } from "@/phaser/adapters/dragonBonesRuntime";
import { spineRuntime } from "@/phaser/adapters/spineRuntime";

export type AnimationRuntimeKind = "spine" | "dragonbones" | "vector";

export type AnimationAdapter = {
  runtime: AnimationRuntimeKind;
  attach: (scene: Phaser.Scene) => void;
};

export function createAnimationAdapter(): AnimationAdapter {
  if (spineRuntime.isAvailable()) {
    return {
      runtime: "spine",
      attach: (scene) => spineRuntime.attach(scene)
    };
  }

  if (dragonBonesRuntime.isAvailable()) {
    return {
      runtime: "dragonbones",
      attach: (scene) => dragonBonesRuntime.attach(scene)
    };
  }

  return {
    runtime: "vector",
    attach: () => {}
  };
}