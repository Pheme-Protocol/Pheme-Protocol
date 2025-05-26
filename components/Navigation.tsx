import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: 'Docs', href: 'https://docs.pheme.app' },
    { name: 'Blog', href: '/blog' },
    { name: 'Whitepaper', href: 'https://pheme.app/whitepaper' },
    { name: 'DAO Forum', href: 'https://forum.pheme.app' }
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

  const handleSelect = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <nav className="flex items-center gap-4 relative">
      <ThemeToggle />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-300 hover:scale-110 group relative z-50"
        aria-label="Toggle navigation menu"
      >
        <Menu className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} group-hover:rotate-180`} />
      </button>

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={`absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 min-w-[200px] transform transition-all duration-300 origin-top-right z-50 ${
          isOpen 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {navigation.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:pl-6 hover:text-primary-light dark:hover:text-primary-dark"
            onClick={() => setIsOpen(false)}
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
} 