type Props = {
  size?: number;
  className?: string;
};

export function AmbassadorProgramLogo({ size = 76, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 76 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index * 30 * Math.PI) / 180;
        const inner = 30;
        const outer = 36;
        const x1 = 38 + Math.sin(angle) * inner;
        const y1 = 38 - Math.cos(angle) * inner;
        const x2 = 38 + Math.sin(angle) * outer;
        const y2 = 38 - Math.cos(angle) * outer;

        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        );
      })}
      <text
        x="38"
        y="47"
        textAnchor="middle"
        fontFamily='"Canela Text", Georgia, "Times New Roman", serif'
        fontStyle="italic"
        fontSize="34"
        fill="currentColor"
      >
        B
      </text>
    </svg>
  );
}
