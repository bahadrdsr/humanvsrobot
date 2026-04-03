/** Resolves once the browser's voice list is populated (or immediately if already loaded). */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    const onChanged = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", onChanged);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", onChanged);
    // Safety timeout: resolve with whatever is available after 2 s
    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener("voiceschanged", onChanged);
      resolve(window.speechSynthesis.getVoices());
    }, 2000);
  });
}

export async function speakText(text: string) {
  if (!text.trim()) {
    return;
  }

  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const voices = await loadVoices();
  // 1. Female Turkish voice (child-like timbre)
  // 2. Any Turkish voice
  // 3. Child/female English voice as a fallback (lang hint still set to tr-TR)
  const voice =
    voices.find(v => v.lang.toLowerCase().startsWith("tr") && /female|kadın|kadin|bayan|bahar/i.test(v.name)) ??
    voices.find(v => v.lang === "tr-TR") ??
    voices.find(v => v.lang.toLowerCase().startsWith("tr")) ??
    voices.find(v => /junior|child|girl|kyoko|veena|fiona|karen|tessa|zira/i.test(v.name)) ??
    voices.find(v => v.lang.startsWith("en") && /female/i.test(v.name)) ??
    null;

  await new Promise<void>((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "tr-TR";
    if (voice) {
      utterance.voice = voice;
    }
    utterance.pitch = 1.8;
    utterance.rate = 1.1;
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("Bilgisayar sesi şimdi yüksek sesle oynatamadı."));
    window.speechSynthesis.speak(utterance);
  });
}