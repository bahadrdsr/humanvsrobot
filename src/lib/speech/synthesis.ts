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
  // Prefer a Turkish locale voice; browsers may label it "tr-TR" or "tr_TR"
  const turkishVoice =
    voices.find(v => v.lang === "tr-TR") ??
    voices.find(v => v.lang.toLowerCase().startsWith("tr")) ??
    null;

  await new Promise<void>((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "tr-TR";
    if (turkishVoice) {
      utterance.voice = turkishVoice;
    }
    utterance.pitch = 1.8;
    utterance.rate = 1.1;
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("The robot could not speak out loud just now."));
    window.speechSynthesis.speak(utterance);
  });
}