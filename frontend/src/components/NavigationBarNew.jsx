/**
 * NAVIGATION BAR - Migrated to Tailwind CSS
 *
 * Features:
 * - Fixed navbar with logo and CTAs
 * - CSAT banner (results page only)
 * - Progress bar (quiz pages)
 * - Quiz mode toggle (quiz page only)
 * - Responsive design
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DownloadSimple, Phone } from 'phosphor-react';
import ScalerLogo from '../assets/scaler-logo.svg';
import { useProfile } from '../context/UnifiedContext';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

const NavigationBarNew = ({ progress = 0, quizMode = 'grouped', onQuizModeChange }) => {
  const router = useRouter();
  const { resetProfile, evaluationResults } = useProfile();

  const [showCSATBanner, setShowCSATBanner] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const showProgress = router.pathname === '/quiz' || router.pathname === '/goals';
  const showModeToggle = router.pathname === '/quiz';
  const isResultsPage = router.pathname === '/roadmap' || router.pathname === '/results';

  // Scroll direction detection for CSAT banner
  useEffect(() => {
    if (!isResultsPage) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setShowCSATBanner(true);
      } else if (currentScrollY < lastScrollY) {
        setShowCSATBanner(true);
      } else if (currentScrollY > lastScrollY) {
        setShowCSATBanner(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isResultsPage]);

  const handleReEvaluate = () => {
    resetProfile();
    router.push('/quiz');
  };

  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="sticky top-0 z-[1001] overflow-hidden print:relative print:overflow-visible">
      {/* CSAT Banner */}
      {isResultsPage && (
        <button
          className={cn(
            "bg-[#472472] py-3 px-3 flex items-center justify-center relative cursor-pointer border-none w-full transition-all duration-300",
            "hover:bg-[#5a2e8a] active:bg-[#3a1d5e] print:hidden md:py-2 md:px-3",
            showCSATBanner ? "translate-y-0" : "-translate-y-full"
          )}
          data-tally-open="m6XrjY"
          data-tally-layout="modal"
          data-tally-width="600"
          data-tally-emoji-text="👋"
          data-tally-emoji-animation="wave"
        >
          <div className="flex items-center gap-3 max-w-[1200px] w-full justify-center pointer-events-none md:flex-col md:gap-2 md:text-center">
            <span className="text-sm text-white font-medium md:text-[0.8125rem]">
              How was your profile evaluation experience?
            </span>
            <span className="text-sm text-white font-semibold underline md:text-[0.8125rem]">
              Share your feedback
            </span>
          </div>
        </button>
      )}

      {/* Main Navbar */}
      <nav
        className={cn(
          "bg-white shadow-sm relative transition-transform duration-300 print:hidden",
          isResultsPage && showCSATBanner ? "" : isResultsPage ? "-translate-y-[41.5px] md:-translate-y-[60px]" : ""
        )}
      >
        <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between h-[50px] gap-6 md:max-w-full md:w-full md:px-3">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="flex items-center">
              <ScalerLogo aria-label="Scaler" className="h-7 w-auto block md:h-6" />
            </div>
          </Link>

          {/* Quiz Mode Toggle */}
          {showModeToggle && (
            <div className="flex bg-slate-100 rounded-md p-0.5 gap-0.5">
              <button
                onClick={() => onQuizModeChange?.('single')}
                className={cn(
                  "border-none py-1.5 px-3.5 rounded text-xs cursor-pointer transition-all duration-200 whitespace-nowrap",
                  quizMode === 'single'
                    ? "bg-white text-slate-800 font-semibold shadow-sm"
                    : "bg-transparent text-slate-500 font-medium hover:bg-slate-200"
                )}
              >
                Single Question
              </button>
              <button
                onClick={() => onQuizModeChange?.('grouped')}
                className={cn(
                  "border-none py-1.5 px-3.5 rounded text-xs cursor-pointer transition-all duration-200 whitespace-nowrap",
                  quizMode === 'grouped'
                    ? "bg-white text-slate-800 font-semibold shadow-sm"
                    : "bg-transparent text-slate-500 font-medium hover:bg-slate-200"
                )}
              >
                Grouped Questions
              </button>
              <button
                onClick={() => onQuizModeChange?.('split')}
                className={cn(
                  "border-none py-1.5 px-3.5 rounded text-xs cursor-pointer transition-all duration-200 whitespace-nowrap",
                  quizMode === 'split'
                    ? "bg-white text-slate-800 font-semibold shadow-sm"
                    : "bg-transparent text-slate-500 font-medium hover:bg-slate-200"
                )}
              >
                Split View
              </button>
              <button
                onClick={() => onQuizModeChange?.('split-view2')}
                className={cn(
                  "border-none py-1.5 px-3.5 rounded text-xs cursor-pointer transition-all duration-200 whitespace-nowrap",
                  quizMode === 'split-view2'
                    ? "bg-white text-slate-800 font-semibold shadow-sm"
                    : "bg-transparent text-slate-500 font-medium hover:bg-slate-200"
                )}
              >
                Split View 2
              </button>
              <button
                onClick={() => onQuizModeChange?.('final')}
                className={cn(
                  "border-none py-1.5 px-3.5 rounded text-xs cursor-pointer transition-all duration-200 whitespace-nowrap",
                  quizMode === 'final'
                    ? "bg-white text-slate-800 font-semibold shadow-sm"
                    : "bg-transparent text-slate-500 font-medium hover:bg-slate-200"
                )}
              >
                Final Mode
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isResultsPage && evaluationResults && (
              <>
                <button
                  onClick={handleReEvaluate}
                  className="bg-transparent text-slate-500 border-none py-2 px-4 rounded-none font-semibold text-sm cursor-pointer transition-all duration-200 uppercase tracking-wider hover:text-slate-800 hover:bg-slate-50 md:text-xs md:py-1.5 md:px-3"
                >
                  Re-evaluate
                </button>

                {/* Desktop: Full button */}
                <button
                  onClick={handleDownloadReport}
                  className="bg-transparent text-primary border-2 border-primary py-2 px-4 rounded-none font-semibold text-sm cursor-pointer transition-all duration-200 uppercase tracking-wider flex items-center justify-center hover:bg-primary hover:text-white md:hidden"
                >
                  Download Report
                </button>

                {/* Mobile: Icon only */}
                <button
                  onClick={handleDownloadReport}
                  className="hidden bg-transparent text-primary border-2 border-primary p-2 rounded-none cursor-pointer transition-all duration-200 items-center justify-center hover:bg-primary hover:text-white md:flex"
                >
                  <DownloadSimple size={20} weight="bold" />
                </button>
              </>
            )}

            <Button
              onClick={() => window.open('/callback', '_blank')}
              className="md:hidden"
            >
              Request Call Back
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="w-full h-1 bg-slate-200 relative">
            <div
              className="h-full bg-[#0041CA] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavigationBarNew;
