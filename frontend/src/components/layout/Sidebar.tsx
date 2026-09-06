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
    <aside className="w-60 h-[calc(100vh-3.5rem)] bg-[#ede8de] border-r border-[#d6cfc2] fixed top-14 left-0 flex flex-col justify-between p-3.5 z-40">
      <div className="space-y-4">
        {/* Command Station Snippet */}
        <div className="p-3 bg-[#f3efe6] border border-[#d6cfc2] rounded-lg shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-[#ecd6b0] border border-[#dfc599] flex items-center justify-center text-[#8d4f12] shrink-0 font-serif font-bold text-sm">
              🇮🇳
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-[#1b2a41] leading-tight truncate">Cyber Command Mumbai</div>
              <div className="text-[10px] text-[#2c5e43] font-mono font-semibold truncate">HQ-47 // SAHYOG LEO</div>
            </div>
          </div>
        </div>

        {/* Action Button: Create New Trace */}
        <button
          onClick={onNewDossier}
          className="w-full bg-[#1b2a41] hover:bg-[#111e30] text-[#fff8f0] font-semibold text-xs py-2.5 px-3 rounded flex items-center justify-center space-x-1.5 shadow-xs transition-colors tracking-wide"
        >
          <span className="material-symbols-outlined text-[16px]">add_moderator</span>
          <span>NEW TRACE INQUIRY</span>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#797368]">
            OPERATIONAL WORKSPACE
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-[#ded8cd] text-[#1b2a41] font-bold border-l-4 border-[#1b2a41] shadow-xs'
                    : 'text-[#575249] hover:text-[#1b2a41] hover:bg-[#e4dfd3]'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#1b2a41]' : 'text-[#797368]'}`}>
                  {item.icon}
                </span>
                <div className="leading-tight">
                  <div>{item.label}</div>
                  <div className="text-[9px] text-[#797368] font-normal">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Legal Standards & Status */}
      <div className="pt-3 border-t border-[#d6cfc2] space-y-2">
        <div className="p-2.5 bg-[#f3efe6] border border-[#d6cfc2] rounded text-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#3c3933]">
            <span>Sec 65B Certified</span>
            <span className="text-[#2c5e43] font-mono text-[10px]">ACTIVE</span>
          </div>
          <p className="text-[10px] text-[#797368]">Immutable cryptographic hashing applied to all hops.</p>
        </div>

        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-[#797368]">
          <span>NODE: I4C-PROD-01</span>
          <span className="bg-[#dfd8cb] px-1.5 py-0.5 rounded text-[#1b2a41] font-bold">DEFCON-2</span>
        </div>
      </div>
    </aside>
  );
};
