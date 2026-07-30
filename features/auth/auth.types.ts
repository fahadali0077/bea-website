import type { ApiUser } from '@/lib/api/types';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: ApiUser | null;
  accessToken: string | null;
  status: AuthStatus;
  error: string | null;
  magicLinkStatus: 'idle' | 'loading' | 'sent' | 'failed';
  magicLinkError: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
  magicLinkStatus: 'idle',
  magicLinkError: null,
};
