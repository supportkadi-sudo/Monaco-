import Image from 'next/image';

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = '', priority = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`.trim()} aria-hidden="true">
      <Image
        src="/images/monaco/logo.webp"
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 820px) 156px, 180px"
        className="brand-logo-image"
      />
    </span>
  );
}
