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
    promptText: "İki küçük elde kaç oyuncak ayı var?",
    promptType: "counting",
    expectedAnswer: "2",
    resultMessage: {
      correct: "Evet. İki elde iki oyuncak ayı var. Harika düşündün!",
      incorrect: "Güzel deneme. Bilgisayar iki oyuncak ayıyı düşünüyordu."
    }
  },
  {
    promptId: "add-1-1",
    promptText: "Bir bilgisayar artı bir bilgisayar kaç eder?",
    promptType: "simple-addition",
    expectedAnswer: "2",
    resultMessage: {
      correct: "Doğru. Bir bilgisayar ile bir bilgisayar iki eder!",
      incorrect: "Eğlenceli bir tahmindi. Bir bilgisayar artı bir bilgisayar iki eder."
    }
  },
  {
    promptId: "match-red",
    promptText: "Parlak bir itfaiye aracına hangi renk uyar: kırmızı mı mavi mi?",
    promptType: "matching",
    expectedAnswer: "kırmızı",
    resultMessage: {
      correct: "Evet. Kırmızı itfaiye aracı için parlak bir renktir!",
      incorrect: "Mavi güzel, ama bilgisayar kırmızıyı arıyordu."
    }
  }
];