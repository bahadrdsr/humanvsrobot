import { useEffect, useRef } from "react";

type CameraPreviewProps = {
  stream: MediaStream | null;
  message: string;
  visible: boolean;
  onClose: () => void;
};

export function CameraPreview({ stream, message, visible, onClose }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!visible) {
    return null;
  }

  return (
    <div aria-label="Kamera gorunumu" aria-modal="false" className="camera-overlay-shell absolute inset-0 z-20 overflow-hidden rounded-[2.5rem]" role="dialog">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent_22%),linear-gradient(180deg,rgba(17,74,118,0.15),rgba(7,28,63,0.42))]" />
      <div className="camera-overlay-sparkle absolute left-8 top-10 h-24 w-24 rounded-full bg-white/18 blur-md" />
      <div className="camera-overlay-sparkle camera-overlay-sparkle-delayed absolute bottom-12 right-16 h-32 w-32 rounded-full bg-skyplay-lemon/20 blur-md" />
      <div className="absolute inset-0 flex flex-col">
        <div className="flex items-start justify-between gap-4 p-5 lg:p-6">
          <div className="camera-overlay-badge max-w-sm rounded-[1.5rem] bg-white/78 px-4 py-3 shadow-bubble backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-skyplay-teal">Bilgisayar kamerasi</p>
            <p className="mt-2 text-sm leading-6 text-skyplay-navy/75">{message}</p>
          </div>
          <button
            aria-label="Kamera gorunumunu kapat"
            className="rounded-full bg-white/88 px-3 py-2 text-sm font-bold text-skyplay-navy shadow transition hover:scale-105"
            onClick={onClose}
            type="button"
          >
            Kapat
          </button>
        </div>
        <div className="min-h-0 flex-1 px-4 pb-4 lg:px-6 lg:pb-6">
          <div className="h-full overflow-hidden rounded-[2rem] border border-white/45 bg-skyplay-navy/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
            {stream ? (
              <video autoPlay className="h-full w-full object-cover" muted playsInline ref={videoRef} />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-base text-white/86">
                Bilgisayar kamera goruntusunu hazirliyor.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}