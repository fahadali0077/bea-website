import { JOIN_STEPS } from "@/lib/join";

type Props = {
  /** Zero-based index of the step being shown. */
  current: number;
};

/**
 * One dot per collecting step, joined by rules — the same fill-as-you-advance
 * behaviour as the ambassador onboarding indicator, sized to this flow.
 */
export function JoinDots({ current }: Props) {
  return (
    <ol className="jn-dots" aria-label={`Step ${current + 1} of ${JOIN_STEPS.length}`}>
      {JOIN_STEPS.map((step, i) => (
        <li
          key={step.slug}
          className={
            "jn-dot" +
            (i < current ? " jn-dot--done" : "") +
            (i === current ? " jn-dot--now" : "")
          }
          aria-current={i === current ? "step" : undefined}
        >
          <span className="jn-dot-mark" />
        </li>
      ))}
    </ol>
  );
}
