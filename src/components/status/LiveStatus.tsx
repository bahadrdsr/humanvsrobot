type LiveStatusProps = {
  message: string;
};

export function LiveStatus({ message }: LiveStatusProps) {
  return (
    <div aria-live="polite" className="rounded-[1.5rem] bg-skyplay-navy p-3 text-white shadow-bubble lg:rounded-[1.75rem] lg:p-5" role="status">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-skyplay-lemon">Robot status</p>
      <p className="mt-1 line-clamp-2 text-sm leading-6 lg:mt-3 lg:line-clamp-none lg:text-lg lg:leading-7">{message}</p>
    </div>
  );
}