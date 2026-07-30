export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-sfpro text-[11px] font-bold text-[#402b23] uppercase tracking-widest mb-1">
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
}

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-neutral-200/40 last:border-0">
      <span className="font-lato text-[13px] font-medium text-neutral-500 shrink-0">{label}</span>
      <span className="font-lato text-[13px] font-semibold text-neutral-800 text-right break-words">
        {value}
      </span>
    </div>
  );
}
