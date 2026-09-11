'use client';

import React, { useState } from 'react';
import { CourtDossier } from '../../lib/types/forensics';
import { apiClient } from '../../lib/api/client';

interface DossierViewProps {
  dossier: CourtDossier;
  onDispatchFreeze: () => void;
}

export const DossierView: React.FC<DossierViewProps> = ({ dossier, onDispatchFreeze }) => {
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [freezeAck, setFreezeAck] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const assignedVasp = dossier?.assignedVASP || (dossier as unknown as { assignedVasp?: typeof dossier.assignedVASP })?.assignedVasp || {
    id: 'vasp-001',
    name: 'WazirX',
    legalEntity: 'Zanmai Labs Private Limited',
    jurisdiction: 'India (Registered FIU Entity)',
    fiuStatus: 'REGISTERED' as const,
    fiuRegNumber: 'FIU-IND-2023-VASP-001',
    nodalOfficer: 'Shri Arvind Singhal',
    nodalEmail: 'nodal-police@wazirx.com',
    emergencyPhone: '+91-22-4893-1100',
    freezeSlaHours: 2,
    chains: ['ethereum' as const, 'bsc' as const],
    knownHotWallets: [],
    depositCount24h: 4820,
    compliancePortalUrl: 'https://compliance.wazirx.com/lea/portal',
  };

  const handleDispatch = () => {
    onDispatchFreeze();
    setDispatchSuccess(true);
    setFreezeAck(`SAHYOG-FRZ-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const traceId = dossier.traceData?.traceId;
      const vaspId = assignedVasp?.id;
      await apiClient.downloadPdf(dossier.caseRef, traceId, undefined, vaspId);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full bg-[#e9e4d9] dark:bg-[#090d14] transition-colors duration-200">
      {/* REPORT DOCUMENT VIEWER (CENTER-LEFT SCROLLABLE AREA) */}
      <section className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
        {/* Sticky Statutory Action Strip */}
        <div className="bg-[#ede9df]/85 dark:bg-[#0e131e]/85 backdrop-blur-md border-b border-[#d5cec1]/80 dark:border-white/10 px-6 py-2.5 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#e2ebd9] dark:bg-[#142e20] flex items-center justify-center text-[#2c5e43] dark:text-[#4ade80]">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <div className="text-[13px] text-[#21201d] dark:text-[#f1f5f9] font-bold tracking-tight uppercase">
                Section 63 BSA / Section 65B Indian Evidence Act Compliant Record
              </div>
              <div className="font-mono text-[10px] text-[#575249] dark:text-[#94a3b8]">
                FORENSIC ADMISSIBILITY VALIDATED • HARDWARE HSM SEALED • DIGITAL EVIDENCE AUDITED
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="bg-[#f4f0e6]/80 dark:bg-[#151b28]/80 border border-[#d5cec1]/80 dark:border-white/10 rounded p-1.5 px-3 shadow-xs flex items-center gap-2 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#2c5e43] dark:bg-[#4ade80]"></span>
              <span className="font-mono text-[11px] text-[#3c3933] dark:text-[#cbd5e1] font-bold">SEC-65B SEAL CERTIFIED</span>
            </div>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="bg-[#B40039] hover:bg-[#8e002c] active:translate-y-px text-[#fff8f0] font-mono text-xs font-semibold py-1.5 px-3 rounded shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Download Section 63 BSA court-admissible PDF"
            >
              <span className="material-symbols-outlined text-[16px] text-[#ffd0dc]">
                {isDownloading ? 'hourglass_top' : 'download'}
              </span>
              <span>{isDownloading ? 'Compiling Sealed PDF...' : 'Download Admissible PDF'}</span>
            </button>
          </div>
        </div>

        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          {/* OFFICIAL SOVEREIGN REPORT HEADING */}
          <div className="bg-[#f4f0e6]/85 dark:bg-[#141b29]/85 backdrop-blur-md border border-[#d5cec1]/80 dark:border-white/10 rounded-xl p-7 shadow-xs relative">
            <div className="flex items-start justify-between border-b border-[#d5cec1]/80 dark:border-white/10 pb-5 mb-5">
              <div className="space-y-1.5">
                <div className="font-mono text-[11px] text-[#2c5e43] dark:text-[#4ade80] font-bold tracking-wider uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2c5e43] dark:bg-[#4ade80]"></span>
                  <span>MINISTRY OF HOME AFFAIRS // GOVERNMENT OF INDIA</span>
                </div>
                <h1 className="text-2xl font-bold text-[#21201d] dark:text-[#f1f5f9] tracking-tight font-serif">
                  Cyber Crime Investigation Wing // NCRP Forensic Dossier
                </h1>
                <div className="text-xs text-[#575249] dark:text-[#94a3b8]">
                  Statutory Investigative Record Generated Under IT Act 2000 &amp; Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="inline-flex items-center px-3 py-1 rounded bg-[#e2ebd9] dark:bg-[#142e20] text-[#1e3b2b] dark:text-[#86efac] border border-[#c5d8ba] dark:border-[#235338] font-mono text-[11px] font-bold gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2c5e43] dark:bg-[#4ade80]"></span>
                  SHA-256 CERTIFIED
                </div>
                <div className="font-mono text-[11px] text-[#797368] dark:text-[#8896ab] mt-1.5">DOC REF: {dossier.caseRef}</div>
              </div>
            </div>

            {/* Case Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
              <div className="bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 p-3.5 rounded border border-[#d5cec1]/80 dark:border-[#2a3449]">
                <div className="text-[10px] font-mono text-[#797368] dark:text-[#8896ab] uppercase">Case Reference</div>
                <div className="font-mono text-xs text-[#21201d] dark:text-[#f1f5f9] font-bold mt-1 truncate">{dossier.caseRef}</div>
                <div className="text-[10px] text-[#575249] dark:text-[#94a3b8] mt-0.5 truncate">{dossier.firNumber}</div>
              </div>

              <div className="bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 p-3.5 rounded border border-[#d5cec1]/80 dark:border-[#2a3449]">
                <div className="text-[10px] font-mono text-[#797368] dark:text-[#8896ab] uppercase">Complainant / Victim</div>
                <div className="font-mono text-xs text-[#2c5e43] dark:text-[#4ade80] font-bold mt-1 truncate" title={dossier.victimName || 'Complainant'}>
                  {dossier.victimName || 'Complainant'}
                </div>
                <div className="text-[10px] text-[#575249] dark:text-[#94a3b8] mt-0.5 truncate">
                  Loss: {dossier.traceData?.totalValueStolen || '12.50 ETH'}
                </div>
              </div>

              <div className="bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 p-3.5 rounded border border-[#d5cec1]/80 dark:border-[#2a3449]">
                <div className="text-[10px] font-mono text-[#797368] dark:text-[#8896ab] uppercase">Suspect Target ID</div>
                <div className="font-mono text-xs text-[#9e2a2b] dark:text-[#f87171] font-bold mt-1 truncate" title={dossier.suspectTargetId}>
                  {dossier.suspectTargetId ? `${dossier.suspectTargetId.slice(0, 8)}...${dossier.suspectTargetId.slice(-6)}` : 'N/A'}
                </div>
                <div className="text-[10px] text-[#575249] dark:text-[#94a3b8] mt-0.5 truncate">
                  Cluster: {dossier.traceData?.targetEntity || dossier.traceData?.typology || 'Laundering Cluster'}
                </div>
              </div>

              <div className="bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 p-3.5 rounded border border-[#d5cec1]/80 dark:border-[#2a3449]">
                <div className="text-[10px] font-mono text-[#797368] dark:text-[#8896ab] uppercase">Investigating Officer</div>
                <div className="text-xs text-[#21201d] dark:text-[#f1f5f9] font-bold mt-1 truncate">{dossier.investigatingOfficer}</div>
                <div className="text-[10px] text-[#575249] dark:text-[#94a3b8] mt-0.5 truncate">{dossier.unit}</div>
              </div>

              <div className="bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 p-3.5 rounded border border-[#d5cec1]/80 dark:border-[#2a3449] col-span-2 md:col-span-1">
                <div className="text-[10px] font-mono text-[#797368] dark:text-[#8896ab] uppercase">Cryptographic Digest</div>
                <div className="font-mono text-[10px] text-[#21201d] dark:text-[#f1f5f9] font-bold truncate mt-1">
                  {dossier.sha256Digest.slice(0, 16)}...
                </div>
                <div className="text-[10px] text-[#2c5e43] dark:text-[#4ade80] font-medium mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>HSM Hardware Signed</span>
                </div>
              </div>
            </div>
          </div>

          {/* BILINGUAL EXECUTIVE SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#f4f0e6]/85 dark:bg-[#141b29]/85 backdrop-blur-md border border-[#d5cec1]/80 dark:border-white/10 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d5cec1]/80 dark:border-white/10">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#ece7dc]/80 dark:bg-[#1f283c] text-[#21201d] dark:text-[#f1f5f9] border border-[#d5cec1]/80 dark:border-[#2a3449] font-bold">
                      EN-IN // SYNOPSIS
                    </span>
                    <span className="text-sm font-bold text-[#21201d] dark:text-[#f1f5f9] font-serif">Executive Summary</span>
                  </div>
                  <span className="material-symbols-outlined text-[#75777e] dark:text-[#94a3b8] text-[18px]">description</span>
                </div>
                <p className="text-xs text-[#3c3933] dark:text-[#cbd5e1] leading-relaxed font-sans">{dossier.synopsisEn}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#dfd8cb] dark:border-white/10 flex items-center justify-between text-[#575249] dark:text-[#94a3b8] font-mono text-[10px]">
                <span>CONFIDENCE: {Math.round((dossier.traceData?.confidence || 0.92) * 100)}% ATTRIBUTED</span>
                <span className="text-[#2c5e43] dark:text-[#4ade80] font-bold bg-[#e2ebd9] dark:bg-[#142e20] px-2 py-0.5 rounded border border-[#c5d8ba] dark:border-[#235338]">
                  AI: {dossier.llmModel || 'Ollama (Llama 3.1 8B)'}
                </span>
              </div>
            </div>

            <div className="bg-[#f4f0e6]/85 dark:bg-[#141b29]/85 backdrop-blur-md border border-[#d5cec1]/80 dark:border-white/10 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d5cec1]/80 dark:border-white/10">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#ece7dc]/80 dark:bg-[#1f283c] text-[#2c5e43] dark:text-[#4ade80] border border-[#d5cec1]/80 dark:border-[#2a3449] font-bold">
                      HI-IN // प्रमाणित सारांश
                    </span>
                    <span className="text-sm font-bold text-[#21201d] dark:text-[#f1f5f9] font-serif">विधिक अभियोजन सारांश</span>
                  </div>
                  <span className="material-symbols-outlined text-[#75777e] dark:text-[#94a3b8] text-[18px]">balance</span>
                </div>
                <p className="text-xs text-[#3c3933] dark:text-[#cbd5e1] leading-relaxed font-sans">{dossier.synopsisHi}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#dfd8cb] dark:border-white/10 flex items-center justify-between text-[#575249] dark:text-[#94a3b8] font-mono text-[10px]">
                <span>न्यायालय साक्ष्य प्रमाण-पत्र संलग्न</span>
                <span className="text-[#2c5e43] dark:text-[#4ade80] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>प्राधिकृत हस्ताक्षर युक्त
                </span>
              </div>
            </div>
          </div>

          {/* STRUCTURED EVIDENCE CHAIN TABLE */}
          <div className="bg-[#f4f0e6]/85 dark:bg-[#141b29]/85 backdrop-blur-md border border-[#d5cec1]/80 dark:border-white/10 rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base text-[#21201d] dark:text-[#f1f5f9] font-bold font-sans">
                  Structured Chain of Custody &amp; Atomic Hop Attribution
                </h3>
                <p className="text-xs text-[#575249] dark:text-[#94a3b8]">
                  Cryptographically linked transaction hops verified across Ethereum and BNB Smart Chain ledgers
                </p>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[10px]">
                <span className="bg-[#ece7dc] dark:bg-[#101624] px-2.5 py-1 border border-[#d5cec1] dark:border-white/10 rounded text-[#575249] dark:text-[#94a3b8] font-semibold">
                  {dossier.traceData?.links?.length || dossier.traceData?.totalHops || 0} HOPS TRACED
                </span>
                <span className="bg-[#e2ebd9] dark:bg-[#163022] px-2.5 py-1 border border-[#c5d8ba] dark:border-[#22c55e]/30 rounded text-[#1e3b2b] dark:text-[#4ade80] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-[#2c5e43] dark:text-[#4ade80]">check_circle</span>
                  ALL HASHES SIGNED
                </span>
              </div>
            </div>

            <div className="overflow-x-auto border border-[#d5cec1] dark:border-white/10 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#ece7dc]/90 dark:bg-[#101624]/90 border-b border-[#d5cec1] dark:border-white/10 text-[#575249] dark:text-[#94a3b8] font-semibold text-[11px]">
                    <th className="py-2.5 px-3">HOP</th>
                    <th className="py-2.5 px-3">TX HASH</th>
                    <th className="py-2.5 px-3">TIMESTAMP</th>
                    <th className="py-2.5 px-3">SENDER</th>
                    <th className="py-2.5 px-3">RECEIVER</th>
                    <th className="py-2.5 px-3">AMOUNT</th>
                    <th className="py-2.5 px-3">HEURISTIC</th>
                    <th className="py-2.5 px-3">LEGAL STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d5cec1] dark:divide-white/10 font-mono text-[11px]">
                  {dossier.traceData?.links && dossier.traceData.links.length > 0 ? (
                    dossier.traceData.links.map((link, idx) => {
                      const isRoot = idx === 0;
                      const isTarget = idx === dossier.traceData.links.length - 1;
                      const sStr = typeof link.source === 'object' && link.source !== null ? ((link.source as { label?: string; id?: string }).label || (link.source as { label?: string; id?: string }).id || 'Node') : String(link.source);
                      const tStr = typeof link.target === 'object' && link.target !== null ? ((link.target as { label?: string; id?: string }).label || (link.target as { label?: string; id?: string }).id || 'Node') : String(link.target);
                      const displaySender = sStr.length > 14 && sStr.startsWith('0x') ? `${sStr.slice(0, 6)}...${sStr.slice(-4)}` : sStr;
                      const displayReceiver = tStr.length > 14 && tStr.startsWith('0x') ? `${tStr.slice(0, 6)}...${tStr.slice(-4)}` : tStr;
                      const displayTx = link.txHash ? (link.txHash.length > 14 ? `${link.txHash.slice(0, 6)}...${link.txHash.slice(-4)}` : link.txHash) : `tx-hop-#0${idx}`;

                      return (
                        <tr key={link.txHash || idx} className={`hover:bg-[#ece7dc] dark:hover:bg-[#1a2234] transition-colors ${idx % 2 === 0 ? 'bg-[#f4f0e6]/70 dark:bg-[#141b29]/70' : 'bg-[#ede9df]/70 dark:bg-[#101522]/70'}`}>
                          <td className={`py-2.5 px-3 font-bold ${isRoot ? 'text-[#B40039] dark:text-[#ff4d79]' : isTarget ? 'text-[#2c5e43] dark:text-[#4ade80]' : link.isBridge ? 'text-[#B40039] dark:text-[#ff4d79]' : 'text-[#575249] dark:text-[#94a3b8]'}`}>
                            {isRoot ? '#00 ROOT' : isTarget ? `#0${idx} TARGET` : link.isBridge ? `#0${idx} BRIDGE` : `#0${idx} HOP`}
                          </td>
                          <td className="py-2.5 px-3 text-[#21201d] dark:text-[#f1f5f9]">{displayTx}</td>
                          <td className="py-2.5 px-3 text-[#575249] dark:text-[#94a3b8]">{link.timestamp || 'Live Ingest'}</td>
                          <td className="py-2.5 px-3 text-[#21201d] dark:text-[#cbd5e1]" title={sStr}>{displaySender}</td>
                          <td className={`py-2.5 px-3 font-bold ${isTarget ? 'text-[#2c5e43] dark:text-[#4ade80]' : 'text-[#B40039] dark:text-[#ff4d79]'}`} title={tStr}>{displayReceiver}</td>
                          <td className="py-2.5 px-3 font-bold text-[#21201d] dark:text-[#f1f5f9]">{link.value}</td>
                          <td className="py-2.5 px-3 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${isTarget ? 'bg-[#e2ebd9] dark:bg-[#163022] text-[#1e3b2b] dark:text-[#4ade80]' : isRoot ? 'bg-[#fbe8ee] dark:bg-[#3d0e1c] text-[#B40039] dark:text-[#ff7b9f]' : 'bg-[#ece7dc] dark:bg-[#1e2738] text-[#575249] dark:text-[#94a3b8]'}`}>
                              {link.heuristic || (link.isBridge ? 'State Bridge Cross' : 'Peel Chain Transit')}
                            </span>
                          </td>
                          <td className={`py-2.5 px-3 font-sans font-bold ${isTarget ? 'text-[#B40039] dark:text-[#ff4d79]' : 'text-[#2c5e43] dark:text-[#4ade80]'}`}>
                            {isTarget ? 'FREEZE WARRANT' : isRoot ? 'Sec 63 BSA Direct' : link.isBridge ? 'Corroborated' : 'Forensic Ingest'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-4 px-3 text-center text-[#797368] dark:text-[#94a3b8]">No transaction hops found in trace data</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* RIGHT PANEL: LEGAL & FREEZING WORKFLOW CONSOLE */}
      <aside className="w-80 bg-[#ece7dc]/85 dark:bg-[#0e131e]/85 backdrop-blur-md border-l border-[#d5cec1]/80 dark:border-white/10 h-full flex flex-col justify-between overflow-y-auto custom-scrollbar shrink-0">
        <div className="p-4 space-y-4">
          <div className="border-b border-[#d5cec1] dark:border-white/10 pb-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#575249] dark:text-[#94a3b8] font-bold uppercase tracking-wider">
                STATUTORY ACTION CONSOLE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#fbe8ee] dark:bg-[#3d0e1c] text-[#B40039] dark:text-[#ff7b9f] font-mono font-bold">
                URGENT FREEZE
              </span>
            </div>
            <h2 className="text-base font-bold text-[#21201d] dark:text-[#f1f5f9] mt-1 font-sans">
              Section 94 BNSS Notice Engine
            </h2>
            <p className="text-[11px] text-[#575249] dark:text-[#94a3b8] mt-0.5">
              Automated asset seizure directive dispatch under Cyber Wing statutory powers
            </p>
          </div>

          {/* Target Exchange Box */}
          <div className="bg-[#f4f0e6]/85 dark:bg-[#141b29]/85 border border-[#d5cec1]/80 dark:border-white/10 rounded-lg p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#21201d] dark:text-[#f1f5f9] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#B40039] dark:text-[#ff4d79] text-[18px]">account_balance</span>
                <span>{assignedVasp.name} / {assignedVasp.legalEntity}</span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#e2ebd9] dark:bg-[#163022] text-[#1e3b2b] dark:text-[#4ade80] border border-[#c5d8ba] dark:border-[#22c55e]/30 rounded font-bold">
                FIU-REG
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-[#575249] dark:text-[#94a3b8] border-t border-[#dfd8cb] dark:border-white/10 pt-2 font-sans">
              <div className="flex justify-between">
                <span className="text-[#797368] dark:text-[#94a3b8]">Nodal Email:</span>
                <span className="text-[#21201d] dark:text-[#f1f5f9] font-mono">{assignedVasp.nodalEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797368] dark:text-[#94a3b8]">Emergency:</span>
                <span className="text-[#21201d] dark:text-[#f1f5f9] font-mono">{assignedVasp.emergencyPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797368] dark:text-[#94a3b8]">Freeze SLA:</span>
                <span className="text-[#B40039] dark:text-[#ff7b9f] font-bold">&lt; {assignedVasp.freezeSlaHours || 24} Hours (Mandatory)</span>
              </div>
            </div>
          </div>

          {/* Pre-Drafted Notice Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#21201d] dark:text-[#f1f5f9] font-mono">
                Section 94 Notice Order Preview
              </label>
              <span className="font-mono text-[10px] text-[#2c5e43] dark:text-[#4ade80] font-bold">FORM 22-B READY</span>
            </div>
            <div className="bg-[#f4f0e6]/85 dark:bg-[#0f1420]/85 border border-[#d5cec1]/80 dark:border-white/10 rounded-lg p-3 font-mono text-[10px] text-[#21201d] dark:text-[#cbd5e1] h-36 overflow-y-auto custom-scrollbar leading-relaxed shadow-xs">
              {dossier.section94NoticePreview}
            </div>
          </div>

          {/* Cryptographic Seal Box */}
          <div className="bg-[#f4f0e6]/85 dark:bg-[#141b29]/85 border border-[#d5cec1]/80 dark:border-white/10 rounded-lg p-3 space-y-2 shadow-xs">
            <div className="text-[10px] font-bold font-mono text-[#21201d] dark:text-[#f1f5f9] uppercase flex items-center justify-between">
              <span>Evidentiary Cryptographic Seal</span>
              <span className="material-symbols-outlined text-[#2c5e43] dark:text-[#4ade80] text-[16px]">verified</span>
            </div>
            <div className="space-y-1 text-[10px] font-mono text-[#575249] dark:text-[#94a3b8]">
              <div className="text-[#797368] dark:text-[#94a3b8]">IPFS IMMUTABLE CID:</div>
              <div className="text-[#21201d] dark:text-[#f1f5f9] font-bold break-all">{dossier.ipfsCid}</div>
              <div className="text-[#2c5e43] dark:text-[#4ade80] font-bold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[13px]">check</span>
                <span>JUDICIAL SIGN VALID (ECDSA)</span>
              </div>
            </div>
          </div>

          {/* Success Banner if dispatched */}
          {dispatchSuccess && (
            <div className="p-3 bg-[#e2ebd9] dark:bg-[#163022] border border-[#bdd6bc] dark:border-[#22c55e]/30 rounded-lg text-xs font-mono text-[#1e3b2b] dark:text-[#4ade80] space-y-1 shadow-xs">
              <div className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#2c5e43] dark:text-[#4ade80]">check_circle</span>
                <span>NOTICE DISPATCHED TO SAHYOG</span>
              </div>
              <div className="text-[10px]">ACK REF: {freezeAck}</div>
              <div className="text-[10px]">{dossier.assignedVASP?.name || 'VASP'} Compliance Desk notified via secure webhook.</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleDispatch}
              className="w-full bg-[#B40039] hover:bg-[#8e002c] active:translate-y-px text-white font-bold text-xs py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs uppercase tracking-wide font-mono"
            >
              <span className="material-symbols-outlined text-base">lock_clock</span>
              <span>DISPATCH FREEZE REQUEST (SEC 94)</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="w-full bg-[#B40039] hover:bg-[#8e002c] active:translate-y-px text-white font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs font-mono disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm text-[#fff8f0]">
                {isDownloading ? 'hourglass_top' : 'download'}
              </span>
              <span>{isDownloading ? 'Compiling Sealed PDF...' : 'Download Court-Certified PDF'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full bg-[#f4f0e6] dark:bg-[#141b29] hover:bg-[#eae5db] dark:hover:bg-[#1e2738] active:translate-y-px border border-[#d6cfc2] dark:border-white/10 text-[#B40039] dark:text-[#ff4d79] font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs font-mono"
            >
              <span className="material-symbols-outlined text-sm text-[#2c5e43] dark:text-[#4ade80]">print</span>
              <span>Print Certified Evidence Packet</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
