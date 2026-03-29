import Phaser from "phaser";
import { RobotScene, type SceneUpdateDetail } from "@/phaser/scenes/RobotScene";

export function createGame(parent: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: parent.clientWidth || 960,
    height: parent.clientHeight || 720,
    backgroundColor: "#d8f5ff",
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [RobotScene]
  });
}

export function broadcastSceneUpdate(detail: SceneUpdateDetail) {
  window.dispatchEvent(new CustomEvent<SceneUpdateDetail>("humanvsrobot:scene-update", { detail }));
}