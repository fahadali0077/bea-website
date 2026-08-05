'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import { setReferralCode } from '@/features/waitlist/waitlist.slice';
import { useAppDispatch } from '@/store/hooks';

export function WaitlistReferralInitializer() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      dispatch(setReferralCode(ref.trim()));
    }
  }, [dispatch, searchParams]);

  return null;
}
