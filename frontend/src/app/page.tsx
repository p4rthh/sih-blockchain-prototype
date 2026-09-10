'use client';

import React, { useEffect, useState } from 'react';
import { Complaint, CourtDossier, TraceGraphData, VASPRegistryEntry } from '../lib/types/forensics';
import { apiClient } from '../lib/api/client';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { CommandCenterView } from '../components/views/CommandCenterView';
import { GraphExplorerView } from '../components/views/GraphExplorerView';
import { VaspRegistryView } from '../components/views/VaspRegistryView';
import { DossierView } from '../components/views/DossierView';

type TabType = 'intake' | 'explorer' | 'vasp' | 'dossier';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('intake');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [traceData, setTraceData] = useState<TraceGraphData | null>(null);
  const [vasps, setVasps] = useState<VASPRegistryEntry[]>([]);
  const [dossier, setDossier] = useState<CourtDossier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [freezeStatus, setFreezeStatus] = useState<'idle' | 'dispatching' | 'success'>('idle');

  useEffect(() => {
    // Initial fetch from our API client
    apiClient.getComplaints().then(setComplaints);
    apiClient.getTrace('0x742d35Cc6634C0532925a3b844Bc454e4438f44e').then(setTraceData);
    apiClient.getVasps().then(setVasps);
    apiClient.getDossier('CC-MUM-2026-0941').then(setDossier);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const res = await apiClient.getTrace(searchQuery.trim());
    setTraceData(res);
    setActiveTab('explorer');
  };

  const handleSelectComplaint = async (complaint: Complaint) => {
    const res = await apiClient.getTrace(complaint.suspectAddress, complaint.chain);
    setTraceData(res);
    setActiveTab('explorer');
  };

  const handleTraceWallet = async (address: string) => {
    const res = await apiClient.getTrace(address);
    setTraceData(res);
    setActiveTab('explorer');
  };

  const handleGenerateDossier = async () => {
    if (traceData) {
      const freshDossier = await apiClient.compileDossier(
        traceData.traceId,
        `NCRP-${traceData.traceId.slice(-6).toUpperCase()}`
      );
      if (freshDossier) {
        setDossier(freshDossier);
      }
    }
    setActiveTab('dossier');
  };

  const handleEmergencyFreezeTrigger = () => {
    setShowFreezeModal(true);
    setFreezeStatus('idle');
  };

  const confirmEmergencyFreeze = async () => {
    setFreezeStatus('dispatching');
    await apiClient.dispatchFreeze('CC-MUM-2026-0941', 'vasp-wazirx');
    setFreezeStatus('success');
    setTimeout(() => {
      setShowFreezeModal(false);
      setActiveTab('dossier');
    }, 1500);
  };

  return (
    <div className="bg-[#ede8de] text-[#21201d] h-screen w-screen overflow-hidden flex flex-col font-sans selection:bg-[#d6cfc2]">
      {/* Persistent Top Navigation Bar */}
      <Header
        setActiveTab={(t) => setActiveTab(t as TabType)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        onEmergencyFreeze={handleEmergencyFreezeTrigger}
      />

      {/* Main Structural Chassis */}
      <div className="flex flex-1 pt-14 h-full overflow-hidden">
        {/* Persistent Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(t) => setActiveTab(t as TabType)}
          onNewDossier={() => setActiveTab('intake')}
        />

        {/* Viewport Content Area (Offset by Sidebar width) */}
        <main
          className={`flex-1 ml-60 h-full flex flex-col bg-[#e9e4d9] ${
            activeTab === 'explorer' || activeTab === 'dossier'
              ? 'overflow-hidden'
              : 'overflow-y-auto custom-scrollbar'
          }`}
        >
          {activeTab === 'intake' && (
            <CommandCenterView
              complaints={complaints}
              onSelectComplaint={handleSelectComplaint}
              onTraceWallet={handleTraceWallet}
            />
          )}

          {activeTab === 'explorer' && traceData && (
            <GraphExplorerView
              traceData={traceData}
              onGenerateDossier={handleGenerateDossier}
              onEmergencyFreeze={handleEmergencyFreezeTrigger}
            />
          )}

          {activeTab === 'vasp' && (
            <VaspRegistryView
              vasps={vasps}
              onSelectVasp={(vasp) => {
                if (dossier) {
                  setDossier({ ...dossier, assignedVASP: vasp });
                }
                setActiveTab('dossier');
              }}
            />
          )}

          {activeTab === 'dossier' && dossier && (
            <DossierView
              dossier={dossier}
              onDispatchFreeze={() => {
                const vaspId = dossier.assignedVASP?.id || (dossier as unknown as { assignedVasp?: { id?: string } })?.assignedVasp?.id || 'vasp-001';
                apiClient.dispatchFreeze(dossier.caseRef, vaspId);
              }}
            />
          )}
        </main>
      </div>

      {/* Emergency Freeze Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 bg-[#090d16]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#f3efe6] border border-[#d6cfc2] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 border-b border-[#d6cfc2] pb-4">
              <div className="w-10 h-10 rounded-full bg-[#f8e3e1] border border-[#ebb6b4] flex items-center justify-center text-[#9e2a2b]">
                <span className="material-symbols-outlined text-2xl">gavel</span>
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-[#1b2a41]">
                  Emergency Freezing Order Dispatch
                </h3>
                <p className="text-xs text-[#575249]">
                  Section 94 BNSS, 2023 / Section 91 CrPC Statutory Directive
                </p>
              </div>
            </div>

            <div className="bg-[#ece7dc] p-3 rounded-lg border border-[#d6cfc2] text-xs font-mono space-y-1.5 text-[#21201d]">
              <div className="flex justify-between">
                <span className="text-[#797368]">TARGET ENTITY:</span>
                <span className="font-bold text-[#1b2a41]">Zanmai Labs (WazirX)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797368]">TARGET DEPOSIT:</span>
                <span className="font-bold text-[#9e2a2b]">0x99fe...a302</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797368]">EXFIL AMOUNT:</span>
                <span className="font-bold">41,200.54 USDT (₹34.8 Lakhs)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#797368]">DISPATCH ROUTE:</span>
                <span className="text-[#2c5e43] font-bold">SAHYOG LEO COMPLIANCE API</span>
              </div>
            </div>

            {freezeStatus === 'success' && (
              <div className="p-3 bg-[#e2ebd9] border border-[#bdd6bc] rounded-lg text-xs font-mono text-[#214a34] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#2c5e43]">check_circle</span>
                <span>Direct Legal Notice Issued! Transferred to Dossier...</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                disabled={freezeStatus === 'dispatching'}
                onClick={() => setShowFreezeModal(false)}
                className="px-4 py-2 rounded text-xs font-medium text-[#575249] hover:bg-[#eae5db] active:translate-y-px transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                disabled={freezeStatus === 'dispatching'}
                onClick={confirmEmergencyFreeze}
                className="px-5 py-2 rounded bg-[#9e2a2b] hover:bg-[#832122] active:translate-y-px text-[#fff8f0] text-xs font-bold font-mono uppercase tracking-wide transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {freezeStatus === 'dispatching' ? (
                  <span>Signing ECDSA Token...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">lock_clock</span>
                    <span>Confirm &amp; Transmit Notice</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
