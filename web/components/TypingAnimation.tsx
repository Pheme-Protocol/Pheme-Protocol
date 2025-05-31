import React from 'react';

const TypingAnimation: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 p-2">
      <div className="flex space-x-1">
        <div className="h-4 w-4 bg-primary-light dark:bg-primary-dark rounded-full animate-[bounce_1s_infinite_-0.3s]"></div>
        <div className="h-4 w-4 bg-primary-light dark:bg-primary-dark rounded-full animate-[bounce_1s_infinite_-0.15s]"></div>
        <div className="h-4 w-4 bg-primary-light dark:bg-primary-dark rounded-full animate-[bounce_1s_infinite]"></div>
      </div>
      <span className="text-gray-600 dark:text-gray-300 ml-3 text-base font-medium">
        <i>Pheme is typing</i>
      </span>
    </div>
  );
};

export default TypingAnimation; 