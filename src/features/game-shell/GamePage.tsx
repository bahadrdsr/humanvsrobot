import { useMemo } from "react";
import { ActionPanel } from "@/components/controls/ActionPanel";
import { LiveStatus } from "@/components/status/LiveStatus";
import { useRobotActionController } from "@/features/robot-actions/useRobotActionController";
import type { RobotActionId } from "@/features/robot-actions/types";
import { PhaserCanvas } from "@/features/game-shell/PhaserCanvas";
import { CameraPreview } from "@/features/senses/CameraPreview";
import { HearAction } from "@/features/senses/HearAction";
import { useSenseController } from "@/features/senses/useSenseController";
import { ThinkPanel } from "@/features/thinking/ThinkPanel";
import { useThinkController } from "@/features/thinking/useThinkController";
import { recordTelemetryEvent } from "@/lib/telemetry/logger";
import { speakText } from "@/lib/speech/synthesis";

const speakPhrases = [
  "Merhaba! Ben eglenceli bir bilgisayarim.",
  "Seninle konusabilir, dinleyebilir, dusunebilir ve dans edebilirim.",
  "Haydi baska bir bilgisayar numarasi deneyelim."
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

    if ((actionController.state.currentAction === "hear" || senses.hearState.transcript || senses.hearState.recordingUrl || senses.hearState.deviceState === "failed") && actionController.state.currentAction !== "think") {
      return senses.hearState.message;
    }

    return actionController.state.message;
  }, [actionController.state.message, actionController.state.currentAction, senses.hearState.deviceState, senses.hearState.message, senses.hearState.recordingUrl, senses.hearState.transcript, senses.seeState.message, senses.seeState.previewVisible, thinking.state.phase, thinking.state.resultMessage]);

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
        return "Bilgisayar neseli bir dans etti.";
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
        const message = reason instanceof Error ? reason.message : "Bilgisayar su anda dinleyemiyor.";
        actionController.failAction("hear", message);
        recordTelemetryEvent({
          eventType: message.toLowerCase().includes("izin") ? "permission_denied" : "action_failed",
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
        const message = reason instanceof Error ? reason.message : "Bilgisayar su anda bakamiyor.";
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
      await speakText("Iki el isareti sec, ben de toplayayim!");
    }
  };

  const onSubmitThinkPuzzle = async () => {
    try {
      const message = thinking.submitPuzzle(thinking.state.left, thinking.state.right);
      await speakText(message);
      actionController.completeAction("think", message);
      recordTelemetryEvent({ eventType: "action_completed", actionId: "think", sessionId, details: { left: thinking.state.left, right: thinking.state.right, answer: thinking.state.left + thinking.state.right } });
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : "Bilgisayar bunu simdi cozemedi.";
      actionController.failAction("think", message);
    }
  };

  const onCloseCameraPreview = () => {
    const message = senses.stopSee();
    actionController.completeAction("see", message);
    recordTelemetryEvent({ eventType: "action_completed", actionId: "see", sessionId, details: { outcome: "camera_closed" } });
  };

  return (
    <section className="relative h-full min-h-0 p-2 sm:p-3 lg:p-4">
      <div aria-live="polite" className="sr-only" role="status">{currentSceneMessage}</div>
      <div className="relative h-full overflow-hidden rounded-[2rem] bg-white/15 lg:rounded-[2.5rem]">
        <PhaserCanvas actionId={actionController.sceneState.actionId} message={currentSceneMessage} status={actionController.sceneState.status} />
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex w-[min(92%,22rem)] flex-col gap-3 lg:left-6 lg:top-6 lg:max-w-md">
          {!senses.seeState.previewVisible && actionController.state.currentAction !== "think" ? (
            <div className="rounded-[1.5rem] bg-white/72 px-4 py-3 shadow-bubble backdrop-blur lg:rounded-[1.75rem] lg:px-5 lg:py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-skyplay-teal">Insan ve Bilgisayar</p>
              <h1 className="mt-1 font-display text-xl leading-tight text-skyplay-navy lg:mt-2 lg:text-3xl">Gor, dinle, konus, dusun ve dans et</h1>
              <p className="mt-1 hidden text-sm leading-6 text-skyplay-navy/75 lg:block">Asagidaki dugmelere dokunarak bilgisayarin her becerisini calistir.</p>
            </div>
          ) : null}
          <LiveStatus message={currentSceneMessage} />
        </div>
        <CameraPreview message={senses.seeState.message} onClose={onCloseCameraPreview} stream={senses.cameraStream} visible={senses.seeState.previewVisible} />
        {actionController.state.currentAction === "think" && thinking.state.phase !== "idle" ? (
          <div className="speech-cloud absolute left-1/2 top-1/2 z-20 w-[min(90%,22rem)] -translate-x-1/2 -translate-y-1/2">
            <ThinkPanel
              onSetLeft={thinking.setLeft}
              onSetRight={thinking.setRight}
              onSubmit={onSubmitThinkPuzzle}
              state={thinking.state}
            />
          </div>
        ) : null}
        {(actionController.state.currentAction === "hear" || senses.hearState.transcript || senses.hearState.recordingUrl || senses.hearState.deviceState === "failed") ? (
          <div className="absolute bottom-24 left-1/2 z-20 w-[min(92%,30rem)] -translate-x-1/2 lg:bottom-28">
            <HearAction
              clipDurationMs={senses.hearState.clipDurationMs}
              fallbackText={senses.hearState.fallbackText}
              hasRecording={Boolean(senses.hearState.recordingUrl)}
              message={senses.hearState.message}
              onPlayRecording={senses.playHearRecording}
              onSubmitFallback={senses.submitFallbackTranscript}
              playbackState={senses.hearState.playbackState}
              requiresManualPlayback={senses.hearState.requiresManualPlayback}
              transcript={senses.hearState.transcript}
            />
          </div>
        ) : null}
        <div className="absolute bottom-4 left-1/2 z-10 w-[min(90%,28rem)] -translate-x-1/2">
          <ActionPanel currentAction={actionController.state.currentAction} onAction={onAction} />
        </div>
      </div>
    </section>
  );
}