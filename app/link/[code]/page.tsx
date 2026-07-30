'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { setReferralCode } from '@/features/waitlist/waitlist.slice';
import { useAppDispatch } from '@/store/hooks';

export default function ReferralLinkPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const code = params.code?.trim();
    if (code) {
      dispatch(setReferralCode(code));
    }
    router.replace('/waitlist');
  }, [dispatch, params.code, router]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 text-sm text-neutral-500">
      Preparing your invite…
    </main>
  );
}
