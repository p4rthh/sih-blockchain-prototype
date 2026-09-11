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
  const [isTracing, setIsTracing] = useState(false);

  useEffect(() => {
    // Initial fetch from our API client
    apiClient.getComplaints().then(setComplaints);
    apiClient.getTrace('0x71C438D9A40326e7a2b9d0b5030225d3129889A4').then(setTraceData);
    apiClient.getVasps().then(setVasps);
    apiClient.getDossier('NCRP-2026-DEL-89210').then(setDossier);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsTracing(true);
    try {
      const res = await apiClient.getTrace(searchQuery.trim());
      setTraceData(res);
      setActiveTab('explorer');
    } finally {
      setIsTracing(false);
    }
  };

  const handleSelectComplaint = async (complaint: Complaint) => {
    setIsTracing(true);
    try {
      const res = await apiClient.getTrace(complaint.suspectAddress, complaint.chain);
      setTraceData(res);
      setActiveTab('explorer');
    } finally {
      setIsTracing(false);
    }
  };

  const handleTraceWallet = async (address: string) => {
    setIsTracing(true);
    try {
      const res = await apiClient.getTrace(address);
      setTraceData(res);
      setActiveTab('explorer');
    } finally {
      setIsTracing(false);
    }
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

  return (
    <div className="bg-[#ede8de] text-[#21201d] h-screen w-screen overflow-hidden flex flex-col font-sans selection:bg-[#d6cfc2]">
      {/* Persistent Top Navigation Bar */}
      <Header
        setActiveTab={(t) => setActiveTab(t as TabType)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
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
              onTraceWallet={handleTraceWallet}
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

      {/* Live Mempool Crawler Overlay */}
      {isTracing && (
        <div className="fixed inset-0 bg-[#090d16]/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#f3efe6] border border-[#d6cfc2] rounded-xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1b2a41] text-[#fff8f0] mx-auto flex items-center justify-center animate-spin">
              <span className="material-symbols-outlined text-2xl">autorenew</span>
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-[#1b2a41]">Forensic Mempool Indexing</h3>
              <p className="text-xs text-[#575249] mt-1 font-mono">
                Crawling counterparty transactions, classifying clusters, and resolving legal entities...
              </p>
            </div>
            <div className="text-[10px] font-mono text-[#2c5e43] bg-[#e2ebd9] border border-[#bdd6bc] py-1 px-2.5 rounded inline-block font-semibold">
              LIVE BFS HOP RECURSION ACTIVE
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
