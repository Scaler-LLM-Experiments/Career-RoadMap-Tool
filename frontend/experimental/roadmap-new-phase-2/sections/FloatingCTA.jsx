/**
 * FLOATING CTA BUTTON
 * Fixed button at bottom for career consultation booking
 */

import React from 'react';
import { Phone } from 'phosphor-react';

const FloatingCTA = () => {
  return (
    <button
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#B30158] hover:bg-[#8A0145] text-white font-bold py-3 px-6 rounded-none transition-all duration-200 z-50 uppercase tracking-wide text-sm flex items-center gap-2.5"
      style={{
        boxShadow: '0 4px 14px 0 rgba(179, 1, 88, 0.39)'
      }}
      onClick={() => window.open('/callback', '_blank')}
    >
      <Phone size={20} weight="fill" className="flex-shrink-0" />
      <span className="whitespace-nowrap">Book a Free Career Call</span>
    </button>
  );
};

export default FloatingCTA;
