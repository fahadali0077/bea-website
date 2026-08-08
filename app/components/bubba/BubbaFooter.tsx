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
              <div className="lg:pt-[115px]">
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
                  <svg width="45.08" height="45.08" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.34003 4.48999C6.21003 4.48999 4.48999 6.20997 4.48999 8.33997C4.48999 10.47 6.21003 12.1899 8.34003 12.1899C10.47 12.1899 12.19 10.47 12.19 8.33997C12.19 6.20997 10.47 4.48999 8.34003 4.48999ZM8.34003 10.91C6.92003 10.91 5.77002 9.75997 5.77002 8.33997C5.77002 6.91997 6.92003 5.77002 8.34003 5.77002C9.76003 5.77002 10.91 6.91997 10.91 8.33997C10.91 9.75997 9.76003 10.91 8.34003 10.91ZM12.19 0H4.48999C2.00999 0 0 2.00999 0 4.48999V12.1899C0 14.6699 2.00999 16.6801 4.48999 16.6801H12.19C14.67 16.6801 16.68 14.6699 16.68 12.1899V4.48999C16.68 2.00999 14.67 0 12.19 0ZM15.4 12.1899C15.4 13.9599 13.96 15.4 12.19 15.4H4.48999C2.71999 15.4 1.28003 13.9599 1.28003 12.1899V4.48999C1.28003 2.71999 2.71999 1.28003 4.48999 1.28003H12.19C13.96 1.28003 15.4 2.71999 15.4 4.48999V12.1899ZM13.47 4.17004C13.47 4.70004 13.04 5.13 12.51 5.13C11.98 5.13 11.55 4.70004 11.55 4.17004C11.55 3.64004 11.98 3.20996 12.51 3.20996C13.04 3.20996 13.47 3.64004 13.47 4.17004Z" fill="black"/>
                  </svg>
                  <span>Instagram</span>
                </a>
                <a href="https://tiktok.com" aria-label="Bubba on TikTok">
                  <svg width="45.08" height="45.08" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.03 4.48999C13.9 4.48999 12.18 2.76989 12.18 0.639893C12.18 0.289893 11.89 0 11.54 0H8.33002C7.98002 0 7.69 0.289893 7.69 0.639893V11.23C7.69 12.12 6.97002 12.83 6.08002 12.83C5.19002 12.83 4.48004 12.11 4.48004 11.22C4.48004 10.6 4.84002 10.0399 5.40002 9.7699C5.62002 9.6599 5.77002 9.43994 5.77002 9.18994V5.7699C5.77002 5.4199 5.48 5.13 5.13 5.13C5.09 5.13 5.05002 5.13 5.02002 5.13C2.16002 5.64001 0 8.25997 0 11.22C0 14.59 2.73004 17.3199 6.10004 17.3199C9.47004 17.3199 12.2 14.59 12.2 11.22V8.02991C13.39 8.64991 14.71 8.96997 16.05 8.96997C16.4 8.96997 16.69 8.67996 16.69 8.32996V5.12C16.69 4.77 16.4 4.47998 16.05 4.47998L16.03 4.48999ZM15.39 7.66992C14.14 7.55992 12.93 7.10999 11.91 6.37C11.62 6.16 11.22 6.2299 11.01 6.5199C10.93 6.6299 10.89 6.7599 10.89 6.8999V11.23C10.89 13.89 8.74002 16.0399 6.08002 16.0399C3.42002 16.0399 1.27002 13.89 1.27002 11.23C1.27002 9.14998 2.60004 7.28999 4.48004 6.60999V8.82996C3.15004 9.71996 2.79999 11.51 3.67999 12.84C4.56999 14.17 6.36 14.5199 7.69 13.6399C8.49 13.0999 8.97003 12.2 8.97003 11.24V1.28992H10.94C11.24 3.60992 13.07 5.44999 15.39 5.73999V7.67993V7.66992Z" fill="black"/>
                  </svg>
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
