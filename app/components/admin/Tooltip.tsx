export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="relative inline-flex group">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 font-lato text-[11px] font-semibold text-white opacity-0 shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
      </span>
    </span>
  );
}
