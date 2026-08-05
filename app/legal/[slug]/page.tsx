import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BubbaFooter } from "@/app/components/bubba/BubbaFooter";
import { BubbaNav } from "@/app/components/bubba/BubbaNav";
import { BUBBA_LEGAL_DOCS, getLegalDoc } from "@/lib/bubba-legal";

import "@/styles/bubba.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BUBBA_LEGAL_DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return { title: "Not found — Bubba" };
  return { title: `${doc.title} — Bubba`, description: doc.intro };
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="bb-page">
      <BubbaNav />

      <main className="bb-main">
        <div className="bb-shell bb-shell--narrow bb-doc">
          <h1 className="bb-display bb-display--md bb-doc-title">{doc.title}</h1>
          <p className="bb-doc-updated">Last updated: {doc.updated}</p>
          <p className="bb-lede" style={{ marginBottom: 32 }}>
            {doc.intro}
          </p>

          {doc.summary ? (
            <section className="bb-doc-summary">
              <h2>{doc.summary.heading}</h2>
              <dl>
                {doc.summary.items.map((item) => (
                  <div key={item.term}>
                    <dt>{item.term}</dt>
                    <dd>{item.detail}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <div className="bb-doc-body">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
                {section.awaitingCopy ? (
                  <div className="bb-doc-placeholder">
                    <p>
                      <strong>Copy needed.</strong> This section is laid out and
                      ready — drop in the approved wording from counsel to
                      publish it.
                    </p>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </main>

      <BubbaFooter showCapture={false} />
    </div>
  );
}
