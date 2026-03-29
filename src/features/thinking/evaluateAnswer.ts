import type { ThinkPrompt } from "@/features/thinking/prompts";

type EvaluationResult = {
  isCorrect: boolean;
  result: "correct" | "incorrect";
  message: string;
};

export function normalizeAnswer(answer: string) {
  return answer.trim().toLowerCase();
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