import { useCallback, useEffect, useRef, useState } from "react";
import { requestCamera, requestMicrophone, stopStream } from "@/lib/permissions/devicePermissions";
import { captureTemporaryAudio, playTemporaryAudio, revokeTemporaryAudio } from "@/lib/audio/temporaryClip";
import { recognizeShortPhrase, type SpeechRecognitionResult } from "@/lib/speech/recognition";
import { speakText } from "@/lib/speech/synthesis";
import { createInitialHearState, createInitialSeeState } from "@/features/senses/senseStore";

function shouldPreferManualPlayback() {
  if (typeof window === "undefined") {
    return false;
  }

  const coarsePointer = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  const hasTouchPoints = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
  const mobileUserAgent = typeof navigator !== "undefined" && /android|iphone|ipad|ipod/i.test(navigator.userAgent);

  return coarsePointer || hasTouchPoints || mobileUserAgent;
}

export function useSenseController() {
  const [hearState, setHearState] = useState(createInitialHearState);
  const [seeState, setSeeState] = useState(createInitialSeeState);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const recordingUrlRef = useRef<string | null>(null);
  const manualPlaybackPreferredRef = useRef(shouldPreferManualPlayback());

  const replaceRecording = useCallback((audioUrl: string | null) => {
    if (recordingUrlRef.current && recordingUrlRef.current !== audioUrl) {
      revokeTemporaryAudio(recordingUrlRef.current);
    }

    recordingUrlRef.current = audioUrl;
  }, []);

  const playHearRecording = useCallback(async (audioUrl = recordingUrlRef.current) => {
    if (!audioUrl) {
      throw new Error("Henüz oynatılacak yeni bir ses klibi yok.");
    }

    setHearState((current) => ({ ...current, playbackState: "playing" }));

    try {
      await playTemporaryAudio(audioUrl);
      setHearState((current) => ({ ...current, playbackState: "ready" }));
      return true;
    } catch (reason: unknown) {
      const message = reason instanceof Error && reason.message === "Tarayıcı ses klibini oynatamadı."
        ? "Ses klibi otomatik başlamadı. Dinlemek için 'Klibi oynat' düğmesine dokun."
        : reason instanceof Error
          ? reason.message
          : "Ses klibi otomatik başlamadı. Dinlemek için 'Klibi oynat' düğmesine dokun.";
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
      message: "Bilgisayar mikrofon izni istiyor.",
      recordingUrl: null,
      clipDurationMs: 0,
      requiresManualPlayback: manualPlaybackPreferredRef.current,
      playbackState: "idle"
    }));

    try {
      const { stream, permissionState } = await requestMicrophone();
      setHearState((current) => ({
        ...current,
        permissionState,
        deviceState: "active",
        message: "Bilgisayar 5 saniyeye kadar dinliyor."
      }));

      const [recordingResult, recognitionResult] = await Promise.allSettled([
        captureTemporaryAudio(stream, 5000),
        recognizeShortPhrase()
      ]);
      stopStream(stream);

      const recording = recordingResult.status === "fulfilled"
        ? recordingResult.value
        : { audioUrl: null, durationMs: 0, supported: false, mimeType: null };
      const recognition: SpeechRecognitionResult = recognitionResult.status === "fulfilled"
        ? recognitionResult.value
        : { kind: "error", message: "Bilgisayar duyduğu sözcükleri anlayamadı." };
      const requiresManualPlayback = manualPlaybackPreferredRef.current;

      replaceRecording(recording.audioUrl);

      if (recognition.kind === "success") {
        const clipSeconds = Math.max(1, Math.round((recording.durationMs || 5000) / 1000));
        const nextMessage = recording.audioUrl
          ? requiresManualPlayback
            ? `${recognition.message} ${clipSeconds} saniyelik kısa bir ses klibi kaydedildi. Dinlemek için 'Klibi oynat' düğmesine dokun.`
            : `${recognition.message} ${clipSeconds} saniyelik kısa bir ses klibi kaydedildi. Şimdi oynatılıyor.`
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
          requiresManualPlayback,
          playbackState: recording.audioUrl ? "ready" : "idle"
        }));

        if (recording.audioUrl && !requiresManualPlayback) {
          void playHearRecording(recording.audioUrl);
        }

        return { ok: true, message: nextMessage };
      }

      const fallbackMessage = recording.audioUrl
        ? requiresManualPlayback
          ? `${recognition.message} Yine de kısa bir ses klibi kaydedildi. Dinlemek için 'Klibi oynat' düğmesine dokun.`
          : `${recognition.message} Yine de kısa bir ses klibi kaydedildi; yeniden oynatabilirsin.`
        : recognition.message;

      setHearState((current) => ({
        ...current,
        permissionState: recognition.kind === "unsupported" ? "unsupported" : "granted",
        deviceState: recording.audioUrl ? "completed" : "failed",
        message: fallbackMessage,
        recordingUrl: recording.audioUrl,
        clipDurationMs: recording.durationMs,
        requiresManualPlayback,
        playbackState: recording.audioUrl ? "ready" : "idle"
      }));

      if (recording.audioUrl && !requiresManualPlayback) {
        void playHearRecording(recording.audioUrl);
        return { ok: true, message: fallbackMessage };
      }

      if (recording.audioUrl) {
        return { ok: true, message: fallbackMessage };
      }

      throw new Error(recognition.message);
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : "Bilgisayar şimdi dinlemeyi başlatamadı.";
      setHearState((current) => ({ ...current, deviceState: "failed", message }));
      throw new Error(message);
    }
  };

  const submitFallbackTranscript = async (text: string) => {
    const cleaned = text.trim();
    if (!cleaned) {
      throw new Error("Bilgisayarın tekrar etmesi için kısa bir ifade yaz.");
    }

    await speakText(cleaned);
    setHearState((current) => ({
      ...current,
      transcript: cleaned,
      fallbackText: cleaned,
      deviceState: "completed",
      message: `Bilgisayar yazılan ifadeyi tekrar etti: ${cleaned}`,
      recordingUrl: null,
      clipDurationMs: 0,
      requiresManualPlayback: false,
      playbackState: "idle"
    }));

    return `Bilgisayar yazılan ifadeyi tekrar etti: ${cleaned}`;
  };

  const startSee = async () => {
    setSeeState((current) => ({ ...current, deviceState: "requesting", message: "Bilgisayar kamera izni istiyor." }));

    try {
      const { stream, permissionState } = await requestCamera();
      setCameraStream(stream);
      setSeeState({
        mode: "see",
        permissionState,
        deviceState: "active",
        message: "Bilgisayar kamera görüntüsüne bakıyor.",
        previewVisible: true
      });

      return { ok: true, message: "Bilgisayar kamera görüntüsünü açtı." };
    } catch (reason: unknown) {
      const message = reason instanceof Error ? reason.message : "Bilgisayar kamerayı açamadı.";
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
      message: "Bilgisayar kamera görüntüsünü kapattı.",
      previewVisible: false
    });
    return "Bilgisayar kamera görüntüsünü kapattı.";
  };

  const resetHearState = () => {
    replaceRecording(null);
    setHearState(createInitialHearState());
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
    resetHearState,
    startSee,
    stopSee,
    resetSenseState
  };
}