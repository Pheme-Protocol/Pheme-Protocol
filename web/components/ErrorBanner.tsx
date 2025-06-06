import React from 'react';

interface ErrorBannerProps {
  message: string;
  isVisible: boolean;
}

export function ErrorBanner({ message, isVisible }: ErrorBannerProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 text-center z-50 animate-fade-in">
      {message}
    </div>
  );
} 