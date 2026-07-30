import { Clock, Crown, Sprout } from "lucide-react";

import { WAITLIST_CONFIRMED_CONTENT } from "@/lib/waitlist-page-content";

const PERK_ICONS = {
  early: Sprout,
  time: Clock,
  premium: Crown,
} as const;

export function WaitlistPerkCards() {
  const { perksSubtitle, perks } = WAITLIST_CONFIRMED_CONTENT;

  return (
    <>
      <p className="waitlist-perks-subtitle">{perksSubtitle}</p>
      <div className="waitlist-perk-cards">
        {perks.map((perk) => {
          const Icon = PERK_ICONS[perk.id];
          return (
            <div
              key={perk.id}
              className={
                "waitlist-perk-card" + (perk.active ? " waitlist-perk-card--active" : "")
              }
            >
              <Icon size={22} strokeWidth={1.5} aria-hidden />
              <h4>{perk.title}</h4>
              <p className="waitlist-perk-card-desc">{perk.description}</p>
              <p className="waitlist-perk-card-footer">{perk.footer}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
