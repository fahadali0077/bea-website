type Props = {
  message?: string | null;
};

export function WaitlistFieldError({ message }: Props) {
  if (!message) {
    return null;
  }

  return <p className="waitlist-field-error">{message}</p>;
}
