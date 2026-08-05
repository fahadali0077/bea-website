import { Instagram, MessageCircle } from "lucide-react";

function WhatsappIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5.1 5.2-1.4A10 10 0 1 0 12 2z" />
      <path d="M9.5 9.5c.3 1.6 1.8 3.8 4 4.8 1 .5 1.8.6 2.4.5l1-1.1c.2-.2.1-.5-.1-.7l-1.2-1c-.2-.2-.5-.2-.7 0l-.8.7c-.1.1-.3.1-.5 0-1-.4-2.2-1.6-2.5-2.4-.1-.2 0-.4.1-.5l.7-.8c.2-.2.2-.5 0-.7l-1-1.2c-.2-.2-.5-.3-.7-.1l-1.1 1c-.2.5-.1 1.3.4 2.3z" />
    </svg>
  );
}

const SHARE_LINKS = [
  { label: "Instagram", Icon: Instagram },
  { label: "Messages", Icon: MessageCircle },
  { label: "Whatsapp", Icon: WhatsappIcon },
] as const;

export function WaitlistShareIcons() {
  return (
    <div className="waitlist-share-icons">
      {SHARE_LINKS.map(({ label, Icon }) => (
        <button key={label} type="button" className="waitlist-share-icon">
          <span className="waitlist-share-icon-circle">
            <Icon size={22} strokeWidth={1.5} aria-hidden />
          </span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
