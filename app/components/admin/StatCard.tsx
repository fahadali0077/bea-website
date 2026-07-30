export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#fbfbf9] border border-neutral-200/50 rounded-[12px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex items-center gap-4">
      <div className="w-11 h-11 rounded-full bg-[#efebe5] flex items-center justify-center shrink-0 text-[#584939]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-lato text-[12px] md:text-[14px] font-medium text-neutral-500 leading-none">
          {label}
        </p>
        <p className="font-lato text-[20px] md:text-[26px] font-bold text-neutral-800 mt-2 leading-none">
          {value}
        </p>
      </div>
    </div>
  );
}
