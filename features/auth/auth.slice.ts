import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { apiSlice } from '@/features/api/apiSlice';
import { persistAccessToken, readAccessToken } from '@/lib/api/axios-client';
import { getApiErrorMessage } from '@/lib/api';

import { initialAuthState } from './auth.types';

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    hydrateAuthFromStorage(state) {
      state.accessToken = readAccessToken();
    },
    clearAuthError(state) {
      state.error = null;
      state.magicLinkError = null;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      persistAccessToken(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(apiSlice.endpoints.requestMagicLink.matchPending, (state) => {
        state.magicLinkStatus = 'loading';
        state.magicLinkError = null;
      })
      .addMatcher(apiSlice.endpoints.requestMagicLink.matchFulfilled, (state) => {
        state.magicLinkStatus = 'sent';
      })
      .addMatcher(apiSlice.endpoints.requestMagicLink.matchRejected, (state, action) => {
        state.magicLinkStatus = 'failed';
        state.magicLinkError = getApiErrorMessage(action.payload, 'Unable to send login link');
      })

      .addMatcher(apiSlice.endpoints.verifyMagicLink.matchPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(apiSlice.endpoints.verifyMagicLink.matchFulfilled, (state, action) => {
        state.status = 'authenticated';
        state.accessToken = action.payload.token;
        state.user = action.payload.user;
        persistAccessToken(action.payload.token);
      })
      .addMatcher(apiSlice.endpoints.verifyMagicLink.matchRejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = getApiErrorMessage(action.payload, 'Invalid or expired login link');
      })

      .addMatcher(apiSlice.endpoints.getMe.matchPending, (state) => {
        if (state.status !== 'authenticated') {
          state.status = 'loading';
        }
      })
      .addMatcher(apiSlice.endpoints.getMe.matchFulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
      })
      .addMatcher(apiSlice.endpoints.getMe.matchRejected, (state, action) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.accessToken = null;
        state.error = getApiErrorMessage(action.payload, 'Session expired');
        persistAccessToken(null);
      })

      .addMatcher(apiSlice.endpoints.logout.matchFulfilled, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.accessToken = null;
        state.magicLinkStatus = 'idle';
        state.magicLinkError = null;
        state.error = null;
        persistAccessToken(null);
      })

      .addMatcher(apiSlice.endpoints.completeAmbassadorOnboarding.matchFulfilled, (state, action) => {
        state.status = 'authenticated';
        state.accessToken = action.payload.token;
        state.user = action.payload.user;
        persistAccessToken(action.payload.token);
      });
  },
});

export const { hydrateAuthFromStorage, clearAuthError, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
