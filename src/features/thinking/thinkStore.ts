export type HandSignPuzzleState = {
  phase: "idle" | "picking" | "answered";
  left: number;
  right: number;
  answer: number | null;
  resultMessage: string;
};

export function createInitialThinkState(): HandSignPuzzleState {
  return {
    phase: "idle",
    left: 1,
    right: 1,
    answer: null,
    resultMessage: ""
  };
}