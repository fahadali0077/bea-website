'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { useRequestMagicLinkMutation } from '@/features/api/apiSlice';
import {
  selectMagicLinkError,
  selectMagicLinkStatus,
} from '@/features/auth/auth.selectors';
import { useAppSelector } from '@/store/hooks';

export function MagicLinkLoginForm() {
  const router = useRouter();
  const [requestMagicLink] = useRequestMagicLinkMutation();
  const magicLinkStatus = useAppSelector(selectMagicLinkStatus);
  const magicLinkError = useAppSelector(selectMagicLinkError);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await requestMagicLink(email.trim().toLowerCase()).unwrap();
    } catch {
    }
  };

  if (magicLinkStatus === 'sent') {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-neutral-900">Check your email</h2>
        <p className="text-sm text-neutral-600">
          We sent a one-time login link to <strong>{email}</strong>. Open that email and click the link to sign in.
        </p>
        <button
          type="button"
          className="self-start text-sm font-semibold text-neutral-900 underline mt-2"
          onClick={() => router.push('/waitlist')}
        >
          Back to waitlist
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      className="rounded-2xl border border-neutral-200 bg-white p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Waitlist Login
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-neutral-900">Sign in with email</h2>
      <p className="mt-2 text-sm text-neutral-600">
        Enter the email you used to join the waitlist. We&apos;ll send you a one-time login link.
      </p>

      <label htmlFor="magic-link-email" className="mt-6 block text-sm font-medium text-neutral-700">
        Email
      </label>
      <input
        id="magic-link-email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@email.com"
        className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none ring-neutral-900 focus:ring-2"
      />

      {magicLinkError ? <p className="mt-3 text-sm text-red-600">{magicLinkError}</p> : null}

      <button
        type="submit"
        disabled={magicLinkStatus === 'loading' || !email.trim()}
        className="mt-6 w-full rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {magicLinkStatus === 'loading' ? 'Sending link\u2026' : 'Email me a login link'}
      </button>
    </form>
  );
}
