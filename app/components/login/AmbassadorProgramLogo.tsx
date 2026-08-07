import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
};

export function AmbassadorProgramLogo({ size = 48, className = "" }: Props) {
  return (
    <Image
      src="/images/ambassador-logo.png"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      priority
    />
  );
}