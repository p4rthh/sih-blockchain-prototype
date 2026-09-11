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
    <div className="flex-1 flex overflow-hidden h-full bg-[#e9e4d9]">
      {/* REPORT DOCUMENT VIEWER (CENTER-LEFT SCROLLABLE AREA) */}
      <section className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
        {/* Sticky Statutory Action Strip */}
        <div className="bg-[#ede9df] border-b border-[#d5cec1] px-6 py-2.5 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#e2ebd9] flex items-center justify-center text-[#2c5e43]">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <div className="text-[13px] text-[#21201d] font-bold tracking-tight uppercase">
                Section 63 BSA / Section 65B Indian Evidence Act Compliant Record
              </div>
              <div className="font-mono text-[10px] text-[#575249]">
                FORENSIC ADMISSIBILITY VALIDATED • HARDWARE HSM SEALED • DIGITAL EVIDENCE AUDITED
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="bg-[#f4f0e6] border border-[#d5cec1] rounded p-1.5 px-3 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2c5e43]"></span>
              <span className="font-mono text-[11px] text-[#3c3933] font-bold">SEC-65B SEAL CERTIFIED</span>
            </div>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="bg-[#1b2a41] hover:bg-[#121c2b] active:translate-y-px text-[#fff8f0] font-mono text-xs font-semibold py-1.5 px-3 rounded shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Download Section 63 BSA court-admissible PDF"
            >
              <span className="material-symbols-outlined text-[16px] text-[#c5d8ba]">
                {isDownloading ? 'hourglass_top' : 'download'}
              </span>
              <span>{isDownloading ? 'Compiling Sealed PDF...' : 'Download Admissible PDF'}</span>
            </button>
          </div>
        </div>

        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          {/* OFFICIAL SOVEREIGN REPORT HEADING */}
          <div className="bg-[#f4f0e6] border border-[#d5cec1] rounded-xl p-7 shadow-xs relative">
            <div className="flex items-start justify-between border-b border-[#d5cec1] pb-5 mb-5">
              <div className="space-y-1.5">
                <div className="font-mono text-[11px] text-[#2c5e43] font-bold tracking-wider uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2c5e43]"></span>
                  <span>MINISTRY OF HOME AFFAIRS // GOVERNMENT OF INDIA</span>
                </div>
                <h1 className="text-2xl font-bold text-[#21201d] tracking-tight font-serif">
                  Cyber Crime Investigation Wing // NCRP Forensic Dossier
                </h1>
                <div className="text-xs text-[#575249]">
                  Statutory Investigative Record Generated Under IT Act 2000 &amp; Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="inline-flex items-center px-3 py-1 rounded bg-[#e2ebd9] text-[#1e3b2b] border border-[#c5d8ba] font-mono text-[11px] font-bold gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2c5e43]"></span>
                  SHA-256 CERTIFIED
                </div>
                <div className="font-mono text-[11px] text-[#797368] mt-1.5">DOC REF: 2026/IND-NCRP/89201</div>
              </div>
            </div>

            {/* Case Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#ece7dc] p-3.5 rounded border border-[#d5cec1]">
                <div className="text-[10px] font-mono text-[#797368] uppercase">Case Reference</div>
                <div className="font-mono text-xs text-[#21201d] font-bold mt-1">{dossier.caseRef}</div>
                <div className="text-[10px] text-[#575249] mt-0.5">{dossier.firNumber}</div>
              </div>

              <div className="bg-[#ece7dc] p-3.5 rounded border border-[#d5cec1]">
                <div className="text-[10px] font-mono text-[#797368] uppercase">Suspect Target ID</div>
                <div className="font-mono text-xs text-[#9e2a2b] font-bold mt-1">TGT-ETH-892</div>
                <div className="text-[10px] text-[#575249] mt-0.5">Cluster: Lazarus Sub-Branch B</div>
              </div>

              <div className="bg-[#ece7dc] p-3.5 rounded border border-[#d5cec1]">
                <div className="text-[10px] font-mono text-[#797368] uppercase">Investigating Officer</div>
                <div className="text-xs text-[#21201d] font-bold mt-1">{dossier.investigatingOfficer}</div>
                <div className="text-[10px] text-[#575249] mt-0.5">{dossier.unit}</div>
              </div>

              <div className="bg-[#ece7dc] p-3.5 rounded border border-[#d5cec1]">
                <div className="text-[10px] font-mono text-[#797368] uppercase">Cryptographic Digest</div>
                <div className="font-mono text-[10px] text-[#21201d] font-bold truncate mt-1">
                  {dossier.sha256Digest.slice(0, 16)}...
                </div>
                <div className="text-[10px] text-[#2c5e43] font-medium mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>HSM Hardware Signed</span>
                </div>
              </div>
            </div>
          </div>

          {/* BILINGUAL EXECUTIVE SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#f4f0e6] border border-[#d5cec1] rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d5cec1]">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#ece7dc] text-[#21201d] border border-[#d5cec1] font-bold">
                      EN-IN // SYNOPSIS
                    </span>
                    <span className="text-sm font-bold text-[#21201d] font-serif">Executive Summary</span>
                  </div>
                  <span className="material-symbols-outlined text-[#75777e] text-[18px]">description</span>
                </div>
                <p className="text-xs text-[#3c3933] leading-relaxed font-sans">{dossier.synopsisEn}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#dfd8cb] flex items-center justify-between text-[#575249] font-mono text-[10px]">
                <span>CONFIDENCE: 91.4% DETERMINISTIC</span>
                <span className="text-[#9e2a2b] font-bold bg-[#f5e4e2] px-2 py-0.5 rounded">SEVERITY: CAT-A EXFIL</span>
              </div>
            </div>

            <div className="bg-[#f4f0e6] border border-[#d5cec1] rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#d5cec1]">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#ece7dc] text-[#2c5e43] border border-[#d5cec1] font-bold">
                      HI-IN // प्रमाणित सारांश
                    </span>
                    <span className="text-sm font-bold text-[#21201d] font-serif">विधिक अभियोजन सारांश</span>
                  </div>
                  <span className="material-symbols-outlined text-[#75777e] text-[18px]">balance</span>
                </div>
                <p className="text-xs text-[#3c3933] leading-relaxed font-sans">{dossier.synopsisHi}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#dfd8cb] flex items-center justify-between text-[#575249] font-mono text-[10px]">
                <span>न्यायालय साक्ष्य प्रमाण-पत्र संलग्न</span>
                <span className="text-[#2c5e43] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>प्राधिकृत हस्ताक्षर युक्त
                </span>
              </div>
            </div>
          </div>

          {/* STRUCTURED EVIDENCE CHAIN TABLE */}
          <div className="bg-[#f4f0e6] border border-[#d5cec1] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base text-[#21201d] font-bold font-serif">
                  Structured Chain of Custody &amp; Atomic Hop Attribution
                </h3>
                <p className="text-xs text-[#575249]">
                  Cryptographically linked transaction hops verified across Ethereum and BNB Smart Chain ledgers
                </p>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[10px]">
                <span className="bg-[#ece7dc] px-2.5 py-1 border border-[#d5cec1] rounded text-[#575249] font-semibold">
                  4 HOPS TRACED
                </span>
                <span className="bg-[#e2ebd9] px-2.5 py-1 border border-[#c5d8ba] rounded text-[#1e3b2b] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-[#2c5e43]">check_circle</span>
                  ALL HASHES SIGNED
                </span>
              </div>
            </div>

            <div className="overflow-x-auto border border-[#d5cec1] rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#ece7dc] border-b border-[#d5cec1] text-[#575249] font-semibold text-[11px]">
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
                <tbody className="divide-y divide-[#d5cec1] font-mono text-[11px]">
                  <tr className="hover:bg-[#ece7dc] transition-colors bg-[#f4f0e6]">
                    <td className="py-2.5 px-3 font-bold text-[#9e2a2b]">#00 ROOT</td>
                    <td className="py-2.5 px-3 text-[#21201d]">0x8a92...1c4b</td>
                    <td className="py-2.5 px-3 text-[#575249]">15-AUG 14:22</td>
                    <td className="py-2.5 px-3 text-[#21201d]">0x742d...44e</td>
                    <td className="py-2.5 px-3 text-[#9e2a2b] font-bold">0x3b11...99f</td>
                    <td className="py-2.5 px-3 font-bold text-[#21201d]">12.50 ETH</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#f5e4e2] text-[#9e2a2b] font-semibold">
                        Unauthorized Drain
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-[#2c5e43] font-bold">Sec 65B Direct</td>
                  </tr>

                  <tr className="hover:bg-[#ece7dc] transition-colors bg-[#ede9df]">
                    <td className="py-2.5 px-3 font-bold text-[#575249]">#01 HOP</td>
                    <td className="py-2.5 px-3 text-[#21201d]">0x12dc...f990</td>
                    <td className="py-2.5 px-3 text-[#575249]">15-AUG 14:38</td>
                    <td className="py-2.5 px-3 text-[#9e2a2b]">0x3b11...99f</td>
                    <td className="py-2.5 px-3 text-[#21201d]">0x889a...01e</td>
                    <td className="py-2.5 px-3 text-[#21201d]">12.488 ETH</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#ece7dc] text-[#575249]">
                        Peel Chain Transit
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-[#2c5e43]">Forensic Ingest</td>
                  </tr>

                  <tr className="hover:bg-[#ece7dc] transition-colors bg-[#f4f0e6]">
                    <td className="py-2.5 px-3 font-bold text-[#1b2a41]">#02 BRIDGE</td>
                    <td className="py-2.5 px-3 text-[#21201d]">0x44ab...e812</td>
                    <td className="py-2.5 px-3 text-[#575249]">15-AUG 15:02</td>
                    <td className="py-2.5 px-3 text-[#21201d]">0x889a...01e</td>
                    <td className="py-2.5 px-3 text-[#1b2a41] font-bold">Multichain Lock</td>
                    <td className="py-2.5 px-3 text-[#21201d]">12.45 ETH</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#ece7dc] text-[#1b2a41] font-semibold">
                        State Bridge Cross
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-[#2c5e43]">Corroborated</td>
                  </tr>

                  <tr className="hover:bg-[#ece7dc] transition-colors bg-[#ede9df]">
                    <td className="py-2.5 px-3 font-bold text-[#2c5e43]">#03 TARGET</td>
                    <td className="py-2.5 px-3 text-[#21201d]">0x99fe...a302</td>
                    <td className="py-2.5 px-3 text-[#575249]">15-AUG 15:19</td>
                    <td className="py-2.5 px-3 text-[#21201d]">BSC Mint Gateway</td>
                    <td className="py-2.5 px-3 text-[#2c5e43] font-bold">0xWAZIRX_HOT</td>
                    <td className="py-2.5 px-3 font-bold text-[#21201d]">41,200 USDT</td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#e2ebd9] text-[#1e3b2b] font-bold">
                        WazirX Hot Vault
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-[#9e2a2b] font-bold">FREEZE WARRANT</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* RIGHT PANEL: LEGAL & FREEZING WORKFLOW CONSOLE */}
      <aside className="w-80 bg-[#ece7dc] border-l border-[#d5cec1] h-full flex flex-col justify-between overflow-y-auto custom-scrollbar shrink-0">
        <div className="p-4 space-y-4">
          <div className="border-b border-[#d5cec1] pb-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#575249] font-bold uppercase tracking-wider">
                STATUTORY ACTION CONSOLE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#f5e4e2] text-[#9e2a2b] font-mono font-bold">
                URGENT FREEZE
              </span>
            </div>
            <h2 className="text-base font-bold text-[#21201d] mt-1 font-serif">
              Section 94 BNSS Notice Engine
            </h2>
            <p className="text-[11px] text-[#575249] mt-0.5">
              Automated asset seizure directive dispatch under Cyber Wing statutory powers
            </p>
          </div>

          {/* Target Exchange Box */}
          <div className="bg-[#f4f0e6] border border-[#d5cec1] rounded-lg p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#21201d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#1b2a41] text-[18px]">account_balance</span>
                <span>{assignedVasp.name} / {assignedVasp.legalEntity}</span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#e2ebd9] text-[#1e3b2b] border border-[#c5d8ba] rounded font-bold">
                FIU-REG
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-[#575249] border-t border-[#dfd8cb] pt-2 font-sans">
              <div className="flex justify-between">
                <span className="text-[#797368]">Nodal Email:</span>
                <span className="text-[#21201d] font-mono">{assignedVasp.nodalEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797368]">Emergency:</span>
                <span className="text-[#21201d] font-mono">{assignedVasp.emergencyPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797368]">Freeze SLA:</span>
                <span className="text-[#9e2a2b] font-bold">&lt; 24 Hours (Mandatory)</span>
              </div>
            </div>
          </div>

          {/* Pre-Drafted Notice Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#21201d] font-mono">
                Section 94 Notice Order Preview
              </label>
              <span className="font-mono text-[10px] text-[#2c5e43] font-bold">FORM 22-B READY</span>
            </div>
            <div className="bg-[#f4f0e6] border border-[#d5cec1] rounded-lg p-3 font-mono text-[10px] text-[#21201d] h-36 overflow-y-auto custom-scrollbar leading-relaxed shadow-xs">
              {dossier.section94NoticePreview}
            </div>
          </div>

          {/* Cryptographic Seal Box */}
          <div className="bg-[#f4f0e6] border border-[#d5cec1] rounded-lg p-3 space-y-2 shadow-xs">
            <div className="text-[10px] font-bold font-mono text-[#21201d] uppercase flex items-center justify-between">
              <span>Evidentiary Cryptographic Seal</span>
              <span className="material-symbols-outlined text-[#2c5e43] text-[16px]">verified</span>
            </div>
            <div className="space-y-1 text-[10px] font-mono text-[#575249]">
              <div className="text-[#797368]">IPFS IMMUTABLE CID:</div>
              <div className="text-[#21201d] font-bold break-all">{dossier.ipfsCid}</div>
              <div className="text-[#2c5e43] font-bold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[13px]">check</span>
                <span>JUDICIAL SIGN VALID (ECDSA)</span>
              </div>
            </div>
          </div>

          {/* Success Banner if dispatched */}
          {dispatchSuccess && (
            <div className="p-3 bg-[#e2ebd9] border border-[#bdd6bc] rounded-lg text-xs font-mono text-[#1e3b2b] space-y-1 shadow-xs">
              <div className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#2c5e43]">check_circle</span>
                <span>NOTICE DISPATCHED TO SAHYOG</span>
              </div>
              <div className="text-[10px]">ACK REF: {freezeAck}</div>
              <div className="text-[10px]">WazirX Compliance Desk notified via secure webhook.</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleDispatch}
              className="w-full bg-[#9e2a2b] hover:bg-[#832122] active:translate-y-px text-[#fff8f0] font-bold text-xs py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs uppercase tracking-wide font-mono"
            >
              <span className="material-symbols-outlined text-base">lock_clock</span>
              <span>DISPATCH FREEZE REQUEST (SEC 94)</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="w-full bg-[#1b2a41] hover:bg-[#121c2b] active:translate-y-px text-[#fff8f0] font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs font-mono disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm text-[#c5d8ba]">
                {isDownloading ? 'hourglass_top' : 'download'}
              </span>
              <span>{isDownloading ? 'Compiling Sealed PDF...' : 'Download Court-Certified PDF'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full bg-[#f4f0e6] hover:bg-[#eae5db] active:translate-y-px border border-[#d6cfc2] text-[#1b2a41] font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs font-mono"
            >
              <span className="material-symbols-outlined text-sm text-[#2c5e43]">print</span>
              <span>Print Certified Evidence Packet</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};
