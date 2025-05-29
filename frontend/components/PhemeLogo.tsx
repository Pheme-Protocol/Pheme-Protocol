import Image from 'next/image';

interface PhemeLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function PhemeLogo({ width = 38, height = 38, className = '' }: PhemeLogoProps) {
  return (
    <Image
      src="/Pheme_wave.svg"
      alt="PHEME Logo"
      width={width}
      height={height}
      className={className}
      priority
      quality={100}
    />
  );
} 