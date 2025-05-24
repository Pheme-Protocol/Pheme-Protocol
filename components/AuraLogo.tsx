import Image from 'next/image';

interface AuraLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function AuraLogo({ width = 280, height = 70, className = '' }: AuraLogoProps) {
  return (
    <Image
      src="/aura_logo.svg"
      alt="AURA Logo"
      width={width}
      height={height}
      priority
      className={`w-auto ${className}`}
    />
  );
} 