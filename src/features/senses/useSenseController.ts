import { useCallback, useEffect, useRef, useState } from "react";
import { requestCamera, requestMicrophone, stopStream } from "@/lib/permissions/devicePermissions";
import { captureTemporaryAudio, playTemporaryAudio, revokeTemporaryAudio } from "@/lib/audio/temporaryClip";
import { recognizeShortPhrase, type SpeechRecognitionResult } from "@/lib/speech/recognition";
import { speakText } from "@/lib/speech/synthesis";
import { createInitialHearState, createInitialSeeState } from "@/features/senses/senseStore";

export function useSenseController() {
  const [hearState, setHearState] = useState(createInitialHearState);
  const [seeState, setSeeState] = useState(createInitialSeeState);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const recordingUrlRef = useRef<string | null>(null);

  const replaceRecording = useCallback((audioUrl: string | null) => {
    if (recordingUrlRef.current && recordingUrlRef.current !== audioUrl) {
      revokeTemporaryAudio(recordingUrlRef.current);
    }

    recordingUrlRef.current = audioUrl;
  }, []);

  const playHearRecording = useCallback(async (audioUrl = recordingUrlRef.current) => {
    if (!audioUrl) {
      throw new Error("There is no recent recording to play yet.");
    }

    setHearState((current) => ({ ...current, playbackState: "playing" }));

    try {
      await playTemporaryAudio(audioUrl);
      setHearState((current) => ({ ...current, playbackState: "ready" }));
      return true;
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : "The browser blocked playback of the sound clip.";
      setHearState((current) => ({ ...current, playbackState: "failed", message }));
      throw new Error(message);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopStream(cameraStream);
      replaceRecording(null);
    };
  }, [cameraStream, replaceRecording]);

  const startHear = async () => {
    replaceRecording(null);
    setHearState((current) => ({
      ...current,
      deviceState: "requesting",
      message: "The robot is asking for microphone permission.",
      recordingUrl: null,
      clipDurationMs: 0,
      playbackState: "idle"
    }));

    try {
      const { stream, permissionState } = await requestMicrophone();
      setHearState((current) => ({
        ...current,
        permissionState,
        deviceState: "active",
        message: "The robot is listening for up to 5 seconds."
      }));

      const [recordingResult, recognitionResult] = await Promise.allSettled([
        captureTemporaryAudio(stream, 5000),
        recognizeShortPhrase()
      ]);
      stopStream(stream);

      const recording = recordingResult.status === "fulfilled"
        ? recordingResult.value
        : { audioUrl: null, durationMs: 0, supported: false };
      const recognition: SpeechRecognitionResult = recognitionResult.status === "fulfilled"
        ? recognitionResult.value
        : { kind: "error", message: "The robot could not understand the words it heard." };

      replaceRecording(recording.audioUrl);

      if (recognition.kind === "success") {
        const clipSeconds = Math.max(1, Math.round((recording.durationMs || 5000) / 1000));
        const nextMessage = recording.audioUrl
          ? `${recognition.message} I saved a ${clipSeconds}-second clip and I am playing it back now.`
          : recognition.message;

        setHearState((current) => ({
          ...current,
          permissionState: "granted",
          deviceState: "completed",
          transcript: recognition.transcript,
          message: nextMessage,
          fallbackText: "",
          recordingUrl: recording.audioUrl,
          clipDurationMs: recording.durationMs,
          playbackState: recording.audioUrl ? "ready" : "idle"
        }));

        if (recording.audioUrl) {
          void playHearRecording(recording.audioUrl);
        }

        return { ok: true, message: nextMessage };
      }

      const fallbackMessage = recording.audioUrl
        ? `${recognition.message} The robot still kept a short sound clip so you can replay it.`
        : recognition.message;

      setHearState((current) => ({
        ...current,
        permissionState: recognition.kind === "unsupported" ? "unsupported" : "granted",
        deviceState: recording.audioUrl ? "completed" : "failed",
        message: fallbackMessage,
        recordingUrl: recording.audioUrl,
        clipDurationMs: recording.durationMs,
        playbackState: recording.audioUrl ? "ready" : "idle"
      }));

      if (recording.audioUrl) {
        void playHearRecording(recording.audioUrl);
        return { ok: true, message: fallbackMessage };
      }

      throw new Error(recognition.message);
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : "The robot could not start listening.";
      setHearState((current) => ({ ...current, deviceState: "failed", message }));
      throw new Error(message);
    }
  };

  const submitFallbackTranscript = async (text: string) => {
    const cleaned = text.trim();
    if (!cleaned) {
      throw new Error("Type a short phrase so the robot has something to repeat.");
    }

    await speakText(cleaned);
    setHearState((current) => ({
      ...current,
      transcript: cleaned,
      fallbackText: cleaned,
      deviceState: "completed",
      message: `The robot repeated the typed phrase: ${cleaned}`,
      recordingUrl: null,
      clipDurationMs: 0,
      playbackState: "idle"
    }));

    return `The robot repeated the typed phrase: ${cleaned}`;
  };

  const startSee = async () => {
    setSeeState((current) => ({ ...current, deviceState: "requesting", message: "The robot is asking for camera permission." }));

    try {
      const { stream, permissionState } = await requestCamera();
      setCameraStream(stream);
      setSeeState({
        mode: "see",
        permissionState,
        deviceState: "active",
        message: "The robot is looking through the camera.",
        previewVisible: true
      });

      return { ok: true, message: "The robot opened the camera view." };
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : "The robot could not open the camera.";
      setSeeState({
        mode: "see",
        permissionState: "denied",
        deviceState: "failed",
        message,
        previewVisible: false
      });
      throw new Error(message);
    }
  };

  const stopSee = () => {
    stopStream(cameraStream);
    setCameraStream(null);
    setSeeState({
      mode: "see",
      permissionState: seeState.permissionState,
      deviceState: "completed",
      message: "The robot closed the camera view.",
      previewVisible: false
    });
    return "The robot closed the camera view.";
  };

  const resetSenseState = () => {
    stopStream(cameraStream);
    setCameraStream(null);
    replaceRecording(null);
    setHearState(createInitialHearState());
    setSeeState(createInitialSeeState());
  };

  return {
    hearState,
    seeState,
    cameraStream,
    startHear,
    playHearRecording,
    submitFallbackTranscript,
    startSee,
    stopSee,
    resetSenseState
  };
}