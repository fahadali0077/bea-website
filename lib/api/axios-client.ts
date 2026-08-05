import axios, { type AxiosError } from 'axios';

import type { ApiErrorBody } from './types';

const ACCESS_TOKEN_KEY = 'bea_access_token';
const CSRF_COOKIE_KEY = 'bea_csrf';

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000').replace(
  /\/$/,
  '',
);

export const apiClient = axios.create({
  baseURL: `${API_ROOT}/api`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === 'undefined') {
    return config;
  }

  const cookies = document.cookie.split('; ');
  let token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) {
    const cookieToken = cookies
      .find((row) => row.startsWith('bea_admin_token='))
      ?.split('=')[1];
    if (cookieToken) {
      token = decodeURIComponent(cookieToken);
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const method = config.method?.toUpperCase();
  if (method && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const csrfToken = cookies
      .find((row) => row.startsWith(`${CSRF_COOKIE_KEY}=`))
      ?.split('=')[1];
    if (csrfToken) {
      config.headers['x-csrf-token'] = decodeURIComponent(csrfToken);
    }
  }

  return config;
});

apiClient.interceptors.response.use((response) => {
  const body = response.data as { success?: boolean; data?: unknown } | null;
  if (body && typeof body === 'object' && body.success === true && 'data' in body && body.data != null) {
    response.data = body.data;
  }
  return response;
});

export function persistAccessToken(token: string | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function readAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const message = axiosError.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    return axiosError.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return fallback;
}
