import { useState, useEffect, useRef } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navigation = [
    { name: 'Tokenomics', href: '#', isComingSoon: true },
    { name: 'Roadmap', href: '#', isComingSoon: true },
    { name: 'Whitepaper', href: '#', isComingSoon: true },
    { name: 'DAO Forum', href: '#', isComingSoon: true }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case 'Tab':
          // If shift+tab on first item or tab on last item, close dropdown
          const focusableElements = dropdownRef.current?.querySelectorAll<HTMLElement>('a, button');
          if (!focusableElements?.length) return;
          
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          const activeElement = document.activeElement;

          if (event.shiftKey && activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <nav className="flex items-center gap-4" role="navigation">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <span
              key={item.name}
              className={`text-gray-600 dark:text-gray-300 text-sm font-medium ${
                item.isComingSoon 
                  ? 'cursor-not-allowed opacity-60' 
                  : 'hover:text-gray-900 dark:hover:text-white transition-colors duration-200'
              }`}
              title={item.isComingSoon ? 'Coming Soon' : ''}
            >
              {item.name}
            </span>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed top-16 right-4 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-200 ease-in-out"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(-10px)'
          }}
        >
          <div className="py-1" role="none">
            {navigation.map((item) => (
              <span
                key={item.name}
                className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 ${
                  item.isComingSoon 
                    ? 'cursor-not-allowed opacity-60' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                }`}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                title={item.isComingSoon ? 'Coming Soon' : ''}
              >
                {item.name}
              </span>
            ))}
            <div className="px-4 py-2" role="none">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 