import { BUBBA_BRAND, BUBBA_LAUNCH_CITIES } from "@/lib/bubba-content";

import { BubbaCapture } from "./BubbaCapture";
import { BubbaDial } from "./BubbaDial";
import { BubbaShell } from "./BubbaShell";
import { WaitingRoomSection } from "./WaitingRoomSection";

export function BubbaLanding() {
  return (
    <BubbaShell active="home">
        {/* ── Hero ── */}
        <section className="bb-hero">
          <div className="bb-shell">
            <h1 className="bb-display bb-display--xl bb-hero-title">
              Together, today.
              <span className="bb-hero-tm">™</span>
            </h1>
            <p className="bb-hero-sub">24 hours to chat</p>
            <div className="bb-hero-capture">
              <BubbaCapture label="Join the waitlist" />
            </div>
          </div>
        </section>

        {/* ── Launching in ── */}
        <section className="bb-rail">
          <div className="bb-shell">
            <p className="bb-eyebrow bb-eyebrow--muted">Launching this summer</p>
            <ul className="bb-rail-cities">
              {BUBBA_LAUNCH_CITIES.map((city) => (
                <li key={city} className="bb-rail-city">
                  {city}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Waiting Room ── */}
        <WaitingRoomSection />
        {/* ── The moment: signature countdown ── */}
        <section className="bb-moment">
          <div className="bb-shell">
            <p className="bb-eyebrow">Designed for the moment</p>
            <h2
              className="bb-display bb-display--lg"
              style={{ marginTop: 14 }}
            >
              24 hours to chat
            </h2>
            <p className="bb-moment-lede">
              Only see recently active profiles. Every conversation lasts 24
              hours.
            </p>

            <BubbaDial />
          </div>

          <div className="bb-scene">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BUBBA_BRAND.scene}
              alt="An illustrated street scene of people meeting up around the city"
            />
            <p className="bb-scene-caption">Right people. Right now.</p>
          </div>
        </section>

    </BubbaShell>
  );
}
