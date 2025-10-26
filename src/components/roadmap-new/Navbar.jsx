/**
 * CLEAN NAVBAR for roadmap-new page
 */

import React from 'react';
import Link from 'next/link';
import ScalerLogo from '../../assets/scaler-logo.svg';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[120px]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <ScalerLogo className="h-7 w-auto" />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/quiz" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              RE-EVALUATE
            </Link>
            <button className="hidden lg:block px-6 py-3 bg-primary text-white font-bold text-sm tracking-wider rounded-none hover:bg-primary/90 transition-colors">
              BOOK FREE CAREER CALL
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
