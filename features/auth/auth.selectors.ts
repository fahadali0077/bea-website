import type { RootState } from '@/store';

export const selectAuthState = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectIsAuthenticated = (state: RootState) => state.auth.status === 'authenticated';
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectMagicLinkStatus = (state: RootState) => state.auth.magicLinkStatus;
export const selectMagicLinkError = (state: RootState) => state.auth.magicLinkError;
