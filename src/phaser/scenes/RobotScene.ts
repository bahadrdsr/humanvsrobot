import Phaser from "phaser";
import { createAnimationAdapter } from "@/phaser/adapters/animationAdapter";
import { RobotController } from "@/phaser/objects/RobotController";
import type { RobotActionId, RobotActionStatus } from "@/features/robot-actions/types";

export type SceneUpdateDetail = {
  actionId: RobotActionId | null;
  status: RobotActionStatus;
  message: string;
};

export class RobotScene extends Phaser.Scene {
  private controller?: RobotController;

  private listener?: (event: Event) => void;

  private resizeListener?: (gameSize: Phaser.Structs.Size) => void;

  private background?: Phaser.GameObjects.Rectangle;

  private sun?: Phaser.GameObjects.Arc;

  private cloud?: Phaser.GameObjects.Arc;

  private title?: Phaser.GameObjects.Text;

  constructor() {
    super("RobotScene");
  }

  preload() {
    this.load.image("robot-head", "/assets/head.png");
    this.load.image("robot-torso", "/assets/torso_and_legs.png");
    this.load.image("robot-left-arm", "/assets/left_arm.png");
    this.load.image("robot-right-arm", "/assets/right-Arm.png");
  }

  create() {
    this.background = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0xbde4ff, 1).setOrigin(0);
    this.sun = this.add.circle(90, 90, 62, 0xffd166, 0.45);
    this.cloud = this.add.circle(this.scale.width - 120, 150, 96, 0xffffff, 0.25);
    this.title = this.add.text(this.scale.width / 2, 38, "Robot stage", {
      color: "#16324f",
      fontFamily: "Tahoma",
      fontSize: "28px",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.controller = new RobotController(this, createAnimationAdapter());
    this.controller.layout();

    this.listener = (event: Event) => {
      const detail = (event as CustomEvent<SceneUpdateDetail>).detail;
      this.controller?.setState(detail.actionId, detail.status);
    };

    this.resizeListener = (gameSize: Phaser.Structs.Size) => {
      this.background?.setSize(gameSize.width, gameSize.height);
      this.sun?.setPosition(90, 90);
      this.cloud?.setPosition(gameSize.width - 120, 150);
      this.title?.setPosition(gameSize.width / 2, 38);
      this.controller?.layout();
    };

    window.addEventListener("humanvsrobot:scene-update", this.listener as EventListener);
    this.scale.on("resize", this.resizeListener);
  }

  shutdown() {
    if (this.listener) {
      window.removeEventListener("humanvsrobot:scene-update", this.listener as EventListener);
    }

    if (this.resizeListener) {
      this.scale.off("resize", this.resizeListener);
    }
  }
}