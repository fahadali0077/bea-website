import { Tooltip } from "@/app/components/admin/Tooltip";

export function IconButton({
  label,
  onClick,
  children,
  danger,
  active,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
  active?: boolean;
}) {
  const tone = danger
    ? "text-[#b0453a] hover:bg-[#faf0eb]"
    : active
      ? "text-[#3d7a6e] bg-[#e7f0ea]"
      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800";
  return (
    <Tooltip label={label}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer ${tone}`}
      >
        {children}
      </button>
    </Tooltip>
  );
}
