import Link from "next/link";
import { Instagram, Music2 } from "lucide-react";

import {
  BUBBA_BRAND,
  BUBBA_FOOTER_ABOUT,
  BUBBA_FOOTER_EXPLORE,
  BUBBA_FOOTER_LEGAL,
} from "@/lib/bubba-content";

import { BubbaCapture } from "./BubbaCapture";

type Props = {
  /** The closing capture card only belongs on pages that are still selling. */
  showCapture?: boolean;
};

export function BubbaFooter({ showCapture = true }: Props) {
  return (
    <>
      {showCapture ? (
        <section className="bb-closer">
          <div className="bb-closer-card">
            <h2 className="bb-closer-title">Be first for Bubba.</h2>
            <p className="bb-closer-sub">
              Join the Waiting Room before your city launches.
            </p>
            <BubbaCapture
              label="Join the waitlist"
              placeholder="Your email address"
            />
          </div>
        </section>
      ) : null}

      <footer className="bb-footer">
        <div className="bb-shell bb-shell--wide">
          <div className="bb-footer-grid">
            <div>
              <div className="bb-footer-brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BUBBA_BRAND.wordmark} alt="Bubba" />
              </div>
              <p className="bb-footer-tag">
                {BUBBA_BRAND.tagline}
                <sup style={{ fontSize: "0.5em" }}>™</sup>
              </p>
              <p className="bb-footer-about">{BUBBA_FOOTER_ABOUT}</p>

            </div>

            <div>
              <h2 className="bb-footer-heading">Explore</h2>
              <ul
                className="bb-footer-list"
                style={{
                  gridTemplateRows: `repeat(${Math.ceil(
                    BUBBA_FOOTER_EXPLORE.length / 2,
                  )}, auto)`,
                }}
              >
                {BUBBA_FOOTER_EXPLORE.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>

              <div className="bb-footer-social">
                <a href="https://instagram.com" aria-label="Bubba on Instagram">
                  <Instagram size={19} strokeWidth={1.6} />
                  <span>Instagram</span>
                </a>
                <a href="https://tiktok.com" aria-label="Bubba on TikTok">
                  <Music2 size={19} strokeWidth={1.6} />
                  <span>TikTok</span>
                </a>
              </div>

              <hr className="bb-footer-sep" />
            </div>

            <div>
              <h2 className="bb-footer-heading">Legal</h2>
              <ul
                className="bb-footer-list"
                style={{
                  gridTemplateRows: `repeat(${Math.ceil(
                    BUBBA_FOOTER_LEGAL.length / 2,
                  )}, auto)`,
                }}
              >
                {BUBBA_FOOTER_LEGAL.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bb-footer-base">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BUBBA_BRAND.mark} alt="" className="bb-footer-seal" />
            <span>Bubba {new Date().getFullYear()}. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
