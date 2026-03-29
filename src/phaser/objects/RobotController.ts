import Phaser from "phaser";
import type { AnimationAdapter } from "@/phaser/adapters/animationAdapter";
import type { RobotActionId, RobotActionStatus } from "@/features/robot-actions/types";

export class RobotController {
  private container: Phaser.GameObjects.Container;

  private robotBody: Phaser.GameObjects.Container;

  private torso: Phaser.GameObjects.Image;

  private head: Phaser.GameObjects.Image;

  private leftArm: Phaser.GameObjects.Image;

  private rightArm: Phaser.GameObjects.Image;

  private halo: Phaser.GameObjects.Ellipse;

  private stageShadow: Phaser.GameObjects.Ellipse;

  private restingY = 0;

  private baseHeadY = 0;

  private baseLeftArmX = 0;

  private baseLeftArmY = 0;

  private baseRightArmX = 0;

  private baseRightArmY = 0;

  private baseHaloY = 0;

  private baseShadowY = 0;

  private baseHeadSize = 0;

  private fxObjects: Phaser.GameObjects.Arc[] = [];

  private fxTweens: Phaser.Tweens.Tween[] = [];

  private face!: Phaser.GameObjects.Graphics;

  constructor(private scene: Phaser.Scene, private adapter: AnimationAdapter) {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2 + 30;

    this.stageShadow = this.scene.add.ellipse(0, 255, 350, 76, 0x16324f, 0.16);
    this.halo = this.scene.add.ellipse(0, 0, 410, 540, 0xffffff, 0.08);
    this.leftArm = this.scene.add.image(0, 0, "robot-left-arm");
    this.rightArm = this.scene.add.image(0, 0, "robot-right-arm");
    this.torso = this.scene.add.image(0, 0, "robot-torso");
    this.head = this.scene.add.image(0, 0, "robot-head");

    this.leftArm.setOrigin(0.78, 0.12);
    this.rightArm.setOrigin(0.22, 0.12);
    this.head.setOrigin(0.5);
    this.torso.setOrigin(0.5);

    this.face = this.scene.add.graphics();

    this.robotBody = this.scene.add.container(0, 0, [
      this.leftArm,
      this.rightArm,
      this.torso,
      this.head,
      this.face
    ]);

    this.container = this.scene.add.container(centerX, centerY, [
      this.stageShadow,
      this.halo,
      this.robotBody,
    ]);

    this.adapter.attach(this.scene);
  }

  layout() {
    const minDimension = Math.min(this.scene.scale.width, this.scene.scale.height);
    const torsoHeight = minDimension * 0.62;
    const torsoWidth = torsoHeight * 0.72;
    const headSize = minDimension * 0.33;
    this.baseHeadSize = headSize;
    const armHeight = torsoHeight * 0.79;
    const armWidth = armHeight * 0.36;

    this.restingY = this.scene.scale.height / 2 + minDimension * 0.13;
    this.container.setPosition(this.scene.scale.width / 2, this.restingY);

    this.torso.setDisplaySize(torsoWidth, torsoHeight);
    this.head.setDisplaySize(headSize, headSize);
    this.leftArm.setDisplaySize(armWidth, armHeight);
    this.rightArm.setDisplaySize(armWidth, armHeight);

    this.baseHeadY = -torsoHeight * 0.62;
    this.baseLeftArmX = -torsoWidth * 0.4;
    this.baseLeftArmY = -torsoHeight * 0.15;
    this.baseRightArmX = torsoWidth * 0.4;
    this.baseRightArmY = -torsoHeight * 0.15;
    this.baseShadowY = torsoHeight * 0.64;
    this.baseHaloY = torsoHeight * 0.02;

    this.robotBody.setPosition(0, 0);
    this.torso.setPosition(0, torsoHeight * 0.1);
    this.head.setPosition(0, this.baseHeadY);
    this.leftArm.setPosition(this.baseLeftArmX, this.baseLeftArmY);
    this.rightArm.setPosition(this.baseRightArmX, this.baseRightArmY);
    this.stageShadow.setPosition(0, this.baseShadowY).setSize(torsoWidth * 1.3, torsoHeight * 0.16);
    this.halo.setPosition(0, this.baseHaloY).setSize(torsoWidth * 1.5, torsoHeight * 1.32);
  }

  private resetPose() {
    this.clearFx();
    this.container.setPosition(this.scene.scale.width / 2, this.restingY);
    this.container.setAngle(0).setScale(1);
    this.robotBody.setPosition(0, 0).setAngle(0).setScale(1);
    this.torso.setRotation(0);
    this.head.setPosition(0, this.baseHeadY).setRotation(0);
    this.leftArm.setPosition(this.baseLeftArmX, this.baseLeftArmY).setRotation(0);
    this.rightArm.setPosition(this.baseRightArmX, this.baseRightArmY).setRotation(0);
    this.halo
      .setPosition(0, this.baseHaloY)
      .setScale(1)
      .setAlpha(0.08)
      .setFillStyle(0xffffff, 0.08);
    this.stageShadow
      .setPosition(0, this.baseShadowY)
      .setScale(1)
      .setAlpha(0.16);
  }

  private clearFx() {
    for (const t of this.fxTweens) {
      t.stop();
      this.scene.tweens.remove(t);
    }
    for (const obj of this.fxObjects) {
      obj.destroy();
    }
    this.fxTweens = [];
    this.fxObjects = [];
    this.face.clear();
  }

  /** Draw a facial expression directly on the head's TV screen area. */
  private drawFace(expression: "neutral" | "speaking" | "listening" | "scanning" | "thinking" | "happy") {
    this.face.clear();
    const h = this.baseHeadSize;
    // The screen sits in the upper-centre of the head PNG.
    // Empirically the screen spans ~45% of headSize and is centred ~15% above the head centre.
    const sw = h * 0.36;   // screen half-width
    const sh = h * 0.20;   // screen half-height
    const cx = 0;
    const cy = this.baseHeadY - h * 0.10;  // screen centre y (relative to robotBody origin)

    switch (expression) {
      case "neutral": {
        // Two calm circle eyes
        this.face.fillStyle(0x00ffcc, 1);
        this.face.fillCircle(cx - sw * 0.38, cy - sh * 0.12, h * 0.034);
        this.face.fillCircle(cx + sw * 0.38, cy - sh * 0.12, h * 0.034);
        // Flat mouth line
        this.face.lineStyle(h * 0.022, 0x00ffcc, 0.8);
        this.face.beginPath();
        this.face.moveTo(cx - sw * 0.38, cy + sh * 0.44);
        this.face.lineTo(cx + sw * 0.38, cy + sh * 0.44);
        this.face.strokePath();
        break;
      }
      case "speaking": {
        // Wide open happy eyes + big O mouth
        this.face.fillStyle(0xffd166, 1);
        this.face.fillCircle(cx - sw * 0.4, cy - sh * 0.1, h * 0.044);
        this.face.fillCircle(cx + sw * 0.4, cy - sh * 0.1, h * 0.044);
        this.face.fillStyle(0xff7f50, 1);
        this.face.fillEllipse(cx, cy + sh * 0.5, sw * 0.62, sh * 0.64);
        // Teeth
        this.face.fillStyle(0xffffff, 1);
        this.face.fillRect(cx - sw * 0.22, cy + sh * 0.22, sw * 0.44, sh * 0.22);
        break;
      }
      case "listening": {
        // Wide surprised eyes + small curious mouth
        this.face.fillStyle(0x4cb4ff, 1);
        this.face.fillEllipse(cx - sw * 0.38, cy - sh * 0.12, h * 0.072, h * 0.086);
        this.face.fillEllipse(cx + sw * 0.38, cy - sh * 0.12, h * 0.072, h * 0.086);
        this.face.lineStyle(h * 0.022, 0x4cb4ff, 1);
        this.face.beginPath();
        this.face.arc(cx, cy + sh * 0.3, sw * 0.3, Phaser.Math.DegToRad(10), Phaser.Math.DegToRad(170));
        this.face.strokePath();
        break;
      }
      case "scanning": {
        // Narrowed horizontal bar eyes (scanning)
        this.face.fillStyle(0x1fff8b, 1);
        this.face.fillRect(cx - sw * 0.54, cy - sh * 0.24, sw * 0.44, h * 0.026);
        this.face.fillRect(cx + sw * 0.10, cy - sh * 0.24, sw * 0.44, h * 0.026);
        // Neutral mouth
        this.face.lineStyle(h * 0.02, 0x1fff8b, 0.7);
        this.face.beginPath();
        this.face.moveTo(cx - sw * 0.32, cy + sh * 0.48);
        this.face.lineTo(cx + sw * 0.32, cy + sh * 0.48);
        this.face.strokePath();
        // Scan-line sweep
        this.face.lineStyle(h * 0.016, 0x1fff8b, 0.4);
        this.face.beginPath();
        this.face.moveTo(cx - sw * 0.54, cy);
        this.face.lineTo(cx + sw * 0.54, cy);
        this.face.strokePath();
        break;
      }
      case "thinking": {
        // Eyes looking up-left
        this.face.fillStyle(0xcc88ff, 1);
        this.face.fillCircle(cx - sw * 0.38, cy - sh * 0.22, h * 0.036);
        this.face.fillCircle(cx + sw * 0.38, cy - sh * 0.22, h * 0.036);
        // Pupils shifted up-left
        this.face.fillStyle(0x16324f, 1);
        this.face.fillCircle(cx - sw * 0.44, cy - sh * 0.34, h * 0.016);
        this.face.fillCircle(cx + sw * 0.32, cy - sh * 0.34, h * 0.016);
        // Wavy mouth
        this.face.lineStyle(h * 0.022, 0xcc88ff, 0.9);
        this.face.beginPath();
        this.face.moveTo(cx - sw * 0.38, cy + sh * 0.44);
        this.face.lineTo(cx - sw * 0.12, cy + sh * 0.36);
        this.face.lineTo(cx + sw * 0.12, cy + sh * 0.52);
        this.face.lineTo(cx + sw * 0.38, cy + sh * 0.44);
        this.face.strokePath();
        break;
      }
      case "happy": {
        // Big crescent eyes + wide grin
        this.face.fillStyle(0xffd166, 1);
        this.face.fillCircle(cx - sw * 0.38, cy - sh * 0.1, h * 0.044);
        this.face.fillCircle(cx + sw * 0.38, cy - sh * 0.1, h * 0.044);
        this.face.lineStyle(h * 0.028, 0xffd166, 1);
        this.face.beginPath();
        this.face.arc(cx, cy + sh * 0.18, sw * 0.48, Phaser.Math.DegToRad(20), Phaser.Math.DegToRad(160));
        this.face.strokePath();
        break;
      }
    }
  }

  private addSpeakFx() {
    const headR = this.baseHeadSize * 0.5;
    const cx = headR + 6;
    const cy = this.baseHeadY + headR * 0.2;
    for (let i = 0; i < 3; i++) {
      const r = headR * (0.22 + i * 0.1);
      const arc = this.scene.add.arc(cx, cy, r, -65, 65, false, 0, 0);
      arc.setStrokeStyle(3, 0xffd166, 1);
      this.robotBody.add(arc);
      this.fxObjects.push(arc);
      const travel = headR * (0.55 + i * 0.25);
      const tween = this.scene.tweens.add({
        targets: arc,
        x: { from: cx, to: cx + travel },
        alpha: { from: 1, to: 0 },
        delay: i * 160,
        duration: 480,
        repeat: -1
      });
      this.fxTweens.push(tween);
    }
  }

  private addHearFx() {
    const headR = this.baseHeadSize * 0.5;
    const cx = -headR - 6;
    const cy = this.baseHeadY;
    for (let i = 0; i < 3; i++) {
      const r = headR * (0.22 + i * 0.1);
      const arc = this.scene.add.arc(cx, cy, r, 115, 245, false, 0, 0);
      arc.setStrokeStyle(3, 0x4cb4ff, 1);
      this.robotBody.add(arc);
      this.fxObjects.push(arc);
      const travel = headR * (0.55 + i * 0.25);
      const tween = this.scene.tweens.add({
        targets: arc,
        x: { from: cx - travel, to: cx },
        alpha: { from: 1, to: 0 },
        delay: i * 160,
        duration: 480,
        repeat: -1
      });
      this.fxTweens.push(tween);
    }
  }

  private addSeeFx() {
    const headR = this.baseHeadSize * 0.5;
    const cx = 0;
    const cy = this.baseHeadY;
    for (let i = 0; i < 2; i++) {
      const circle = this.scene.add.arc(cx, cy, headR * 0.55, 0, 360, false, 0, 0);
      circle.setStrokeStyle(2, 0x1f9d8b, 1);
      this.robotBody.add(circle);
      this.fxObjects.push(circle);
      const tween = this.scene.tweens.add({
        targets: circle,
        scaleX: { from: 1, to: 2.8 },
        scaleY: { from: 1, to: 2.8 },
        alpha: { from: 0.9, to: 0 },
        delay: i * 380,
        duration: 760,
        repeat: -1
      });
      this.fxTweens.push(tween);
    }
  }

  private addThinkFx() {
    const headR = this.baseHeadSize * 0.5;
    const baseY = this.baseHeadY - headR - 8;
    const sizes = [7, 11, 17];
    const xs = [headR * 0.45, headR * 0.18, -headR * 0.08];
    const ys = [0, -headR * 0.58, -headR * 1.28];
    for (let i = 0; i < 3; i++) {
      const bubble = this.scene.add.arc(xs[i], baseY + ys[i], sizes[i], 0, 360, false, 0xffffff, 0.88);
      bubble.setStrokeStyle(2, 0xaaaaff, 1);
      this.robotBody.add(bubble);
      this.fxObjects.push(bubble);
      const tween = this.scene.tweens.add({
        targets: bubble,
        y: { from: baseY + ys[i], to: baseY + ys[i] - 10 },
        alpha: { from: 0.88, to: 0.42 },
        yoyo: true,
        repeat: -1,
        duration: 560 + i * 110,
        delay: i * 130
      });
      this.fxTweens.push(tween);
    }
  }

  setState(actionId: RobotActionId | null, status: RobotActionStatus) {
    this.scene.tweens.killTweensOf(this.container);
    this.scene.tweens.killTweensOf(this.head);
    this.scene.tweens.killTweensOf(this.leftArm);
    this.scene.tweens.killTweensOf(this.rightArm);
    this.scene.tweens.killTweensOf(this.halo);
    this.scene.tweens.killTweensOf(this.stageShadow);
    this.scene.tweens.killTweensOf(this.robotBody);

    this.layout();
    this.resetPose();

    if (!actionId || status === "idle") {
      this.drawFace("neutral");
      // Gentle idle float
      this.scene.tweens.add({
        targets: this.container,
        y: this.restingY - 9,
        yoyo: true,
        repeat: -1,
        duration: 1900,
        ease: "Sine.easeInOut"
      });
      // Natural arm swing (left and right offset by half period)
      this.scene.tweens.add({
        targets: this.leftArm,
        angle: 8,
        yoyo: true,
        repeat: -1,
        duration: 1400,
        ease: "Sine.easeInOut"
      });
      this.scene.tweens.add({
        targets: this.rightArm,
        angle: -8,
        yoyo: true,
        repeat: -1,
        duration: 1400,
        delay: 700,
        ease: "Sine.easeInOut"
      });
      return;
    }

    switch (actionId) {
      case "speak":
        this.drawFace("speaking");
        this.addSpeakFx();
        this.scene.tweens.add({
          targets: this.halo,
          alpha: 0.28,
          scaleX: 1.05,
          scaleY: 1.05,
          yoyo: true,
          repeat: -1,
          duration: 220
        });
        break;
      case "hear":
        this.drawFace("listening");
        this.addHearFx();
        this.scene.tweens.add({
          targets: this.halo,
          alpha: 0.26,
          scaleX: 1.06,
          scaleY: 1.06,
          yoyo: true,
          repeat: -1,
          duration: 240
        });
        break;
      case "see":
        this.drawFace("scanning");
        this.addSeeFx();
        this.scene.tweens.add({
          targets: this.halo,
          alpha: 0.34,
          scaleX: 1.12,
          scaleY: 1.12,
          yoyo: true,
          repeat: -1,
          duration: 400
        });
        break;
      case "think":
        this.drawFace("thinking");
        this.addThinkFx();
        this.scene.tweens.add({
          targets: this.halo,
          alpha: 0.32,
          scaleX: 1.14,
          scaleY: 1.14,
          yoyo: true,
          repeat: -1,
          duration: 260
        });
        break;
      case "dance":
        this.drawFace("happy");
        // Body sway left–right
        this.scene.tweens.add({
          targets: this.container,
          angle: { from: -9, to: 9 },
          yoyo: true,
          repeat: 4,
          duration: 300,
          ease: "Sine.easeInOut"
        });
        // Left arm pumps up
        this.scene.tweens.add({
          targets: this.leftArm,
          angle: -50,
          y: this.baseLeftArmY - 28,
          yoyo: true,
          repeat: 4,
          duration: 300,
          ease: "Sine.easeInOut"
        });
        // Right arm pumps up, offset by one step for alternating feel
        this.scene.tweens.add({
          targets: this.rightArm,
          angle: 50,
          y: this.baseRightArmY - 28,
          yoyo: true,
          repeat: 4,
          duration: 300,
          delay: 300,
          ease: "Sine.easeInOut"
        });
        // Head bob
        this.scene.tweens.add({
          targets: this.head,
          y: this.baseHeadY - 14,
          yoyo: true,
          repeat: 9,
          duration: 150,
          ease: "Sine.easeInOut"
        });
        // Halo pulses with colour shift
        this.scene.tweens.add({
          targets: this.halo,
          alpha: 0.28,
          scaleX: 1.25,
          scaleY: 1.25,
          yoyo: true,
          repeat: 4,
          duration: 300
        });
        // Shadow shrinks + expands with bounce feel
        this.scene.tweens.add({
          targets: this.stageShadow,
          scaleX: 0.72,
          alpha: 0.08,
          yoyo: true,
          repeat: 4,
          duration: 300
        });
        break;
    }
  }
}