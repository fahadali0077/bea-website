import type { RootState } from '@/store';

export const selectWaitlistForm = (state: RootState) => state.waitlist.form;
export const selectWaitlistJoinStatus = (state: RootState) => state.waitlist.joinStatus;
export const selectWaitlistJoinError = (state: RootState) => state.waitlist.joinError;
export const selectWaitlistJoinResult = (state: RootState) => state.waitlist.joinResult;
export const selectWaitlistPosition = (state: RootState) => state.waitlist.waitlistPosition;
export const selectReferralCode = (state: RootState) => state.waitlist.form.referralCode;
