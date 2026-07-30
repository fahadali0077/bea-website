import { fontSans } from "@/lib/design";
import { WAITLIST_PRIZES_DETAIL } from "@/lib/waitlist-page-content";

export function WaitlistPrizesDesktopRewards() {
  const rewards = WAITLIST_PRIZES_DETAIL.featured.rewards;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: 260,
        top: 384,
        width: 1107,
        height: 396,
        background: "#fdfbf9",
        fontFamily: fontSans,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 22,
          width: 1032,
          display: "flex",
          gap: 24,
        }}
      >
        {rewards.map((r) => (
          <div
            key={r.title}
            style={{
              flex: 1,
              minWidth: 0,
              height: 350,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              padding: 28,
              borderRadius: 16,
              background: "#fffffe",
              border: "1px solid #efe7dd",
              boxShadow: "0 1px 2px rgba(20, 18, 16, 0.04)",
            }}
          >
            <span
              style={{
                alignSelf: "flex-start",
                padding: "5px 13px",
                borderRadius: 999,
                background: "#f3e4d3",
                color: "#9a5a28",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {r.status}
            </span>
            <h3
              style={{
                margin: "22px 0 0",
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: "-0.01em",
                color: "#1a1a1a",
              }}
            >
              {r.title}
            </h3>
            <p
              style={{
                margin: "18px 0 0",
                fontSize: 15,
                lineHeight: 1.5,
                color: "#6f6a64",
              }}
            >
              {r.desc.map((d) => (
                <span key={d} style={{ display: "block" }}>
                  {d}
                </span>
              ))}
            </p>
            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: "#6f6a64" }}>
                {r.cost}
              </span>
              <span
                style={{
                  padding: "11px 26px",
                  borderRadius: 10,
                  background: "#1a1a1a",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {r.cta}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
