export type SpeechRecognitionResult =
  | { kind: "success"; transcript: string; message: string }
  | { kind: "unsupported"; message: string }
  | { kind: "no-speech"; message: string }
  | { kind: "error"; message: string };

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  }
}

export async function recognizeShortPhrase(): Promise<SpeechRecognitionResult> {
  const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;

  if (!Recognition) {
    return {
      kind: "unsupported",
      message: "Bu tarayıcı sesi dinleyemiyor. Bunun yerine yedek metin kutusunu kullan."
    };
  }

  return new Promise((resolve) => {
    const recognition = new Recognition();
    let settled = false;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "tr-TR";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      if (settled) {
        return;
      }

      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        settled = true;
        resolve({ kind: "success", transcript, message: `Bilgisayar şunu duydu: ${transcript}` });
      }
    };

    recognition.onerror = (event) => {
      if (settled) {
        return;
      }

      settled = true;
      if (event.error === "no-speech") {
        resolve({ kind: "no-speech", message: "Bilgisayar net bir söz duyamadı. Yeniden dene ya da ifadeyi yazarak gir." });
        return;
      }

      resolve({ kind: "error", message: `Dinleme ${event.error} nedeniyle durdu.` });
    };

    recognition.onend = () => {
      if (!settled) {
        settled = true;
        resolve({ kind: "no-speech", message: "Bilgisayar henüz net bir ifade duymadı." });
      }
    };

    recognition.start();
  });
}