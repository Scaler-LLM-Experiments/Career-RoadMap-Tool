/**
 * ChatBubble Component - Tailwind CSS version
 * Displays chatbot greeting with user data recall
 */

import React from 'react';
import Image from 'next/image';
import ChatBot from '../../assets/ChatBot.png';

const ChatBubbleNew = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4 mb-12 md:mb-20 animate-fadeIn">
      {/* Bot Avatar */}
      <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
        <Image
          src={ChatBot}
          alt="Chat Bot"
          width={48}
          height={48}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Chat Bubble */}
      <div className="relative flex-1 bg-yellow-50 border-2 border-yellow-300 rounded-none p-5 md:p-6 shadow-sm">
        {/* Triangle pointer (desktop only) */}
        <div className="hidden md:block absolute left-0 top-5 -ml-3.5">
          <div className="absolute w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[14px] border-r-yellow-300"></div>
          <div className="absolute w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-r-[12px] border-r-yellow-50 ml-0.5"></div>
        </div>

        {/* Content */}
        <div className="text-base md:text-base font-semibold text-slate-900 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChatBubbleNew;
