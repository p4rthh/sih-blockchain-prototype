'use client';

import React from 'react';

interface HeaderProps {
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onEmergencyFreeze: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onSearch,
  onEmergencyFreeze,
}) => {
  return (
    <header className="h-14 px-5 bg-[#f3efe6] border-b border-[#d6cfc2] fixed top-0 left-0 right-0 z-50 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-5">
        {/* Branding */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('intake')}>
          <div className="w-8 h-8 rounded bg-[#1b2a41] text-[#fff8f0] flex items-center justify-center font-bold text-xs shadow-xs font-mono">
            CW
          </div>
          <div className="leading-none">
            <div className="font-serif font-bold text-base tracking-tight text-[#1b2a41] flex items-center gap-1.5">
              CHAINWATCH
              <span className="text-[#8b8579] font-normal text-xs font-sans">/</span>
              <span className="font-sans font-bold text-xs tracking-wider text-[#2c5e43]">NCRP-INTEL</span>
            </div>
            <span className="text-[10px] text-[#797368] font-medium font-sans">National Cyber Forensic Attribution Engine</span>
          </div>
        </div>

        <div className="h-5 w-px bg-[#d6cfc2]"></div>

        {/* Live Sync Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#eae5db] border border-[#d6cfc2] text-xs text-[#575249]">
          <span className="w-2 h-2 rounded-full bg-[#2c5e43] status-pulse"></span>
          <span className="font-medium text-[#21201d]">NCRP &amp; Sahyog Synced</span>
          <span className="text-[#8b8579]">•</span>
          <span className="text-[11px] font-mono text-[#2c5e43] font-semibold">LIVE MEMPOOL</span>
        </div>
      </div>

      {/* Global Search & Action Controls */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-[#797368] text-[16px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            className="bg-[#ece7dc] border border-[#d6cfc2] text-[#21201d] font-mono text-xs pl-8 pr-3 py-1.5 rounded w-72 placeholder:text-[#888173] focus:outline-none focus:border-[#1b2a41] focus:bg-[#f3efe6] transition-colors duration-150 shadow-none"
            placeholder="Search address, tx hash, or FIR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>

        <button
          onClick={() => setActiveTab('intake')}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#eae5db] border border-[#d6cfc2] rounded text-xs font-semibold text-[#21201d] hover:bg-[#dfd8cb] active:translate-y-px transition-colors"
        >
          <span className="material-symbols-outlined text-[15px] text-[#575249]">swap_horiz</span>
          <span>SWITCH CASE</span>
        </button>

        <button
          onClick={onEmergencyFreeze}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#9e2a2b] text-[#fff8f0] rounded text-xs font-semibold hover:bg-[#832122] active:translate-y-px transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[15px]">gavel</span>
          <span className="tracking-wide uppercase">EMERGENCY FREEZE</span>
        </button>

        <div className="h-5 w-px bg-[#d6cfc2] mx-1"></div>

        {/* LEO Profile */}
        <div className="flex items-center space-x-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-[#1b2a41] text-[#ede8de] border border-[#d6cfc2] flex items-center justify-center font-mono font-bold text-xs">
            RS
          </div>
          <div className="hidden md:block text-left leading-tight">
            <p className="text-xs font-semibold text-[#1b2a41]">Insp. R. Sharma</p>
            <p className="text-[10px] text-[#575249] font-mono">CYBER UNIT 47-B</p>
          </div>
        </div>
      </div>
    </header>
  );
};
