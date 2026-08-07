"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

import { BUBBA_BRAND, BUBBA_FAQS } from "@/lib/bubba-content";

import { BubbaShell } from "./BubbaShell";

export function BubbaFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <BubbaShell showCapture={false}>
        <div className="bb-shell">
          <header className="bb-faq-head">
            <p className="bb-eyebrow bb-eyebrow--muted">
              Frequently asked questions
            </p>
            <h1 className="bb-display bb-display--lg" style={{ marginTop: 14 }}>
              Everything you need
              <br />
              to know
            </h1>
            <p className="bb-lede bb-faq-sub">
              Answers to the most common questions about our dating app.
            </p>
          </header>

          <div className="bb-faq-list">
            {BUBBA_FAQS.map((item, index) => {
              const open = openIndex === index;
              const panelId = `bb-faq-panel-${index}`;

              return (
                <div className="bb-faq-item" key={item.q}>
                  <h2 style={{ margin: 0 }}>
                    <button
                      type="button"
                      className="bb-faq-q"
                      onClick={() => setOpenIndex(open ? null : index)}
                      aria-expanded={open}
                      aria-controls={panelId}
                    >
                      {item.q}
                      <ChevronDown
                        size={19}
                        strokeWidth={1.9}
                        style={{
                          flex: "0 0 auto",
                          transition: "transform 0.22s ease",
                          transform: open ? "rotate(180deg)" : undefined,
                        }}
                        aria-hidden="true"
                      />
                    </button>
                  </h2>
                  {open ? (
                    <p className="bb-faq-a" id={panelId}>
                      {item.a}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>

          <section className="bb-faq-cta">
            <div className="bb-faq-cta-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={BUBBA_BRAND.faqScene}
                alt="An illustration of someone cycling along the waterfront"
              />
            </div>
            <div className="bb-faq-cta-body">
              <h2 className="bb-faq-cta-title">Still have questions?</h2>
              <p className="bb-faq-cta-text">
                We&apos;re here to help. Contact our support team and someone
                will get back to you.
              </p>
              <Link href="/contact" className="bb-faq-cta-link">
                <span>Contact support</span>
                <ArrowRight size={16} strokeWidth={2.1} />
              </Link>
            </div>
          </section>
        </div>
    </BubbaShell>
  );
}
