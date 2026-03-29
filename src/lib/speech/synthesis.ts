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
    utterance.pitch = 1.25;
    utterance.rate = 0.95;
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("The robot could not speak out loud just now."));
    window.speechSynthesis.speak(utterance);
  });
}