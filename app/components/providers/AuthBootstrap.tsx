'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useGetMeQuery } from '@/features/api/apiSlice';
import { selectAuthStatus } from '@/features/auth/auth.selectors';
import { hydrateAuthFromStorage } from '@/features/auth/auth.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type Props = {
  children: React.ReactNode;
  redirectTo?: string;
};

export function AuthBootstrap({ children, redirectTo = '/login' }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector(selectAuthStatus);

  useEffect(() => {
    dispatch(hydrateAuthFromStorage());
  }, [dispatch]);

  const { isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: status === 'authenticated',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(redirectTo);
    }
  }, [redirectTo, router, status]);

  if (status === 'idle' || status === 'loading' || isLoading || isFetching) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 text-center text-sm font-semibold text-neutral-500">
        Loading...
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return <>{children}</>;
}
