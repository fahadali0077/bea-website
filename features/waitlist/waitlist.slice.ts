import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { apiSlice } from "@/features/api/apiSlice";
import { getApiErrorMessage } from "@/lib/api";
import { persistJoinResult } from "@/lib/waitlist-join-storage";
import {
  buildJoinWaitlistPayload,
  validateWaitlistFormForJoin,
} from "@/lib/waitlist-validation";

import {
  initialWaitlistForm,
  initialWaitlistState,
  type WaitlistFormState,
} from "./waitlist.types";

export const joinWaitlist = createAsyncThunk(
  "waitlist/join",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { waitlist: { form: WaitlistFormState } };
    const { form } = state.waitlist;

    const validationError = validateWaitlistFormForJoin(form);
    if (validationError) {
      return rejectWithValue(validationError);
    }

    try {
      const { user, magicLink } = await dispatch(
        apiSlice.endpoints.joinWaitlist.initiate(buildJoinWaitlistPayload(form)),
      ).unwrap();

      return {
        message: "You're on the waitlist!",
        waitlistPosition: user.waitlistPosition ?? null,
        referralCode: user.referralCode,
        referralLink: `https://datebea.com/link/${user.referralCode}`,
        magicLink,
      };
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "Unable to join waitlist"),
      );
    }
  },
);

const waitlistSlice = createSlice({
  name: "waitlist",
  initialState: initialWaitlistState,
  reducers: {
    updateWaitlistForm(
      state,
      action: PayloadAction<Partial<WaitlistFormState>>,
    ) {
      state.form = { ...state.form, ...action.payload };
    },
    setReferralCode(state, action: PayloadAction<string | null>) {
      state.form.referralCode = action.payload;
    },
    resetWaitlistJoinState(state) {
      state.joinStatus = "idle";
      state.joinError = null;
    },
    resetWaitlistForm(state) {
      state.form = {
        ...initialWaitlistForm,
        referralCode: state.form.referralCode,
      };
    },
    clearWaitlistErrors(state) {
      state.joinError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinWaitlist.pending, (state) => {
        state.joinStatus = "loading";
        state.joinError = null;
      })
      .addCase(joinWaitlist.fulfilled, (state, action) => {
        state.joinStatus = "succeeded";
        state.joinResult = action.payload;
        state.waitlistPosition = action.payload.waitlistPosition;
        persistJoinResult(action.payload);
      })
      .addCase(joinWaitlist.rejected, (state, action) => {
        state.joinStatus = "failed";
        state.joinError = String(action.payload ?? "Unable to join waitlist");
      });
  },
});

export const {
  updateWaitlistForm,
  setReferralCode,
  resetWaitlistJoinState,
  resetWaitlistForm,
  clearWaitlistErrors,
} = waitlistSlice.actions;

export default waitlistSlice.reducer;
