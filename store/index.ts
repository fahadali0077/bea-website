import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "@/features/api/apiSlice";
import authReducer from "@/features/auth/auth.slice";
import waitlistReducer from "@/features/waitlist/waitlist.slice";
import { initialWaitlistForm } from "@/features/waitlist/waitlist.types";

const WAITLIST_FORM_STORAGE_KEY = "waitlist_form";

function readPersistedWaitlistForm() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(WAITLIST_FORM_STORAGE_KEY);
    if (!raw) return undefined;
    return { ...initialWaitlistForm, ...JSON.parse(raw) };
  } catch {
    return undefined;
  }
}

export const makeStore = () => {
  const persistedForm = readPersistedWaitlistForm();

  const store = configureStore({
    reducer: {
      auth: authReducer,
      waitlist: waitlistReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== "production",
    preloadedState: persistedForm
      ? {
          waitlist: {
            form: persistedForm,
            joinStatus: "idle",
            joinError: null,
            joinResult: null,
            waitlistPosition: null,
          },
        }
      : undefined,
  });

  if (typeof window !== "undefined") {
    browserStore = store;

    let previousForm = store.getState().waitlist.form;
    store.subscribe(() => {
      const currentForm = store.getState().waitlist.form;
      if (currentForm !== previousForm) {
        previousForm = currentForm;
        try {
          sessionStorage.setItem(WAITLIST_FORM_STORAGE_KEY, JSON.stringify(currentForm));
        } catch {
          // Storage can fail (private browsing, quota) — losing persistence
          // here just means a refresh mid-flow won't be remembered, which is
          // the pre-existing behavior, so it's safe to swallow.
        }
      }
    });
  }

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

let browserStore: AppStore | undefined;

export function getBrowserStore(): AppStore {
  if (!browserStore) {
    throw new Error("Redux store is not initialized yet — call this only from client-side code after mount.");
  }
  return browserStore;
}