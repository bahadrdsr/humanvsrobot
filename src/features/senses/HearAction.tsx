import { useEffect, useState } from "react";

type HearActionProps = {
  transcript: string;
  message: string;
  fallbackText: string;
  clipDurationMs: number;
  hasRecording: boolean;
  requiresManualPlayback: boolean;
  playbackState: "idle" | "ready" | "playing" | "failed";
  onPlayRecording: () => Promise<unknown>;
  onSubmitFallback: (text: string) => Promise<unknown>;
  onClose?: () => void;
};

export function HearAction({ transcript, message, fallbackText, clipDurationMs, hasRecording, requiresManualPlayback, playbackState, onPlayRecording, onSubmitFallback, onClose }: HearActionProps) {
  const [value, setValue] = useState(fallbackText);
  const clipSeconds = Math.max(1, Math.round((clipDurationMs || 5000) / 1000));

  useEffect(() => {
    setValue(fallbackText);
  }, [fallbackText]);

  return (
    <div className="rounded-[1.75rem] bg-white/80 p-5 shadow-bubble">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl text-skyplay-navy">Dinle</h3>
        {onClose ? (
          <button
            aria-label="Dinleme penceresini kapat"
            className="rounded-full bg-white/85 px-3 py-1 text-lg font-bold leading-none text-skyplay-navy shadow"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-sm leading-6 text-skyplay-navy/75">{message}</p>
      <p className="mt-3 rounded-2xl bg-skyplay-cream px-4 py-3 text-base font-semibold text-skyplay-navy">
        {transcript || "Bilgisayarın duyduğu sözcükler burada görünür."}
      </p>

      <div className="mt-4 rounded-[1.5rem] border border-skyplay-teal/15 bg-skyplay-teal/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-skyplay-teal">Geçici ses klibi</p>
            <p className="mt-1 text-sm text-skyplay-navy/70">
              {hasRecording
                ? requiresManualPlayback
                  ? `${clipSeconds} saniyelik klip kaydedildi. Mobilde dinlemek için düğmeye dokun.`
                  : `${clipSeconds} saniyelik klip kaydedildi. Dinle yeniden çalıştığında silinir.`
                : "Dinleme bitince hızlı tekrar için kısa bir ses klibi burada tutulur."}
            </p>
          </div>
          <button
            className="rounded-full bg-skyplay-teal px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-skyplay-teal/40"
            disabled={!hasRecording || playbackState === "playing"}
            onClick={() => {
              void onPlayRecording().catch(() => undefined);
            }}
            type="button"
          >
            {playbackState === "playing" ? "Oynatılıyor..." : hasRecording ? "Klibi oynat" : "Henüz klip yok"}
          </button>
        </div>
      </div>

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmitFallback(value).catch(() => undefined);
        }}
      >
        <input
          aria-label="Yedek ifade"
          className="flex-1 rounded-full border border-skyplay-teal/30 px-4 py-3"
          name="fallbackText"
          onChange={(event) => setValue(event.target.value)}
          placeholder="Dinleme çalışmazsa bir ifade yaz"
          value={value}
        />
        <button className="rounded-full bg-skyplay-coral px-5 py-3 font-bold text-white" type="submit">
          Yazdıklarını tekrar et
        </button>
      </form>
    </div>
  );
}