import { useMemo } from "react";
import { ActionPanel } from "@/components/controls/ActionPanel";
import { LiveStatus } from "@/components/status/LiveStatus";
import { useRobotActionController } from "@/features/robot-actions/useRobotActionController";
import type { RobotActionId } from "@/features/robot-actions/types";
import { PhaserCanvas } from "@/features/game-shell/PhaserCanvas";
import { HearAction } from "@/features/senses/HearAction";
import { CameraPreview } from "@/features/senses/CameraPreview";
import { useSenseController } from "@/features/senses/useSenseController";
import { ThinkPanel } from "@/features/thinking/ThinkPanel";
import { useThinkController } from "@/features/thinking/useThinkController";
import { recordTelemetryEvent } from "@/lib/telemetry/logger";
import { speakText } from "@/lib/speech/synthesis";

const speakPhrases = [
  "Hello there. I am a playful robot.",
  "I can speak, dance, think, and learn with you.",
  "Let us try another robot trick."
];

export function GamePage() {
  const actionController = useRobotActionController();
  const senses = useSenseController();
  const thinking = useThinkController();

  const sessionId = "local-preview";

  const currentSceneMessage = useMemo(() => {
    if (thinking.state.phase !== "idle" && actionController.state.currentAction === "think") {
      return thinking.state.resultMessage;
    }

    if (senses.seeState.previewVisible) {
      return senses.seeState.message;
    }

    if (senses.hearState.transcript && actionController.state.currentAction !== "think") {
      return senses.hearState.message;
    }

    return actionController.state.message;
  }, [actionController.state.message, actionController.state.currentAction, senses.hearState.message, senses.hearState.transcript, senses.seeState.message, senses.seeState.previewVisible, thinking.state.phase, thinking.state.resultMessage]);

  const onAction = async (actionId: RobotActionId) => {
    if (actionId === "speak") {
      const phrase = speakPhrases[Math.floor(Math.random() * speakPhrases.length)];
      await actionController.runAction("speak", async () => {
        await speakText(phrase);
        recordTelemetryEvent({ eventType: "action_completed", actionId: "speak", sessionId, details: { phrase } });
        return phrase;
      });
      return;
    }

    if (actionId === "dance") {
      await actionController.runAction("dance", async () => {
        await new Promise((resolve) => window.setTimeout(resolve, 3200));
        recordTelemetryEvent({ eventType: "action_completed", actionId: "dance", sessionId, details: { animation: "dance" } });
        return "The robot made a cheerful dance.";
      });
      return;
    }

    if (actionId === "hear") {
      const started = actionController.startAction("hear");
      if (!started) {
        return;
      }

      try {
        const result = await senses.startHear();
        actionController.completeAction("hear", result.message);
        recordTelemetryEvent({ eventType: "action_completed", actionId: "hear", sessionId, details: { outcome: result.message } });
      } catch (reason: unknown) {
        const message = reason instanceof Error ? reason.message : "The robot could not listen right now.";
        actionController.failAction("hear", message);
        recordTelemetryEvent({
          eventType: message.toLowerCase().includes("permission") ? "permission_denied" : "action_failed",
          severity: "warning",
          actionId: "hear",
          sessionId,
          details: { reason: message }
        });
      }
      return;
    }

    if (actionId === "see") {
      if (actionController.state.currentAction === "see" && senses.seeState.previewVisible) {
        const message = senses.stopSee();
        actionController.completeAction("see", message);
        recordTelemetryEvent({ eventType: "action_completed", actionId: "see", sessionId, details: { outcome: "camera_closed" } });
        return;
      }

      const started = actionController.startAction("see");
      if (!started) {
        return;
      }

      try {
        const result = await senses.startSee();
        recordTelemetryEvent({ eventType: "action_completed", actionId: "see", sessionId, details: { outcome: result.message } });
      } catch (reason: unknown) {
        const message = reason instanceof Error ? reason.message : "The robot could not look right now.";
        recordTelemetryEvent({ eventType: "permission_denied", severity: "warning", actionId: "see", sessionId, details: { reason: message } });
        actionController.failAction("see", message);
      }
      return;
    }

    if (actionId === "think") {
      const started = actionController.startAction("think");
      if (!started) {
        return;
      }
      thinking.startPuzzle();
      await speakText("Pick two hand signs and I will add them!");
    }
  };

  const onSubmitFallback = async (text: string) => {
    try {
      const message = await senses.submitFallbackTranscript(text);
      actionController.completeAction("hear", message);
      recordTelemetryEvent({ eventType: "action_completed", actionId: "hear", sessionId, details: { fallback: true } });
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : "The robot could not repeat that phrase.";
      actionController.failAction("hear", message);
      recordTelemetryEvent({ eventType: "action_failed", severity: "warning", actionId: "hear", sessionId, details: { reason: message } });
    }
  };

  const onSubmitThinkPuzzle = async () => {
    try {
      const message = thinking.submitPuzzle(thinking.state.left, thinking.state.right);
      await speakText(message);
      actionController.completeAction("think", message);
      recordTelemetryEvent({ eventType: "action_completed", actionId: "think", sessionId, details: { left: thinking.state.left, right: thinking.state.right, answer: thinking.state.left + thinking.state.right } });
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : "The robot could not figure that out.";
      actionController.failAction("think", message);
    }
  };

  const onCloseCameraPreview = () => {
    const message = senses.stopSee();
    actionController.completeAction("see", message);
    recordTelemetryEvent({ eventType: "action_completed", actionId: "see", sessionId, details: { outcome: "camera_closed" } });
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-2 p-2 sm:gap-3 sm:p-3 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-4 lg:p-4">
      <div className="relative min-h-0 flex-[5_5_0] overflow-hidden rounded-[2rem] bg-white/15 lg:flex-none lg:rounded-[2.5rem]">
        <PhaserCanvas actionId={actionController.sceneState.actionId} message={currentSceneMessage} status={actionController.sceneState.status} />
        {!senses.seeState.previewVisible ? (
          <div className="pointer-events-none absolute left-4 top-4 rounded-[1.5rem] bg-white/72 px-4 py-3 shadow-bubble backdrop-blur lg:left-6 lg:top-6 lg:max-w-md lg:rounded-[1.75rem] lg:px-5 lg:py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-skyplay-teal">Human vs Robot</p>
            <h1 className="mt-1 font-display text-xl leading-tight text-skyplay-navy lg:mt-2 lg:text-3xl">See, hear, speak, think, and dance</h1>
            <p className="mt-1 hidden text-sm leading-6 text-skyplay-navy/75 lg:block">Tap the buttons on the right to make the robot perform each skill.</p>
          </div>
        ) : null}
        <CameraPreview message={senses.seeState.message} onClose={onCloseCameraPreview} stream={senses.cameraStream} visible={senses.seeState.previewVisible} />
      </div>
      <aside className="flex min-h-0 flex-[4_4_0] flex-col gap-2 overflow-hidden rounded-[2rem] bg-white/28 p-2 backdrop-blur-xl sm:gap-3 sm:p-3 lg:flex-none lg:gap-3 lg:rounded-[2.25rem] lg:p-4 lg:shadow-bubble">
        <LiveStatus message={currentSceneMessage} />
        <ActionPanel currentAction={actionController.state.currentAction} onAction={onAction} />
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1 lg:gap-3">
            <div className={actionController.state.currentAction === "hear" ? "" : "hidden lg:block"}>
              <HearAction
                clipDurationMs={senses.hearState.clipDurationMs}
                fallbackText={senses.hearState.fallbackText}
                hasRecording={Boolean(senses.hearState.recordingUrl)}
                message={senses.hearState.message}
                onPlayRecording={async () => {
                  await senses.playHearRecording();
                }}
                onSubmitFallback={onSubmitFallback}
                playbackState={senses.hearState.playbackState}
                transcript={senses.hearState.transcript}
              />
            </div>
            <div className={actionController.state.currentAction === "think" ? "" : "hidden lg:block"}>
              <ThinkPanel
                onSetLeft={thinking.setLeft}
                onSetRight={thinking.setRight}
                onSubmit={onSubmitThinkPuzzle}
                state={thinking.state}
              />
            </div>
        </div>
      </aside>
    </section>
  );
}