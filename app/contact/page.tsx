import type { Metadata } from "next";

import { BubbaFooter } from "@/app/components/bubba/BubbaFooter";
import { BubbaNav } from "@/app/components/bubba/BubbaNav";
import { BUBBA_BRAND } from "@/lib/bubba-content";

import "@/styles/bubba.css";

export const metadata: Metadata = {
  title: "Contact us — Bubba",
  description:
    "How to reach Bubba for support, partnerships, press and legal enquiries.",
};

export default function ContactPage() {
  return (
    <div className="bb-page">
      <BubbaNav />

      <main className="bb-main">
        <div className="bb-shell">
          <header className="bb-doc" style={{ paddingBottom: 0 }}>
            <p className="bb-eyebrow bb-eyebrow--muted">Get in touch</p>
            <h1 className="bb-display bb-display--lg" style={{ marginTop: 14 }}>
              Contact us
            </h1>
          </header>

          <div className="bb-contact-grid" style={{ paddingTop: 36 }}>
            <section className="bb-contact-card">
              <h2>Customer support</h2>
              <p>Bubba customer support can be reached at:</p>
              <a
                className="bb-link"
                href={`mailto:${BUBBA_BRAND.supportEmail}`}
              >
                {BUBBA_BRAND.supportEmail}
              </a>
            </section>

            <section className="bb-contact-card">
              <h2>Partnerships</h2>
              <p>Interested in partnering with us?</p>
              <a
                className="bb-link"
                href={`mailto:${BUBBA_BRAND.partnershipsEmail}`}
              >
                {BUBBA_BRAND.partnershipsEmail}
              </a>
            </section>

            <section className="bb-contact-card" id="press">
              <h2>Press enquiries</h2>
              <p>For press enquiries, please email:</p>
              <a className="bb-link" href={`mailto:${BUBBA_BRAND.pressEmail}`}>
                {BUBBA_BRAND.pressEmail}
              </a>
            </section>

            <section className="bb-contact-card">
              <h2>Legal</h2>
              <p>
                For legal correspondence, including notices under the Digital
                Services Act, email:
              </p>
              <a className="bb-link" href={`mailto:${BUBBA_BRAND.legalEmail}`}>
                {BUBBA_BRAND.legalEmail}
              </a>
            </section>

            <section className="bb-contact-card bb-contact-card--wide">
              <h2>Digital Services Act point of contact</h2>
              <p>
                Pursuant to Article 11 of the Digital Services Act, Bubba has
                designated {BUBBA_BRAND.legalEmail} as its single point of
                contact for communications from Member State authorities, the
                European Commission, and the European Board for Digital
                Services. Please include your full name and the authority you
                represent. English is the preferred language for correspondence.
                Communications from individuals or entities other than these
                authorities may not receive a response.
              </p>
              <p>
                Pursuant to Article 12, Bubba has designated its support centre
                as its single point of contact for users. To contact our support
                team, please submit a request through the support centre and a
                member of our team will respond to you by email.
              </p>
            </section>

            <section className="bb-contact-card bb-contact-card--wide">
              <h2>Company details</h2>
              <address className="bb-address">
                Bubba Operating Company, LLC
                <br />
                580 Farmington Avenue
                <br />
                Hartford, CT 06105
                <br />
                United States
              </address>
              <p style={{ marginTop: 16 }}>
                Website hosting provider: Amazon Web Services, 1200 12th Avenue
                South, Suite 1200, Seattle, WA 98144.
              </p>
            </section>
          </div>
        </div>
      </main>

      <BubbaFooter showCapture={false} />
    </div>
  );
}
