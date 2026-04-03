import type { HandSignPuzzleState } from "@/features/thinking/thinkStore";
import { HAND_SIGNS } from "@/features/thinking/useThinkController";

type ThinkPanelProps = {
  state: HandSignPuzzleState;
  onSetLeft: (v: number) => void;
  onSetRight: (v: number) => void;
  onSubmit: () => void;
  onClose?: () => void;
};

function HandSignCard({ value, onChange, disabled }: { value: number; onChange: (v: number) => void; disabled: boolean }) {
  const sign = HAND_SIGNS[value - 1];
  const next = () => onChange(value >= 5 ? 1 : value + 1);
  return (
    <button
      aria-label={`El işareti ${value}, değiştirmek için dokun`}
      className="flex h-24 w-20 cursor-pointer select-none flex-col items-center justify-center gap-1 rounded-2xl border-2 border-skyplay-teal/40 bg-skyplay-cream shadow transition active:scale-95 disabled:cursor-default disabled:opacity-60"
      disabled={disabled}
      onClick={next}
      type="button"
    >
      <span className="text-4xl leading-none">{sign.emoji}</span>
      <span className="text-lg font-bold text-skyplay-navy">{sign.n}</span>
      <span className="text-[10px] text-skyplay-navy/50">dokun ve değiştir</span>
    </button>
  );
}

export function ThinkPanel({ state, onSetLeft, onSetRight, onSubmit, onClose }: ThinkPanelProps) {
  const isPicking = state.phase === "picking";
  const isAnswered = state.phase === "answered";

  return (
    <div className="rounded-[1.75rem] bg-white/80 p-5 shadow-bubble">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl text-skyplay-navy">Düşün</h3>
        {onClose ? (
          <button
            aria-label="Düşünme penceresini kapat"
            className="rounded-full bg-white/85 px-3 py-1 text-lg font-bold leading-none text-skyplay-navy shadow"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        ) : null}
      </div>
      {state.phase === "idle" ? (
        <p className="mt-3 text-sm leading-6 text-skyplay-navy/70">
          <strong>Düşün</strong> düğmesine bas ve bilgisayardan iki el işaretini toplamasını iste!
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm font-semibold text-skyplay-teal">
            {isPicking ? "İki el işareti seç, bilgisayar toplasın!" : "Bilgisayar cevapladı!"}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <HandSignCard disabled={isAnswered} onChange={onSetLeft} value={state.left} />
            <span className="text-3xl font-bold text-skyplay-navy">+</span>
            <HandSignCard disabled={isAnswered} onChange={onSetRight} value={state.right} />
            <span className="text-3xl font-bold text-skyplay-navy">=</span>
            <div className="flex h-24 w-20 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-skyplay-teal/40 bg-white shadow">
              {isAnswered && state.answer !== null ? (
                <>
                  <span className="text-3xl font-bold text-skyplay-teal">{state.answer}</span>
                  <span className="text-[10px] text-skyplay-navy/50">cevap</span>
                </>
              ) : (
                <span className="text-3xl text-skyplay-navy/30">?</span>
              )}
            </div>
          </div>
          {isPicking && (
            <button
              className="mt-4 w-full rounded-[1.25rem] bg-skyplay-teal py-3 font-display text-xl text-white shadow-lg transition active:scale-95"
              onClick={onSubmit}
              type="button"
            >
              Bilgisayara sor! 💻
            </button>
          )}
          {state.resultMessage ? (
            <p className="mt-4 rounded-xl bg-skyplay-cream px-4 py-3 text-sm font-semibold text-skyplay-navy">
              {state.resultMessage}
            </p>
          ) : null}
        </>
      )}
    </div>
  );
}