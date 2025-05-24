import Image from 'next/image';

interface AuraLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function AuraLogo({ width = 280, height = 70, className = '' }: AuraLogoProps) {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`} 
      style={{ 
        width: width || '100%',
        height: height || 'auto',
        aspectRatio: '4/1',
        minWidth: '120px', // Ensure minimum readable size
        maxWidth: '800px'  // Prevent excessive scaling
      }}
    >
      <Image
        src="/aura_logo.svg"
        alt="AURA - Web3 Chat Platform"
        fill
        priority
        className="object-contain"
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
        quality={95}
        loading="eager"
      />
    </div>
  );
} 