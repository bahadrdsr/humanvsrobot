import { useMemo, useState } from "react";
import { evaluateAnswer } from "@/features/thinking/evaluateAnswer";
import { thinkPrompts } from "@/features/thinking/prompts";
import { createInitialThinkState } from "@/features/thinking/thinkStore";

export function useThinkController() {
  const [state, setState] = useState(createInitialThinkState);
  const [promptIndex, setPromptIndex] = useState(0);

  const startThink = () => {
    const prompt = thinkPrompts[promptIndex % thinkPrompts.length];
    setPromptIndex((current) => current + 1);
    setState({
      currentPrompt: prompt,
      submittedAnswer: "",
      result: "unanswered",
      resultMessage: prompt.promptText
    });
    return prompt.promptText;
  };

  const submitAnswer = (answer: string) => {
    if (!state.currentPrompt) {
      throw new Error("The robot is not thinking about a question yet.");
    }

    const evaluation = evaluateAnswer(state.currentPrompt, answer);
    setState({
      currentPrompt: state.currentPrompt,
      submittedAnswer: answer,
      result: evaluation.result,
      resultMessage: evaluation.message
    });
    return evaluation.message;
  };

  const skipPrompt = () => {
    setState((current) => ({
      ...current,
      result: "skipped",
      resultMessage: "The robot skipped that question and is ready for another one."
    }));
    return "The robot skipped that question and is ready for another one.";
  };

  const resetThink = () => {
    setState(createInitialThinkState());
  };

  const answerOptions = useMemo(() => ["1", "2", "3", "red", "blue"], []);

  return {
    state,
    answerOptions,
    startThink,
    submitAnswer,
    skipPrompt,
    resetThink
  };
}