'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useVerifyMagicLinkMutation } from '@/features/api/apiSlice';
import { selectAuthError, selectAuthStatus } from '@/features/auth/auth.selectors';
import { useAppSelector } from '@/store/hooks';

function VerifyMagicLinkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifyMagicLink] = useVerifyMagicLinkMutation();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const attempted = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token || attempted.current) {
      return;
    }
    attempted.current = true;

    void (async () => {
      try {
        const result = await verifyMagicLink(token).unwrap();
        router.replace(result.user.role === 'AMBASSADOR' ? '/dashboard/ambassador' : '/dashboard');
      } catch {
      }
    })();
  }, [router, searchParams, verifyMagicLink]);

  if (status === 'loading' || status === 'idle') {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="text-lg font-semibold text-neutral-900">Signing you in…</p>
        <p className="mt-2 text-sm text-neutral-500">Please wait while we verify your login link.</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="text-lg font-semibold text-neutral-900">Login link expired</p>
        <p className="mt-2 text-sm text-neutral-500">{error}</p>
        <a
          href="/login"
          className="mt-6 inline-flex rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Request a new link
        </a>
      </main>
    );
  }

  return null;
}

export default function VerifyMagicLinkPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 text-sm text-neutral-500">
          Loading…
        </main>
      }
    >
      <VerifyMagicLinkContent />
    </Suspense>
  );
}
