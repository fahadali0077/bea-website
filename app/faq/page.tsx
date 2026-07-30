"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "What's different about bea?",
    answer:
      "Bea is built around active, real-time connection. With a 24-hour match clock and live-only statuses, it eliminates ghosting and endless swiping so you connect today.",
  },
  {
    question: "How much does it cost to join?",
    answer:
      "Joining the waitlist and using basic features is completely free. We will introduce premium perks and community benefits close to launch.",
  },
  {
    question: "Is this better than other dating apps?",
    answer:
      "Yes, because it focuses on high-intent matches. You only see active profiles, meaning every connection represents someone ready to meet.",
  },
];

export default function FAQPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <>
      <title>FAQ — Bea</title>
      <meta
        name="description"
        content="Answers to the most common questions about Bea — the real-time dating app built around active connections."
      />

      <div className="faq-root">
        <Navbar activePage="faq" fullWidth={true} />

        <main className="faq-main">
          {/* ── Hero header ── */}
          <section className="faq-hero">
            <div className="faq-hero-left">
              <span className="faq-eyebrow">Frequently asked questions</span>
              <h1 className="faq-title">Everything you need<br className="faq-br" /> to know</h1>
              <p className="faq-subtitle">
                Answers to the most common questions <br /> about our dating app.
              </p>
            </div>
          </section>

          {/* ── Accordion ── */}
          <section className="faq-accordion-section">
            <div className="faq-accordion">
              {faqData.map((item, index) => {
                const isOpen = expandedIndex === index;
                return (
                  <div
                    key={index}
                    className={`faq-item${isOpen ? " faq-item--open" : ""}`}
                  >
                    <button
                      className="faq-question"
                      onClick={() => setExpandedIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        size={18}
                        className={`faq-chevron${isOpen ? " faq-chevron--open" : ""}`}
                      />
                    </button>
                    <div className={`faq-answer${isOpen ? " faq-answer--open" : ""}`}>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Still have questions ── */}
          <section className="faq-cta-section">
            <div className="faq-cta-card">
              <div className="faq-cta-img-wrap">
                <Image
                  src="/images/faq-group.png"
                  alt="Friends connecting on Bea"
                  fill
                  priority
                  className="faq-cta-img"
                />
              </div>
              <div className="faq-cta-text">
                <h2 className="faq-cta-title">Still have questions?</h2>
                <p className="faq-cta-sub">We&rsquo;re out of answers, sorry.</p>
              </div>
            </div>
          </section>
        </main>
      </div>

      <style>{`
        .faq-root {
          min-height: 100vh;
          background: #f8f6f3;
          color: #1a1a1a;
          font-family: var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .faq-main {
          width: 100%;
          max-width: 100%;
          padding: 0 64px;
          box-sizing: border-box;
        }

        .faq-hero {
          padding: 56px 0 64px;
        }

        .faq-hero-left {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-eyebrow {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9a9490;
        }

        .faq-title {
          margin: 0;
          font-family: var(--font-canela), serif;
          font-size: 60px;
          font-weight: 400;
          line-height: 1.06;
          letter-spacing: -0.03em;
          color: #1a1a1a;
        }

        .faq-subtitle {
          margin: 0;
          font-family: var(--font-lato), var(--font-sans), sans-serif;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.5;
          color: #6b6660;
          max-width: 680px;
        }

        .faq-accordion-section {
          padding: 48px 0 64px;
        }

        .faq-accordion {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 16px;
        }

        .faq-item {
          background: #f8f6f3;
          border-radius: 12px;
          border: 1px solid #e5e1dc;
          padding: 0 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: 24px;
          font-family: inherit;
        }

        .faq-question span {
          font-family: var(--font-lato), var(--font-sans), sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.4;
        }

        .faq-chevron {
          flex-shrink: 0;
          color: #9a9490;
          transition: transform 0.25s ease;
        }

        .faq-chevron--open {
          transform: rotate(180deg);
          color: #1a1a1a;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.25s ease;
          opacity: 0;
        }

        .faq-answer--open {
          max-height: 300px;
          opacity: 1;
        }

        .faq-answer p {
          font-size: 16px;
          line-height: 1.7;
          color: #6b6660;
          padding-bottom: 24px;
          margin: 0;
          max-width: 720px;
        }

        .faq-cta-section {
          padding-bottom: 80px;
        }

        .faq-cta-card {
          display: flex;
          border-radius: 24px;
          overflow: hidden;
          background: #f5f0eb;
          min-height: 300px;
        }

        .faq-cta-img-wrap {
          position: relative;
          width: 50%;
          flex-shrink: 0;
        }

        .faq-cta-img {
          object-fit: cover;
          object-position: center;
        }

        .faq-cta-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 10px;
          padding: 48px 56px;
        }

        .faq-cta-title {
          margin: 0;
          font-family: var(--font-canela), serif;
          font-size: 48px;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: #1a1a1a;
        }

        .faq-cta-sub {
          margin: 0;
          font-family: var(--font-lato), var(--font-sans), sans-serif;
          font-size: 24px;
          font-weight: 500;
          color: #6b6660;
        }

        @media (max-width: 767px) {
          .faq-main {
            padding: 0 20px;
          }

          .faq-hero {
            padding: 32px 0 40px;
          }

          .faq-title {
            font-size: 36px;
          }

          .faq-subtitle {
            font-size: 18px;
          }

          .faq-accordion-section {
            padding: 32px 0 48px;
          }

          .faq-question span {
            font-size: 18px;
          }

          .faq-question {
            padding: 20px 0;
          }

          .faq-answer p {
            font-size: 14px;
            line-height: 1.6;
            padding-bottom: 20px;
          }

          .faq-cta-card {
            flex-direction: column;
            border-radius: 18px;
          }

          .faq-cta-img-wrap {
            width: 100%;
            height: 200px;
            position: relative;
          }

          .faq-cta-text {
            padding: 28px 24px;
          }

          .faq-cta-title {
            font-size: 28px;
          }

          .faq-cta-sub {
            font-size: 18px;
          }

          .faq-cta-section {
            padding-bottom: 56px;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .faq-main {
            padding: 0 40px;
          }

          .faq-title {
            font-size: 44px;
          }

          .faq-cta-text {
            padding: 36px 40px;
          }

          .faq-cta-title {
            font-size: 36px;
          }

          .faq-cta-sub {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .faq-br { display: none; }
        }
      `}</style>
    </>
  );
}
