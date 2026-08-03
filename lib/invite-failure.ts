/**
 * Maps an invite-validation failure onto what the user should do next.
 *
 * Status codes come from findValidInvite on the backend:
 *   401 token matches no invite (often because a resend rotated it)
 *   403 invite revoked by an admin
 *   409 invite already used — the account exists
 *   410 invite past its expiry
 *
 * Shared by the onboarding entry guard and the verify-email step so both
 * describe the same failure the same way.
 */

export type InviteFailure = {
  title: string;
  body: string;
  /** Rendered as the primary action. */
  action?: { label: string; href: string };
  /** Expired invites are the one case a resend can actually fix. */
  allowResend?: boolean;
};

export function describeInviteFailure(status: number | undefined): InviteFailure {
  switch (status) {
    case 409:
      return {
        title: "This invite has already been used.",
        body: "Your ambassador account is already set up, so there's nothing left to complete here. Log in to pick up where you left off.",
        action: { label: "Log in", href: "/auth/login" },
      };
    case 410:
      return {
        title: "This invite link has expired.",
        body: "Invite links are only valid for a limited time. We can send you a fresh one.",
        allowResend: true,
      };
    case 403:
      return {
        title: "This invite has been revoked.",
        body: "The Bea team withdrew this invitation. Get in touch with them if you think that's a mistake.",
      };
    default:
      return {
        title: "This invite link isn't valid.",
        body: "The link may be incomplete, or it may have been replaced by a newer one. Check your inbox for the most recent invite email.",
      };
  }
}

/** Narrows the RTK base query error shape down to its HTTP status. */
export const getErrorStatus = (error: unknown): number | undefined =>
  (error as { status?: number } | undefined)?.status;
