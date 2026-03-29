type ThinkPanelProps = {
  prompt: string | null;
  resultMessage: string;
  answerOptions: string[];
  onSubmitAnswer: (answer: string) => void;
  onSkip: () => void;
};

export function ThinkPanel({ prompt, resultMessage, answerOptions, onSubmitAnswer, onSkip }: ThinkPanelProps) {
  return (
    <div className="rounded-[1.75rem] bg-white/80 p-5 shadow-bubble">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl text-skyplay-navy">Think</h3>
        <button className="rounded-full border border-skyplay-teal/30 px-4 py-2 text-sm font-semibold text-skyplay-teal" onClick={onSkip} type="button">
          Skip
        </button>
      </div>
      <p className="mt-3 rounded-2xl bg-skyplay-cream px-4 py-3 text-base font-semibold text-skyplay-navy">
        {prompt ?? "The robot will ask a question here."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {answerOptions.map((option) => (
          <button
            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-skyplay-navy shadow"
            key={option}
            onClick={() => onSubmitAnswer(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-skyplay-navy/80">{resultMessage}</p>
    </div>
  );
}