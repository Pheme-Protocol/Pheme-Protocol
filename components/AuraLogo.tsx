import Image from 'next/image';

interface AuraLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function AuraLogo({ width = 280, height = 70, className = '' }: AuraLogoProps) {
  return (
    <div 
      className={`relative ${className}`} 
      style={{ 
        width: width || '100%',
        height: height || 'auto',
        aspectRatio: '4/1'
      }}
    >
      <Image
        src="/aura_logo.svg"
        alt="AURA Logo"
        fill
        priority
        className="object-contain"
        sizes={`(max-width: 640px) ${width}px, ${width}px`}
      />
    </div>
  );
} 