'use client';

import React, { useState } from 'react';
import { Complaint } from '../../lib/types/forensics';

interface CommandCenterViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onTraceWallet: (address: string) => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  complaints,
  onSelectComplaint,
  onTraceWallet,
}) => {
  const [quickInput, setQuickInput] = useState('');

  const handleQuickTrace = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onTraceWallet(quickInput.trim());
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner & Quick Ingestion */}
      <div className="bg-[#f3efe6] border border-[#d6cfc2] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d6cfc2] pb-5">
          <div>
            <div className="flex items-center gap-2 text-[#2c5e43] font-mono text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#2c5e43] status-pulse"></span>
              <span>I4C // NATIONAL CYBERCRIME REPORTING PORTAL INTAKE</span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-[#1b2a41] mt-1 tracking-tight">
              Cyber Command Central Operations &amp; Attribution Cockpit
            </h1>
            <p className="text-xs text-[#575249] mt-0.5">
              Automated mempool indexing and exchange wallet clustering for victim complaints registered under 1930 / NCRP.
            </p>
          </div>

        </div>

        {/* Quick Launch Search Form */}
        <form onSubmit={handleQuickTrace} className="mt-5 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#797368] text-[18px]">
              fingerprint
            </span>
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="Paste any suspect wallet (0x..., bc1q..., TR7N...) to unleash automated multi-hop trace..."
              className="w-full bg-[#ece7dc] border border-[#d6cfc2] pl-10 pr-4 py-2.5 rounded-lg font-mono text-xs text-[#21201d] placeholder:text-[#888173] focus:outline-none focus:border-[#1b2a41] focus:bg-[#f3efe6] transition-colors duration-150"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#1b2a41] hover:bg-[#111e30] active:translate-y-px text-[#fff8f0] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-xs shrink-0 tracking-wider uppercase font-mono"
          >
            <span className="material-symbols-outlined text-[16px]">travel_explore</span>
            <span>Execute Trace (Live)</span>
          </button>
        </form>

        {/* Quick Demo & Live Wallet Presets */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => { setQuickInput('0x098b716b8aaf21512996dc57eb0615e2383e2f96'); onTraceWallet('0x098b716b8aaf21512996dc57eb0615e2383e2f96'); }}
            className="px-2 py-1 rounded bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b] border border-[#fca5a5] font-bold transition-colors"
          >
            Lazarus ($624M Ronin Heist)
          </button>
          <button
            type="button"
            onClick={() => { setQuickInput('0x59abf3837fa962d6853b4cc0a19513aa031fd32b'); onTraceWallet('0x59abf3837fa962d6853b4cc0a19513aa031fd32b'); }}
            className="px-2 py-1 rounded bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b] border border-[#fca5a5] font-bold transition-colors"
          >
            FTX Drainer ($400M)
          </button>
          <button
            type="button"
            onClick={() => { setQuickInput('0xda25ee226e534d868f0dd8a459536b03fee9079b'); onTraceWallet('0xda25ee226e534d868f0dd8a459536b03fee9079b'); }}
            className="px-2 py-1 rounded bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b] border border-[#fca5a5] font-bold transition-colors"
          >
            BadgerDAO ($120M)
          </button>
          <button
            type="button"
            onClick={() => { setQuickInput('0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc'); onTraceWallet('0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc'); }}
            className="px-2 py-1 rounded bg-[#fee2e2] hover:bg-[#ded7c8] text-[#9e2a2b] border border-[#fca5a5] transition-colors"
          >
            Tornado Cash (Mixer)
          </button>
          <button
            type="button"
            onClick={() => { setQuickInput('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'); onTraceWallet('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'); }}
            className="px-2 py-1 rounded bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] border border-[#bae6fd] transition-colors"
          >
            Vitalik (Benign)
          </button>
          <button
            type="button"
            onClick={() => { setQuickInput('0x28C6c06298d514Db089934071355E5743bf21d60'); onTraceWallet('0x28C6c06298d514Db089934071355E5743bf21d60'); }}
            className="px-2 py-1 rounded bg-[#ece7dc] hover:bg-[#ded7c8] text-[#1b2a41] border border-[#d6cfc2] transition-colors"
          >
            Binance Hot 14
          </button>
          <button
            type="button"
            onClick={() => { setQuickInput('0x71c56345260170a44ec2b8109d941d3b0790bf7e'); onTraceWallet('0x71c56345260170a44ec2b8109d941d3b0790bf7e'); }}
            className="px-2 py-1 rounded bg-[#ece7dc] hover:bg-[#ded7c8] text-[#2c5e43] border border-[#d6cfc2] transition-colors"
          >
            WazirX FIR (Benchmark)
          </button>
        </div>
      </div>

      {/* Live Ingestion Table */}
      <div className="bg-[#f3efe6] border border-[#d6cfc2] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-lg text-[#1b2a41]">Live NCRP / 1930 Fraud Complaint Queue</h2>
            <p className="text-xs text-[#575249]">
              Real-time feed streaming from state cyber cells and National Cyber Crime Reporting Portal.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-[#575249]">
            <span className="px-2.5 py-1 rounded bg-[#eae5db] border border-[#d6cfc2]">4 Complaints Synced</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#d6cfc2] rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#ece7dc] border-b border-[#d6cfc2] text-[#575249] font-semibold text-[11px]">
                <th className="py-3 px-3.5">COMPLAINT / FIR</th>
                <th className="py-3 px-3.5">COMPLAINANT</th>
                <th className="py-3 px-3.5">SUSPECT WALLET ADDRESS</th>
                <th className="py-3 px-3.5">CHAIN</th>
                <th className="py-3 px-3.5">AMOUNT STOLEN</th>
                <th className="py-3 px-3.5">STATUS</th>
                <th className="py-3 px-3.5">ATTRIBUTED VASP</th>
                <th className="py-3 px-3.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d6cfc2] font-sans">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-[#ece7dc] transition-colors bg-[#f3efe6]">
                  <td className="py-3 px-3.5">
                    <div className="font-bold text-[#1b2a41]">{c.firNumber}</div>
                    <div className="text-[10px] text-[#797368] font-mono">{c.acknowledgementNo}</div>
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="font-medium text-[#21201d]">{c.victimName}</div>
                    <div className="text-[10px] text-[#797368]">{c.policeStation}</div>
                  </td>
                  <td className="py-3 px-3.5 font-mono text-[11px] text-[#21201d]">
                    {c.suspectAddress.slice(0, 8)}...{c.suspectAddress.slice(-6)}
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-[#eae5db] text-[#1b2a41] border border-[#d6cfc2]">
                      {c.chain}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 font-semibold text-[#1b2a41]">{c.amount}</td>
                  <td className="py-3 px-3.5">
                    {c.status === 'ATTRIBUTED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e2ebd9] text-[#214a34] border border-[#bdd6bc] flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2c5e43]"></span>
                        ATTRIBUTED
                      </span>
                    )}
                    {c.status === 'FROZEN' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#dbe8dc] text-[#1e4430] border border-[#2c5e43] flex items-center gap-1 w-fit">
                        <span className="material-symbols-outlined text-[12px]">lock</span>
                        FROZEN
                      </span>
                    )}
                    {c.status === 'TRACING' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#f7eedb] text-[#7d4a13] border border-[#e8d2ab] flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#b58500] animate-ping"></span>
                        TRACING
                      </span>
                    )}
                    {c.status === 'QUEUED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ece7dc] text-[#575249] border border-[#d6cfc2] w-fit">
                        QUEUED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    {c.targetVASP ? (
                      <span className="font-bold text-[#2c5e43] font-serif">{c.targetVASP}</span>
                    ) : (
                      <span className="text-[#8b8579] italic font-mono text-[11px]">Pending Trace...</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button
                      onClick={() => onSelectComplaint(c)}
                      className="px-3 py-1.5 bg-[#1b2a41] text-[#fff8f0] rounded text-xs font-medium hover:bg-[#111e30] active:translate-y-px transition-colors shadow-xs inline-flex items-center gap-1"
                    >
                      <span>Open Trace</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
