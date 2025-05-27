interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  const sections = {
    build: {
      title: 'Build with PHEME',
      links: [
        { name: 'Developer Docs', href: '#', isComingSoon: true },
        { name: 'Integration Guide', href: '#', isComingSoon: true },
        { name: 'SDK (Coming Soon)', href: '#', isComingSoon: true },
        { name: 'GitHub', href: 'https://github.com/PhemeAI' }
      ]
    },
    community: {
      title: 'Community',
      links: [
        { name: 'Join Discord', href: '#', isComingSoon: true },
        { name: 'Community Forum', href: '#', isComingSoon: true },
        { name: 'Twitter', href: 'https://x.com/phemeai' },
        { name: 'Telegram', href: 'https://t.me/phemeai' },
        { name: 'Feature Requests', href: '#', isComingSoon: true },
        { name: 'Contact Admin', href: 'mailto:admin@phemeai.xyz' }
      ]
    },
    governance: {
      title: 'Governance',
      links: [
        { name: 'Active Proposals', href: '#', isComingSoon: true },
        { name: 'Vote on Chain', href: '#', isComingSoon: true },
        { name: 'Token Transparency', href: '#', isComingSoon: true },
        { name: 'Delegate Votes', href: '#', isComingSoon: true }
      ]
    },
    trust: {
      title: 'Trust & Transparency',
      links: [
        { name: 'Audit Reports', href: '#', isComingSoon: true },
        { name: 'Chain Status', href: '#', isComingSoon: true },
        { name: 'Open Source Licenses', href: '#', isComingSoon: true },
        { name: 'Security Disclosure', href: '#', isComingSoon: true }
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Terms of Use', href: '#', isComingSoon: true },
        { name: 'Privacy Policy', href: '#', isComingSoon: true },
        { name: 'Cookie Preferences', href: '#', isComingSoon: true }
      ]
    }
  };

  return (
    <footer className={`bg-[#0f172a] py-12 mt-auto ${className}`}>
      <div className="container mx-auto px-4">
        {/* Tagline */}
        <div className="text-center mb-12">
          <p className="text-gray-300 text-lg">
            A Decentralized Skill Verification for the Autonomous Web
          </p>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {Object.values(sections).map((section) => (
            <div key={section.title}>
              <h2 className="text-gray-100 font-semibold mb-4 text-sm tracking-wider uppercase">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.isComingSoon ? (
                      <span 
                        className="text-gray-400 opacity-60 cursor-not-allowed text-[15px] block"
                        title="Coming Soon"
                      >
                        {link.name}
                      </span>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-gray-400 hover:text-blue-300 transition-colors text-[15px] block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PHEME. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 