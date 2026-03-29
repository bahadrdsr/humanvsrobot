type LiveStatusProps = {
  message: string;
};

export function LiveStatus({ message }: LiveStatusProps) {
  return (
    <div aria-live="polite" className="rounded-[1.75rem] bg-skyplay-navy p-5 text-white shadow-bubble" role="status">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-skyplay-lemon">Robot status</p>
      <p className="mt-3 text-lg leading-7">{message}</p>
    </div>
  );
}