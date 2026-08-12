import Image from 'next/image';

export default function BrandLogo({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  return (
    <Image
      src="/angel-inc-logo.jpg"
      alt="ANGEL INC. — Made in Paradise"
      width={900}
      height={1600}
      priority
      className={`object-contain ${dark ? 'brightness-0 invert' : ''} ${className}`}
    />
  );
}
