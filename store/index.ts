import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "@/features/api/apiSlice";
import authReducer from "@/features/auth/auth.slice";
import waitlistReducer from "@/features/waitlist/waitlist.slice";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      waitlist: waitlistReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });

  if (typeof window !== "undefined") {
    browserStore = store;
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
