export type TemporaryAudioClip = {
  audioUrl: string | null;
  durationMs: number;
  supported: boolean;
};

export async function captureTemporaryAudio(stream: MediaStream, maxDurationMs = 5000): Promise<TemporaryAudioClip> {
  if (typeof MediaRecorder === "undefined") {
    return {
      audioUrl: null,
      durationMs: 0,
      supported: false
    };
  }

  return new Promise((resolve, reject) => {
    const chunks: BlobPart[] = [];
    const preferredMimeType = typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : undefined;
    const recorder = preferredMimeType ? new MediaRecorder(stream, { mimeType: preferredMimeType }) : new MediaRecorder(stream);
    const startedAt = performance.now();
    let settled = false;

    const finalize = () => {
      if (settled) {
        return;
      }

      settled = true;
      const durationMs = Math.min(maxDurationMs, Math.max(0, performance.now() - startedAt));

      if (!chunks.length) {
        resolve({ audioUrl: null, durationMs, supported: true });
        return;
      }

      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      resolve({
        audioUrl: URL.createObjectURL(blob),
        durationMs,
        supported: true
      });
    };

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onerror = () => {
      reject(new Error("The robot could not save the sound clip."));
    };

    recorder.onstop = finalize;
    recorder.start();

    window.setTimeout(() => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    }, maxDurationMs);
  });
}

export async function playTemporaryAudio(audioUrl: string): Promise<void> {
  if (typeof Audio === "undefined") {
    return;
  }

  const audio = new Audio(audioUrl);
  audio.preload = "auto";

  await new Promise<void>((resolve, reject) => {
    let finished = false;

    const settle = (callback: () => void) => {
      if (finished) {
        return;
      }

      finished = true;
      audio.onended = null;
      audio.onerror = null;
      callback();
    };

    audio.onended = () => settle(resolve);
    audio.onerror = () => settle(() => reject(new Error("The browser blocked playback of the sound clip.")));

    void audio.play().catch(() => {
      settle(() => reject(new Error("The browser blocked playback of the sound clip.")));
    });
  });
}

export function revokeTemporaryAudio(audioUrl: string | null) {
  if (audioUrl) {
    URL.revokeObjectURL(audioUrl);
  }
}