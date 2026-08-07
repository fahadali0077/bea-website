type Props = {
  /** What the visitor was trying to load, e.g. "cities". */
  what: string;
  onRetry: () => void;
};

/**
 * Shown when a lookup fails. The flow stays usable either way — every step
 * that can fail also has a way past it — so this explains and offers a retry
 * rather than blocking.
 */
export function JoinFail({ what, onRetry }: Props) {
  return (
    <div className="jn-fail" role="alert">
      <p>
        We couldn&rsquo;t load {what} just now. Check your connection and try
        again — you can also carry on without choosing.
      </p>
      <button type="button" className="jn-retry" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
