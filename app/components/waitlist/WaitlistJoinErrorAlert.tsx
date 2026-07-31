import Link from "next/link";

const ALREADY_ON_WAITLIST_MESSAGE = "This email is already on the waitlist.";

export function WaitlistJoinErrorAlert({ message }: { message: string }) {
  const isAlreadyOnWaitlist = message === ALREADY_ON_WAITLIST_MESSAGE;

  return (
    <div className="waitlist-inline-alert">
      <p className="waitlist-inline-alert-body">{message}</p>
      {isAlreadyOnWaitlist && (
        <Link href="/auth/login" className="waitlist-inline-alert-cta">
          Log in instead
        </Link>
      )}
    </div>
  );
}