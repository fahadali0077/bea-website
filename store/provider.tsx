'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';

import { makeStore, rehydrateWaitlistForm, type AppStore } from '@/store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    rehydrateWaitlistForm(storeRef.current!);
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
