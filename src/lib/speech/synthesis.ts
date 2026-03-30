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
    // Child robot voice: high pitch + slightly faster rate
    const voices = window.speechSynthesis.getVoices();
    const childVoice = voices.find(v =>
      /junior|child|girl|kyoko|veena|fiona|karen|tessa|zira/i.test(v.name)
    ) ?? voices.find(v => v.lang.startsWith("en") && /female/i.test(v.name)) ?? null;
    if (childVoice) {
      utterance.voice = childVoice;
    }
    utterance.pitch = 1.8;
    utterance.rate = 1.1;
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("The robot could not speak out loud just now."));
    window.speechSynthesis.speak(utterance);
  });
}