'use client';

import React from 'react';

interface HeaderProps {
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onSearch,
  theme,
  toggleTheme,
}) => {
  return (
    <header className="h-14 px-5 bg-[#f3efe6]/85 dark:bg-[#0e131e]/85 backdrop-blur-md border-b border-[#d6cfc2]/80 dark:border-white/10 fixed top-0 left-0 right-0 z-50 flex items-center justify-between shadow-xs transition-colors duration-200">
      <div className="flex items-center space-x-5">
        {/* Branding */}
        <div className="flex items-center space-x-2.5 cursor-pointer select-none" onClick={() => setActiveTab('intake')}>
          <div className="w-8 h-8 rounded bg-[#B40039] text-[#fff8f0] flex items-center justify-center font-bold text-xs shadow-xs font-mono tracking-wider">
            CW
          </div>
          <div className="leading-none">
            <div className="font-serif font-bold text-base tracking-tight text-[#B40039] dark:text-[#ff4d79] flex items-center gap-1.5">
              CHAINWATCH
              <span className="text-[#8b8579] dark:text-[#64748b] font-normal text-xs font-sans">/</span>
              <span className="font-sans font-bold text-xs tracking-wider text-[#2c5e43] dark:text-[#4ade80]">NCRP-INTEL</span>
            </div>
            <span className="text-[10px] text-[#797368] dark:text-[#94a3b8] font-medium font-sans">National Cyber Forensic Attribution Engine</span>
          </div>
        </div>

        <div className="h-5 w-px bg-[#d6cfc2] dark:bg-white/10"></div>

        {/* Live Sync Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#eae5db]/80 dark:bg-[#161c2b]/80 border border-[#d6cfc2]/80 dark:border-white/10 text-xs text-[#575249] dark:text-[#94a3b8] backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#2c5e43] dark:bg-[#4ade80] status-pulse"></span>
          <span className="font-medium text-[#21201d] dark:text-[#e2e8f0]">NCRP &amp; Sahyog Synced</span>
          <span className="text-[#8b8579] dark:text-[#64748b]">•</span>
          <span className="text-[11px] font-mono text-[#2c5e43] dark:text-[#4ade80] font-semibold">LIVE MEMPOOL</span>
        </div>
      </div>

      {/* Global Search & Action Controls */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-[#797368] dark:text-[#8896ab] text-[16px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            className="bg-[#ece7dc]/80 dark:bg-[#151b28]/80 border border-[#d6cfc2]/80 dark:border-white/10 text-[#21201d] dark:text-[#f1f5f9] font-mono text-xs pl-8 pr-3 py-1.5 rounded w-72 placeholder:text-[#888173] dark:placeholder:text-[#64748b] focus:outline-none focus:border-[#B40039] focus:bg-[#f3efe6] dark:focus:bg-[#1a2234] transition-colors duration-150 shadow-none backdrop-blur-sm"
            placeholder="Search address, tx hash, or FIR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>

        <button
          onClick={() => setActiveTab('intake')}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-[#eae5db]/80 dark:bg-[#161c2b]/80 border border-[#d6cfc2]/80 dark:border-white/10 rounded text-xs font-semibold text-[#21201d] dark:text-[#e2e8f0] hover:bg-[#dfd8cb] dark:hover:bg-[#20293d] active:translate-y-px transition-colors backdrop-blur-sm"
        >
          <span className="material-symbols-outlined text-[15px] text-[#575249] dark:text-[#94a3b8]">swap_horiz</span>
          <span>SWITCH CASE</span>
        </button>

        {/* Theme Toggle Button (Dark / Light) */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#eae5db]/80 dark:bg-[#161c2b]/80 border border-[#d6cfc2]/80 dark:border-white/10 rounded text-xs font-semibold text-[#21201d] dark:text-[#e2e8f0] hover:bg-[#dfd8cb] dark:hover:bg-[#20293d] active:translate-y-px transition-colors backdrop-blur-sm shadow-xs"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="material-symbols-outlined text-[16px] text-[#B40039] dark:text-[#ff4d79]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="text-[10px] font-mono font-bold hidden sm:inline text-[#575249] dark:text-[#cbd5e1]">
            {theme === 'dark' ? 'LIGHT' : 'DARK'}
          </span>
        </button>
      </div>
    </header>
  );
};
