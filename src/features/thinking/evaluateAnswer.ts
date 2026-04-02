import type { ThinkPrompt } from "@/features/thinking/prompts";

type EvaluationResult = {
  isCorrect: boolean;
  result: "correct" | "incorrect";
  message: string;
};

export function normalizeAnswer(answer: string) {
  return answer
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ç", "c")
    .replaceAll("ğ", "g")
    .replaceAll("ı", "i")
    .replaceAll("ö", "o")
    .replaceAll("ş", "s")
    .replaceAll("ü", "u");
}

export function evaluateAnswer(prompt: ThinkPrompt, answer: string): EvaluationResult {
  const normalizedAnswer = normalizeAnswer(answer);
  const expectedAnswer = normalizeAnswer(prompt.expectedAnswer);
  const isCorrect = normalizedAnswer === expectedAnswer;

  return {
    isCorrect,
    result: isCorrect ? "correct" : "incorrect",
    message: isCorrect ? prompt.resultMessage.correct : prompt.resultMessage.incorrect
  };
}