/** Soft loading affordances shared across join-flow searches. */

export function JoinSearchSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul className="jn-results" aria-busy="true" aria-label="Searching">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="jn-results-skel" />
      ))}
    </ul>
  );
}
