export type ThinkPrompt = {
  promptId: string;
  promptText: string;
  promptType: "counting" | "simple-addition" | "matching";
  expectedAnswer: string;
  resultMessage: {
    correct: string;
    incorrect: string;
  };
};

export const thinkPrompts: ThinkPrompt[] = [
  {
    promptId: "count-2-bears",
    promptText: "How many teddy bears are in two little hands?",
    promptType: "counting",
    expectedAnswer: "2",
    resultMessage: {
      correct: "Yes. Two hands can hold two teddy bears. Great thinking!",
      incorrect: "Nice try. The robot was thinking about two teddy bears."
    }
  },
  {
    promptId: "add-1-1",
    promptText: "What is one robot plus one robot?",
    promptType: "simple-addition",
    expectedAnswer: "2",
    resultMessage: {
      correct: "Right. One robot and one robot make two robots!",
      incorrect: "That was a fun guess. One robot plus one robot makes two."
    }
  },
  {
    promptId: "match-red",
    promptText: "Which color matches a shiny fire truck: red or blue?",
    promptType: "matching",
    expectedAnswer: "red",
    resultMessage: {
      correct: "Yes. Red is a bright fire-truck color!",
      incorrect: "Blue is pretty, but the robot was looking for red."
    }
  }
];