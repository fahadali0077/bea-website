'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Props = {
  href?: string;
  label: string;
  onContinue?: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

export function WaitlistContinueButton({
  href,
  label,
  onContinue,
  loading = false,
  disabled = false,
  type = 'button',
}: Props) {
  const content = (
    <>
      <span>{loading ? 'Please wait…' : label}</span>
      <ArrowRight size={21} strokeWidth={2} aria-hidden="true" style={{position:"absolute", right: "24px"}} />
    </>
  );

  if (href && !onContinue) {
    return (
      <Link href={href} className="waitlist-btn-primary" style={{position: "relative"}}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className="waitlist-btn-primary"
      disabled={disabled || loading}
      onClick={() => {
        if (onContinue) {
          void onContinue();
        }
      }}
    >
      {content}
    </button>
  );
}
