import { useState, useEffect, useRef } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAccount } from 'wagmi';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isConnected, address } = useAccount();

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
          {isConnected && address && (
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Connected: {address.slice(0, 2)}...{address.slice(-4)}
            </span>
          )}
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <button
            ref={buttonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
          >
            <MenuIcon className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Dropdown Menu */}
          <div
            id="mobile-menu"
            ref={dropdownRef}
            className={`absolute right-4 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="mobile-menu-button"
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
              {isConnected && address && (
                <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  Connected: {address.slice(0, 2)}...{address.slice(-4)}
                </span>
              )}
              <div className="px-4 py-2" role="none">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
} 