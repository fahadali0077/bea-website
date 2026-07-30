type Props = {
  filledCount: number;
  total?: number;
};

export function WaitlistProgress({ filledCount, total = 4 }: Props) {
  return (
    <div
      className="waitlist-progress"
      role="progressbar"
      aria-valuenow={filledCount}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={
            "waitlist-progress-bar" +
            (i < filledCount ? " waitlist-progress-bar--filled" : "")
          }
        />
      ))}
    </div>
  );
}
