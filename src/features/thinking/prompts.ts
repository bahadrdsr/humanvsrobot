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
    promptText: "Iki kucuk elde kac oyuncak ayi var?",
    promptType: "counting",
    expectedAnswer: "2",
    resultMessage: {
      correct: "Evet. Iki elde iki oyuncak ayi var. Harika dusundun!",
      incorrect: "Guzel deneme. Bilgisayar iki oyuncak ayiyi dusunuyordu."
    }
  },
  {
    promptId: "add-1-1",
    promptText: "Bir bilgisayar arti bir bilgisayar kac eder?",
    promptType: "simple-addition",
    expectedAnswer: "2",
    resultMessage: {
      correct: "Dogru. Bir bilgisayar ile bir bilgisayar iki eder!",
      incorrect: "Eglenceli bir tahmindi. Bir bilgisayar arti bir bilgisayar iki eder."
    }
  },
  {
    promptId: "match-red",
    promptText: "Parlak bir itfaiye aracina hangi renk uyar: kirmizi mi mavi mi?",
    promptType: "matching",
    expectedAnswer: "kirmizi",
    resultMessage: {
      correct: "Evet. Kirmizi itfaiye araci icin parlak bir renktir!",
      incorrect: "Mavi guzel, ama bilgisayar kirmiziyi ariyordu."
    }
  }
];