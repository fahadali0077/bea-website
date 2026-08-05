/**
 * Holds the password chosen on the account step until onboarding is completed
 * on the school step.
 *
 * Deliberately in-memory only: a plaintext password must never be written to
 * sessionStorage/localStorage, where it would survive until the tab closes and
 * be readable by any injected script. This module-level value survives client
 * side navigation between onboarding steps but is cleared on a hard refresh,
 * in which case the user is sent back to the account step to re-enter it.
 */

let pendingPassword: string | null = null;

export const setPendingPassword = (password: string) => {
  pendingPassword = password;
};

export const getPendingPassword = () => pendingPassword;

export const clearPendingPassword = () => {
  pendingPassword = null;
};
