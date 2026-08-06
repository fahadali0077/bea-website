import Link from "next/link";
import { ChevronRight, Gift, MessageSquare, Users } from "lucide-react";

import { BUBBA_WAITING_ROOM } from "@/lib/bubba-content";

const ICONS = {
  prompt: MessageSquare,
  compete: Users,
  prizes: Gift,
} as const;

/**
 * The Waiting Room announcement card — gold panel, undated headline, three
 * benefits. Replaces the earlier "One prompt. Every campus." treatment.
 */
export function WaitingRoomSection() {
  const wr = BUBBA_WAITING_ROOM;

  return (
    <section className="bb-wr" id="waiting-room">
      <div className="bb-shell">
        <div className="bb-wr-card">
          <p className="bb-wr-month">{wr.month}</p>
          <p className="bb-display bb-wr-day">{wr.day}</p>

          <p className="bb-wr-note">{wr.note}</p>

          <h2 className="bb-display bb-wr-title">{wr.title}</h2>
          <p className="bb-wr-lede">{wr.lede}</p>

          <ul className="bb-wr-items">
            {wr.items.map((item) => {
              const Icon = ICONS[item.key];
              return (
                <li key={item.key} className="bb-wr-item">
                  <span className="bb-wr-item-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.7} />
                  </span>
                  <div>
                    <p className="bb-wr-item-title">{item.title}</p>
                    <p className="bb-wr-item-body">{item.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="bb-wr-footnote">{wr.footnote}</p>

          <Link href={wr.cta.href} className="bb-wr-cta">
            {wr.cta.label}
            <ChevronRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
