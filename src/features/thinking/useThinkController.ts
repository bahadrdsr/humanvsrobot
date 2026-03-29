import { useState } from "react";
import { createInitialThinkState } from "@/features/thinking/thinkStore";

export const HAND_SIGNS = [
  { n: 1, emoji: "\u261d\ufe0f" },
  { n: 2, emoji: "\u270c\ufe0f" },
  { n: 3, emoji: "\ud83e\udd1f" },
  { n: 4, emoji: "\ud83d\udd96" },
  { n: 5, emoji: "\u270b" }
] as const;

const NUMBER_WORDS = ["one", "two", "three", "four", "five"] as const;

function spokenLabel(n: number): string {
  return `${HAND_SIGNS[n - 1].emoji} ${NUMBER_WORDS[n - 1]}`;
}

export function useThinkController() {
  const [state, setState] = useState(createInitialThinkState);

  const startPuzzle = () => {
    setState((s) => ({ ...s, phase: "picking", answer: null, resultMessage: "" }));
  };

  const setLeft = (value: number) => {
    setState((s) => ({ ...s, left: value }));
  };

  const setRight = (value: number) => {
    setState((s) => ({ ...s, right: value }));
  };

  const submitPuzzle = (left: number, right: number) => {
    const answer = left + right;
    const message = `${spokenLabel(left)} plus ${spokenLabel(right)} equals ${answer}! The robot figured it out!`;
    setState((s) => ({ ...s, phase: "answered", answer, resultMessage: message }));
    return message;
  };

  const resetPuzzle = () => {
    setState(createInitialThinkState());
  };

  return { state, startPuzzle, setLeft, setRight, submitPuzzle, resetPuzzle };
}