import Link from "next/link";
import { ArrowRight, Camera, Heart, School, Users } from "lucide-react";

function Signpost() {
  return (
    <svg
      viewBox="0 0 120 120"
      width="118"
      height="118"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M60 24v82" />
      <path d="M60 34h38l9 9-9 9H60z" />
      <path d="M60 62H22l-9 9 9 9h38z" />
      <path d="M44 108c6-3 12-3 18 0M52 112c8-4 16-2 22 1" />
    </svg>
  );
}

export function WaitingRoomSection() {
  return (
    <section className="bb-wr" id="waiting-room">
      <div className="bb-shell bb-shell--wide">
        <div className="bb-wr-grid">
          <div>
            <p className="bb-eyebrow">The waiting room</p>
            <h2 className="bb-display bb-display--lg bb-wr-title" style={{ marginTop: 16 }}>
              One prompt.
              <br />
              <span className="bb-wr-line2">Every campus.</span>
            </h2>
            <div className="bb-wr-rule" />
            <p className="bb-lede bb-wr-copy">
              Over 100 participating schools across the country. Each school
              receives the same prompt every day.
            </p>

            <div className="bb-wr-stat">
              <span className="bb-wr-stat-badge">
                <School size={26} strokeWidth={1.5} />
              </span>
              <div>
                <span className="bb-wr-stat-num">100+</span>
                <p className="bb-wr-stat-label">Participating schools</p>
              </div>
            </div>
          </div>

          <div className="bb-wr-fan">
            <article className="bb-card bb-card--a">
              <div className="bb-card-top">
                <span className="bb-chip bb-chip--green">Prompt</span>
                <span className="bb-seal bb-seal--green" aria-hidden="true">
                  B
                </span>
              </div>
              <div className="bb-card-body">
                <p className="bb-card-prompt">
                  If I had one last first date ever it would be…
                </p>
              </div>
              <div className="bb-card-foot">
                <span className="bb-card-likes">
                  <Heart size={14} strokeWidth={1.8} /> 184
                </span>
                <span className="bb-card-foot-action">
                  View top responses <ArrowRight size={13} strokeWidth={2} />
                </span>
              </div>
            </article>

            <article className="bb-card bb-card--b">
              <div className="bb-card-top">
                <span className="bb-chip bb-chip--blue">Snap</span>
                <span className="bb-seal bb-seal--blue" aria-hidden="true">
                  B
                </span>
              </div>
              <div className="bb-card-body bb-card-art">
                <Camera size={88} strokeWidth={1.4} aria-hidden="true" />
              </div>
              <div className="bb-card-foot" style={{ justifyContent: "flex-end" }}>
                <span className="bb-card-foot-action">
                  See what&apos;s next <ArrowRight size={13} strokeWidth={2} />
                </span>
              </div>
            </article>

            <article className="bb-card bb-card--c">
              <div className="bb-card-top">
                <span className="bb-chip bb-chip--clay">This or that</span>
                <span className="bb-seal bb-seal--clay" aria-hidden="true">
                  B
                </span>
              </div>
              <div className="bb-card-body bb-card-art">
                <Signpost />
              </div>
              <div className="bb-card-foot" style={{ justifyContent: "flex-end" }}>
                <span className="bb-card-foot-action">
                  Pick your side <ArrowRight size={13} strokeWidth={2} />
                </span>
              </div>
            </article>
          </div>
        </div>

        <div className="bb-wr-bar">
          <span className="bb-wr-bar-icon" aria-hidden="true">
            <Users size={20} strokeWidth={1.7} />
          </span>
          <p className="bb-wr-bar-text">
            Submit your response daily, vote for your favourites, and earn points
            for your school.
          </p>
          <Link href="/waitlist/start" className="bb-link">
            Explore the waiting room <ArrowRight size={15} strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
