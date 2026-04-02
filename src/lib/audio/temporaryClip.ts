export type TemporaryAudioClip = {
  audioUrl: string | null;
  durationMs: number;
  supported: boolean;
  mimeType: string | null;
};

const MOBILE_AUDIO_MIME_TYPES = [
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mp4",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus"
] as const;

function getSupportedAudioMimeType() {
  if (typeof MediaRecorder.isTypeSupported !== "function") {
    return null;
  }

  return MOBILE_AUDIO_MIME_TYPES.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ?? null;
}

function createAudioBlob(chunks: BlobPart[], mimeType: string | null) {
  if (mimeType) {
    return new Blob(chunks, { type: mimeType });
  }

  return new Blob(chunks);
}

export async function captureTemporaryAudio(stream: MediaStream, maxDurationMs = 5000): Promise<TemporaryAudioClip> {
  if (typeof MediaRecorder === "undefined") {
    return {
      audioUrl: null,
      durationMs: 0,
      supported: false,
      mimeType: null
    };
  }

  return new Promise((resolve, reject) => {
    const chunks: BlobPart[] = [];
    const preferredMimeType = getSupportedAudioMimeType();
    const recorder = preferredMimeType ? new MediaRecorder(stream, { mimeType: preferredMimeType }) : new MediaRecorder(stream);
    const startedAt = performance.now();
    let settled = false;

    const finalize = () => {
      if (settled) {
        return;
      }

      settled = true;
      const durationMs = Math.min(maxDurationMs, Math.max(0, performance.now() - startedAt));
      const resolvedMimeType = recorder.mimeType || preferredMimeType;

      if (!chunks.length) {
        resolve({ audioUrl: null, durationMs, supported: true, mimeType: resolvedMimeType ?? null });
        return;
      }

      const blob = createAudioBlob(chunks, resolvedMimeType ?? null);
      resolve({
        audioUrl: URL.createObjectURL(blob),
        durationMs,
        supported: true,
        mimeType: resolvedMimeType ?? blob.type ?? null
      });
    };

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onerror = () => {
      reject(new Error("Bilgisayar ses kaydını saklayamadı."));
    };

    recorder.onstop = finalize;
    recorder.start(250);

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
  audio.setAttribute("playsinline", "true");

  await new Promise<void>((resolve, reject) => {
    let finished = false;

    const settle = (callback: () => void) => {
      if (finished) {
        return;
      }

      finished = true;
      audio.onended = null;
      audio.onerror = null;
      audio.oncanplaythrough = null;
      callback();
    };

    audio.onended = () => settle(resolve);
    audio.onerror = () => settle(() => reject(new Error("Tarayici ses klibini oynatamadi.")));

    audio.oncanplaythrough = () => {
      void audio.play().catch(() => {
        settle(() => reject(new Error("Tarayici ses klibini oynatamadi.")));
      });
    };

    audio.load();
  });
}

export function revokeTemporaryAudio(audioUrl: string | null) {
  if (audioUrl) {
    URL.revokeObjectURL(audioUrl);
  }
}