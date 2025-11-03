/**
 * SIDEBAR NAVIGATION - Sticky sidebar with section links
 */

import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import ChatBotIcon from '../../assets/ChatBot.png';
import Image from 'next/image';

const Sidebar = ({ activeSection, onSectionChange, onOpenChat }) => {
  const [isSticky, setIsSticky] = useState(false);

  const sections = [
    { id: 'skills', label: 'Your Current Level' },
    { id: 'companies', label: 'Company Insights' },
    { id: 'learning', label: 'Learning Path' },
    { id: 'projects', label: 'Project Ideas' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the hero section (roughly 400px)
      setIsSticky(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);

    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64; // Height of sticky navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 24;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 flex flex-col" style={{ minHeight: 'calc(100vh - 6rem)' }}>
        {/* Top Section - Navigation */}
        <div className="flex-shrink-0">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
            Your Roadmap
          </h3>
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={cn(
                  "block w-full text-left py-2 px-4 text-sm border-l-2 transition-colors",
                  activeSection === section.id
                    ? "text-slate-900 border-slate-900 bg-slate-50 font-extrabold"
                    : "text-slate-600 hover:text-slate-900 border-transparent hover:border-slate-300 font-medium"
                )}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Section - Ask Aditi (Only show when sticky) */}
        {isSticky && (
          <div className="mt-auto pt-6 pb-8">
            {/* Divider */}
            <div className="mb-6 border-t border-slate-200"></div>

            {/* Ask Aditi Section */}
            <div className="space-y-3">
              <p className="text-xs text-slate-600 px-4">
                If you have any questions
              </p>
              <button
                onClick={onOpenChat}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 transition-all rounded-sm"
              >
                <Image src={ChatBotIcon} alt="Chat" width={18} height={18} className="flex-shrink-0" />
                <span>Ask Aditi (AI)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
