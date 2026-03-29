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
      message: "This browser cannot listen for speech, so use the fallback text box instead."
    };
  }

  return new Promise((resolve) => {
    const recognition = new Recognition();
    let settled = false;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      if (settled) {
        return;
      }

      const transcript = event.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) {
        settled = true;
        resolve({ kind: "success", transcript, message: `The robot heard: ${transcript}` });
      }
    };

    recognition.onerror = (event) => {
      if (settled) {
        return;
      }

      settled = true;
      if (event.error === "no-speech") {
        resolve({ kind: "no-speech", message: "The robot did not catch any words. Try again or type the phrase instead." });
        return;
      }

      resolve({ kind: "error", message: `Listening stopped because of ${event.error}.` });
    };

    recognition.onend = () => {
      if (!settled) {
        settled = true;
        resolve({ kind: "no-speech", message: "The robot did not hear a clear phrase yet." });
      }
    };

    recognition.start();
  });
}