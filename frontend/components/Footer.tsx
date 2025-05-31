interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  const sections = {
    build: {
      title: 'Build with PHEME',
      links: [
        { name: 'Docs', href: '', isComingSoon: false, isUnclickable: true },
        { name: 'Integration Guide', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'SDK (Coming Soon)', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'GitHub', href: 'https://github.com/PhemeAI', isComingSoon: false, isUnclickable: false }
      ]
    },
    community: {
      title: 'Community',
      links: [
        { name: 'Join Discord', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'Community Forum', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'Twitter', href: 'https://x.com/phemeai', isComingSoon: false, isUnclickable: false },
        { name: 'Telegram', href: 'https://t.me/phemeai', isComingSoon: false, isUnclickable: false },
        { name: 'Feature Requests', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'Contact Admin', href: 'mailto:admin@phemeai.xyz', isComingSoon: false, isUnclickable: false }
      ]
    },
    governance: {
      title: 'Governance',
      links: [
        { name: 'Active Proposals', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'Vote on Chain', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'Token Transparency', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'Delegate Votes', href: '#', isComingSoon: true, isUnclickable: false }
      ]
    },
    trust: {
      title: 'Trust & Transparency',
      links: [
        { name: 'Audit Reports', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'Chain Status', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'Open Source Licenses', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'Security Disclosure', href: '#', isComingSoon: true, isUnclickable: false }
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Terms of Use', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'Privacy Policy', href: '#', isComingSoon: true, isUnclickable: false },
        { name: 'Cookie Preferences', href: '#', isComingSoon: true, isUnclickable: false }
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
                    {(link.isComingSoon || link.isUnclickable) ? (
                      <span 
                        className="text-gray-400 opacity-60 cursor-not-allowed text-[15px] block"
                        title={link.isComingSoon ? 'Coming Soon' : ''}
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