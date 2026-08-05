import Image from "next/image";

export function Avatar({
  src,
  alt,
  size = 30,
}: {
  src: string;
  alt: string;
  size?: number;
}) {
  return (
    <div
      className="relative rounded-full overflow-hidden border border-neutral-200/70 shadow-sm bg-neutral-100 shrink-0"
      style={{ width: size, height: size }}
    >
      <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-cover" />
    </div>
  );
}
