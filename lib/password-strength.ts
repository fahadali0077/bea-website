export const PASSWORD_MIN_LENGTH = 8;

export type PasswordStrength = {
  /** 0 = too short / empty, 1 = weak, 2 = fair, 3 = good, 4 = strong */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
};

/**
 * Lightweight strength estimate for the onboarding meter.
 * This is a UI hint only — the backend enforces the real minimum.
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { score: 0, label: `Min. ${PASSWORD_MIN_LENGTH} characters` };
  }

  let points = 0;
  if (password.length >= 12) points += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points += 1;
  if (/\d/.test(password)) points += 1;
  if (/[^A-Za-z0-9]/.test(password)) points += 1;

  const score = Math.max(1, Math.min(points, 4)) as 1 | 2 | 3 | 4;
  const labels: Record<1 | 2 | 3 | 4, string> = {
    1: "Weak password",
    2: "Fair password",
    3: "Good password",
    4: "Strong password",
  };

  return { score, label: labels[score] };
}