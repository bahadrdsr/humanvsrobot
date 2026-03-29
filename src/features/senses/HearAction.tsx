import { useEffect, useState } from "react";

type HearActionProps = {
  transcript: string;
  message: string;
  fallbackText: string;
  clipDurationMs: number;
  hasRecording: boolean;
  playbackState: "idle" | "ready" | "playing" | "failed";
  onPlayRecording: () => Promise<void>;
  onSubmitFallback: (text: string) => Promise<void>;
};

export function HearAction({ transcript, message, fallbackText, clipDurationMs, hasRecording, playbackState, onPlayRecording, onSubmitFallback }: HearActionProps) {
  const [value, setValue] = useState(fallbackText);
  const clipSeconds = Math.max(1, Math.round((clipDurationMs || 5000) / 1000));

  useEffect(() => {
    setValue(fallbackText);
  }, [fallbackText]);

  return (
    <div className="rounded-[1.75rem] bg-white/80 p-5 shadow-bubble">
      <h3 className="font-display text-2xl text-skyplay-navy">Hear</h3>
      <p className="mt-2 text-sm leading-6 text-skyplay-navy/75">{message}</p>
      <p className="mt-3 rounded-2xl bg-skyplay-cream px-4 py-3 text-base font-semibold text-skyplay-navy">
        {transcript || "The robot will show the words it heard here."}
      </p>

      <div className="mt-4 rounded-[1.5rem] border border-skyplay-teal/15 bg-skyplay-teal/5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-skyplay-teal">Temporary sound clip</p>
            <p className="mt-1 text-sm text-skyplay-navy/70">
              {hasRecording ? `Saved for ${clipSeconds} seconds and cleared the next time Hear runs.` : "When Hear finishes, the robot keeps a short clip here for quick playback."}
            </p>
          </div>
          <button
            className="rounded-full bg-skyplay-teal px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-skyplay-teal/40"
            disabled={!hasRecording || playbackState === "playing"}
            onClick={() => {
              void onPlayRecording();
            }}
            type="button"
          >
            {playbackState === "playing" ? "Playing..." : hasRecording ? "Play clip" : "No clip yet"}
          </button>
        </div>
      </div>

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmitFallback(value);
        }}
      >
        <input
          aria-label="Fallback phrase"
          className="flex-1 rounded-full border border-skyplay-teal/30 px-4 py-3"
          name="fallbackText"
          onChange={(event) => setValue(event.target.value)}
          placeholder="Type a phrase if listening is unavailable"
          value={value}
        />
        <button className="rounded-full bg-skyplay-coral px-5 py-3 font-bold text-white" type="submit">
          Repeat typed phrase
        </button>
      </form>
    </div>
  );
}