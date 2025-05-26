import Image from 'next/image';

interface AuraLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function AuraLogo({ width = 38, height = 38, className = '' }: AuraLogoProps) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ 
        width, 
        height,
        transform: 'translateZ(0)'
      }}
    >
      <Image
        src="/Aura_wave.svg"
        alt="PHEME Logo"
        width={width}
        height={height}
        priority
        quality={100}
        className="flex-shrink-0"
        style={{
          transform: 'translateZ(0)'
        }}
        draggable={false}
      />
    </div>
  );
} 