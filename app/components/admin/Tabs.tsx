export type TabItem<T extends string> = {
  value: T;
  label: string;
  count?: number;
};

export function Tabs<T extends string>({
  items,
  active,
  onChange,
}: {
  items: TabItem<T>[];
  active: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex items-center gap-1 bg-[#f1eee7] p-1 rounded-full w-full sm:w-auto self-start overflow-x-auto no-scrollbar">
      {items.map((item) => {
        const isActive = item.value === active;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-lato text-[13px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
              isActive ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {item.label}
            {typeof item.count === "number" && (
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-[#efebe5] text-[#584939]" : "bg-white/70 text-neutral-500"
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
