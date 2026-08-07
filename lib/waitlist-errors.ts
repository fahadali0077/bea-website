export const WAITING_ROOM_HREF = "/dashboard/rewards";

const ALREADY_ON_WAITLIST = /already on the waitlist/i;

export function isAlreadyOnWaitlistError(message: string | null | undefined): boolean {
  return Boolean(message && ALREADY_ON_WAITLIST.test(message));
}
