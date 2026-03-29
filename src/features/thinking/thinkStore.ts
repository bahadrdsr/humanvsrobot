import type { ThinkPrompt } from "@/features/thinking/prompts";

export type ThinkState = {
  currentPrompt: ThinkPrompt | null;
  submittedAnswer: string;
  result: "unanswered" | "correct" | "incorrect" | "skipped";
  resultMessage: string;
};

export function createInitialThinkState(): ThinkState {
  return {
    currentPrompt: null,
    submittedAnswer: "",
    result: "unanswered",
    resultMessage: "Press Think and the robot will ask a simple question."
  };
}