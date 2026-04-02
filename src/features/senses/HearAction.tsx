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
};

export function HearAction({ transcript, message, fallbackText, clipDurationMs, hasRecording, requiresManualPlayback, playbackState, onPlayRecording, onSubmitFallback }: HearActionProps) {
  const [value, setValue] = useState(fallbackText);
  const clipSeconds = Math.max(1, Math.round((clipDurationMs || 5000) / 1000));

  useEffect(() => {
    setValue(fallbackText);
  }, [fallbackText]);

  return (
    <div className="rounded-[1.75rem] bg-white/80 p-5 shadow-bubble">
      <h3 className="font-display text-2xl text-skyplay-navy">Dinle</h3>
      <p className="mt-2 text-sm leading-6 text-skyplay-navy/75">{message}</p>
      <p className="mt-3 rounded-2xl bg-skyplay-cream px-4 py-3 text-base font-semibold text-skyplay-navy">
        {transcript || "Bilgisayarin duydugu sozcukler burada gorunur."}
      </p>

      <div className="mt-4 rounded-[1.5rem] border border-skyplay-teal/15 bg-skyplay-teal/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-skyplay-teal">Gecici ses klibi</p>
            <p className="mt-1 text-sm text-skyplay-navy/70">
              {hasRecording
                ? requiresManualPlayback
                  ? `${clipSeconds} saniyelik klip kaydedildi. Mobilde dinlemek icin dugmeye dokun.`
                  : `${clipSeconds} saniyelik klip kaydedildi. Dinle yeniden calistiginda silinir.`
                : "Dinleme bitince hizli tekrar icin kisa bir ses klibi burada tutulur."}
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
            {playbackState === "playing" ? "Oynatiliyor..." : hasRecording ? "Klibi oynat" : "Henuz klip yok"}
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
          placeholder="Dinleme calismazsa bir ifade yaz"
          value={value}
        />
        <button className="rounded-full bg-skyplay-coral px-5 py-3 font-bold text-white" type="submit">
          Yazdiklarini tekrar et
        </button>
      </form>
    </div>
  );
}