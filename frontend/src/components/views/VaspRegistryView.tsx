'use client';

import React, { useState } from 'react';
import { ChainType, VASPRegistryEntry } from '../../lib/types/forensics';

interface VaspRegistryViewProps {
  vasps: VASPRegistryEntry[];
  onSelectVasp: (vasp: VASPRegistryEntry) => void;
}

export const VaspRegistryView: React.FC<VaspRegistryViewProps> = ({ vasps, onSelectVasp }) => {
  const [selectedChain, setSelectedChain] = useState<string>('all');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const filteredVasps = vasps.filter((v) => {
    if (selectedChain === 'all') return true;
    return v.chains.includes(selectedChain as ChainType);
  });

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full transition-colors duration-200">
      {/* Header Banner */}
      <div className="bg-[#f3efe6]/85 dark:bg-[#151b28]/85 backdrop-blur-md border border-[#d6cfc2]/80 dark:border-white/10 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d6cfc2]/80 dark:border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[#2c5e43] dark:text-[#4ade80] font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#2c5e43] dark:bg-[#4ade80] status-pulse"></span>
              <span>FINANCIAL INTELLIGENCE UNIT (FIU-IND) // COMPLIANCE DIRECTORY</span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-[#B40039] dark:text-[#ff4d79] mt-1 tracking-tight">
              Virtual Asset Service Provider (VASP) &amp; Exchange Registry
            </h1>
            <p className="text-xs text-[#575249] dark:text-[#94a3b8] mt-0.5">
              Official roster of Indian-registered crypto exchanges bound by PMLA reporting rules with direct SAHYOG compliance links.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded bg-[#e2ebd9] dark:bg-[#142e20] text-[#214a34] dark:text-[#86efac] border border-[#bdd6bc] dark:border-[#235338] font-semibold">
              PMLA SEC-12 COMPLIANT
            </span>
          </div>
        </div>

        {/* Chain Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#797368] dark:text-[#8896ab] font-mono mr-2">FILTER CHAIN:</span>
          {['all', 'ethereum', 'bsc', 'tron', 'bitcoin'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedChain(c)}
              className={`px-3 py-1 rounded font-mono text-xs transition-colors uppercase active:translate-y-px ${
                selectedChain === c
                  ? 'bg-[#B40039] text-[#fff8f0] font-semibold shadow-xs'
                  : 'bg-[#eae5db]/80 dark:bg-[#1a2234]/80 text-[#575249] dark:text-[#94a3b8] hover:bg-[#dfd8cb] dark:hover:bg-[#20293d] border border-[#d6cfc2]/80 dark:border-white/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* VASP Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredVasps.map((v) => (
          <div
            key={v.id}
            className="bg-[#f3efe6]/85 dark:bg-[#151b28]/85 backdrop-blur-md border border-[#d6cfc2]/80 dark:border-white/10 rounded-xl p-5 shadow-xs space-y-4 hover:border-[#B40039] dark:hover:border-[#ff4d79] transition-colors"
          >
            <div className="flex items-start justify-between border-b border-[#d6cfc2]/80 dark:border-white/10 pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-serif text-[#B40039] dark:text-[#ff4d79]">{v.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#e2ebd9] dark:bg-[#142e20] text-[#214a34] dark:text-[#86efac] border border-[#bdd6bc] dark:border-[#235338]">
                    FIU-REGISTERED
                  </span>
                </div>
                <div className="text-xs text-[#575249] dark:text-[#94a3b8] font-medium mt-0.5">{v.legalEntity}</div>
              </div>

              <div className="text-right font-mono text-[11px]">
                <div className="text-[#797368] dark:text-[#8896ab] text-[10px]">FREEZE SLA</div>
                <div className="font-bold text-[#9e2a2b] dark:text-[#f87171]">&lt; {v.freezeSlaHours} Hours</div>
              </div>
            </div>

            {/* Metadata Table */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 p-2.5 rounded border border-[#d6cfc2]/80 dark:border-white/10">
                <div className="text-[10px] text-[#797368] dark:text-[#8896ab] font-mono">REGISTRATION REF</div>
                <div className="font-mono text-[11px] font-semibold text-[#B40039] dark:text-[#ff4d79] truncate mt-0.5">
                  {v.fiuRegNumber}
                </div>
              </div>

              <div className="bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 p-2.5 rounded border border-[#d6cfc2]/80 dark:border-white/10">
                <div className="text-[10px] text-[#797368] dark:text-[#8896ab] font-mono">JURISDICTION</div>
                <div className="font-medium text-[#21201d] dark:text-[#f1f5f9] truncate mt-0.5">{v.jurisdiction}</div>
              </div>

              <div className="bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 p-2.5 rounded border border-[#d6cfc2]/80 dark:border-white/10">
                <div className="text-[10px] text-[#797368] dark:text-[#8896ab] font-mono">NODAL OFFICER</div>
                <div className="font-medium text-[#21201d] dark:text-[#f1f5f9] truncate mt-0.5">{v.nodalOfficer}</div>
                <div className="font-mono text-[10px] text-[#2c5e43] dark:text-[#4ade80] mt-0.5">{v.nodalEmail}</div>
              </div>

              <div className="bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 p-2.5 rounded border border-[#d6cfc2]/80 dark:border-white/10">
                <div className="text-[10px] text-[#797368] dark:text-[#8896ab] font-mono">EMERGENCY LIAISON</div>
                <div className="font-mono text-[11px] font-bold text-[#B40039] dark:text-[#ff4d79] mt-0.5">{v.emergencyPhone}</div>
                <div className="text-[10px] text-[#797368] dark:text-[#8896ab] font-mono mt-0.5">24/7 Sahyog Dispatch</div>
              </div>
            </div>

            {/* Known Hot Wallets */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-mono font-bold text-[#575249] dark:text-[#94a3b8] flex items-center justify-between">
                <span>KNOWN EXCHANGE HOT WALLETS ({v.knownHotWallets.length})</span>
                <span className="text-[10px] text-[#2c5e43] dark:text-[#4ade80]">OSINT / ARKHAM SEEDED</span>
              </div>
              <div className="space-y-1">
                {v.knownHotWallets.map((wallet) => (
                  <div
                    key={wallet}
                    className="flex items-center justify-between bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 px-2.5 py-1.5 rounded border border-[#d6cfc2]/80 dark:border-white/10 font-mono text-[11px] text-[#21201d] dark:text-[#f1f5f9]"
                  >
                    <span className="truncate mr-2">{wallet}</span>
                    <button
                      onClick={() => handleCopy(wallet)}
                      className="text-[#797368] dark:text-[#8896ab] hover:text-[#B40039] dark:hover:text-[#ff4d79] active:translate-y-px shrink-0 text-xs font-sans px-1.5 py-0.5 rounded hover:bg-[#dfd8cb] dark:hover:bg-[#1a2234] transition-colors"
                    >
                      {copiedAddress === wallet ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-2 border-t border-[#d6cfc2]/80 dark:border-white/10 flex items-center justify-between">
              <div className="flex gap-1.5">
                {v.chains.map((chain) => (
                  <span
                    key={chain}
                    className="px-2 py-0.5 rounded bg-[#eae5db]/80 dark:bg-[#1e2638] border border-[#d6cfc2]/80 dark:border-[#2a3449] text-[10px] font-mono font-semibold uppercase text-[#B40039] dark:text-[#ff4d79]"
                  >
                    {chain}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onSelectVasp(v)}
                className="px-3 py-1.5 bg-[#B40039] hover:bg-[#8e002c] text-[#fff8f0] rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Draft Sec 94 Order</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
