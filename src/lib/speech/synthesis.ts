export async function speakText(text: string) {
  if (!text.trim()) {
    return;
  }

  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  await new Promise<void>((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "tr-TR";
    // Prefer a Turkish voice; fall back to any available voice
    const voices = window.speechSynthesis.getVoices();
    const turkishVoice = voices.find(v => v.lang.startsWith("tr")) ?? null;
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