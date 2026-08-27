import Image from 'next/image';

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className = '', priority = false }: BrandLogoProps) {
  return (
    <span className={`brand-logo ${className}`.trim()} aria-hidden="true">
      <Image
        src="/images/monaco/logo.svg"
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 820px) 156px, 180px"
        unoptimized
        className="brand-logo-image"
      />
    </span>
  );
}
