export function WaitlistCheckBadge() {
  return (
    <svg
      className="waitlist-check-badge-svg"
      viewBox="0 0 96 96"
      width="96"
      height="96"
      role="img"
      aria-label="Confirmed"
    >
      <g stroke="#cda96b" strokeWidth="2.5" strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="48"
            y1="5"
            x2="48"
            y2="12"
            transform={`rotate(${i * 30} 48 48)`}
          />
        ))}
      </g>
      <circle cx="48" cy="48" r="30" fill="#f1e8d9" />
      <path
        d="M37 49 l7.5 7.5 L60 41"
        fill="none"
        stroke="#2a2522"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
