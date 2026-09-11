'use client';

import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewDossier: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onNewDossier,
}) => {
  const navItems = [
    { id: 'intake', label: 'Command Center', icon: 'radar', desc: 'Case Queue & Ingestion' },
    { id: 'explorer', label: 'Graph Explorer', icon: 'hub', desc: 'Forensic Flow Canvas' },
    { id: 'dossier', label: 'Evidence Dossier', icon: 'folder_managed', desc: 'Court Legal Reports' },
    { id: 'vasp', label: 'VASP Registry', icon: 'account_balance', desc: 'FIU Exchange Directory' },
  ];

  return (
    <aside className="w-60 h-[calc(100vh-3.5rem)] bg-[#ede8de]/85 dark:bg-[#0d121c]/85 backdrop-blur-md border-r border-[#d6cfc2]/80 dark:border-white/10 fixed top-14 left-0 flex flex-col justify-between p-3.5 z-40 transition-colors duration-200">
      <div className="space-y-4">
        {/* Command Station Snippet */}
        <div className="p-3 bg-[#f3efe6]/80 dark:bg-[#151b28]/80 border border-[#d6cfc2]/80 dark:border-white/10 rounded-lg shadow-xs backdrop-blur-sm">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-[#f5d0d8] dark:bg-[#38101e] border border-[#f0abbb] dark:border-[#5c1c31] flex items-center justify-center text-[#B40039] dark:text-[#ff4d79] shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="2.2" fill="currentColor" />
                <path d="M12 3v4 M12 17v4 M3 12h4 M17 12h4 M5.6 5.6l2.8 2.8 M15.6 15.6l2.8 2.8 M5.6 18.4l2.8-2.8 M15.6 8.4l2.8-2.8" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-[#21201d] dark:text-[#f1f5f9] leading-tight truncate">Cyber Command Mumbai</div>
              <div className="text-[10px] text-[#2c5e43] dark:text-[#4ade80] font-mono font-semibold truncate">HQ-47 // SAHYOG LEO</div>
            </div>
          </div>
        </div>

        {/* Action Button: Create New Trace */}
        <button
          onClick={onNewDossier}
          className="w-full bg-[#B40039] hover:bg-[#8e002c] active:translate-y-px text-[#fff8f0] font-semibold text-xs py-2.5 px-3 rounded flex items-center justify-center space-x-1.5 shadow-xs transition-colors tracking-wide"
        >
          <span className="material-symbols-outlined text-[16px]">add_moderator</span>
          <span>NEW TRACE INQUIRY</span>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#797368] dark:text-[#8896ab]">
            OPERATIONAL WORKSPACE
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-medium transition-colors text-left active:translate-y-px ${
                  isActive
                    ? 'bg-[#ded8cd]/90 dark:bg-[#1f283c]/90 text-[#B40039] dark:text-[#ff4d79] font-bold border-l-4 border-[#B40039] dark:border-[#ff4d79] shadow-xs'
                    : 'text-[#575249] dark:text-[#94a3b8] hover:text-[#B40039] dark:hover:text-[#ff4d79] hover:bg-[#e4dfd3]/80 dark:hover:bg-[#161d2c]/80'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#B40039] dark:text-[#ff4d79]' : 'text-[#797368] dark:text-[#8896ab]'}`}>
                  {item.icon}
                </span>
                <div className="leading-tight">
                  <div>{item.label}</div>
                  <div className="text-[9px] text-[#797368] dark:text-[#8896ab] font-normal">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Legal Standards & Status */}
      <div className="pt-3 border-t border-[#d6cfc2]/80 dark:border-white/10 space-y-2">
        <div className="p-2.5 bg-[#f3efe6]/80 dark:bg-[#151b28]/80 border border-[#d6cfc2]/80 dark:border-white/10 rounded text-xs space-y-1 backdrop-blur-sm">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#3c3933] dark:text-[#cbd5e1]">
            <span>Sec 65B Certified</span>
            <span className="text-[#2c5e43] dark:text-[#4ade80] font-mono text-[10px]">ACTIVE</span>
          </div>
          <p className="text-[10px] text-[#797368] dark:text-[#8896ab]">Immutable cryptographic hashing applied to all hops.</p>
        </div>

        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-[#797368] dark:text-[#8896ab]">
          <span>NODE: I4C-PROD-01</span>
          <span className="bg-[#dfd8cb] dark:bg-[#1f283c] px-1.5 py-0.5 rounded text-[#B40039] dark:text-[#ff4d79] font-bold">DEFCON-2</span>
        </div>
      </div>
    </aside>
  );
};
