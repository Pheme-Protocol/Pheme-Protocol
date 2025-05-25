import Image from 'next/image';

interface AuraLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function AuraLogo({ width = 280, height = 70, className = '' }: AuraLogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/aura_logo.svg"
        alt="AURA Logo"
        width={width}
        height={height}
        priority
      />
    </div>
  );
} 