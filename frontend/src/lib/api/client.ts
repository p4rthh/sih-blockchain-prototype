import { Complaint, CourtDossier, TraceGraphData, VASPRegistryEntry } from '../types/forensics';
import { MOCK_COMPLAINTS, MOCK_DOSSIER, MOCK_TRACE_GRAPH, MOCK_VASPS } from './mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false' || !BASE_URL;

export const apiClient = {
  // 1. Fetch complaints from NCRP/SAHYOG pipeline
  async getComplaints(): Promise<Complaint[]> {
    if (USE_MOCK) {
      return Promise.resolve(MOCK_COMPLAINTS);
    }
    const res = await fetch(`${BASE_URL}/api/v1/complaints`);
    if (!res.ok) throw new Error('Failed to fetch complaints');
    return res.json();
  },

  // 2. Trigger or fetch multi-hop blockchain trace
  async getTrace(walletAddress: string, chain: string = 'ethereum'): Promise<TraceGraphData> {
    if (USE_MOCK) {
      return Promise.resolve({
        ...MOCK_TRACE_GRAPH,
        rootAddress: walletAddress || MOCK_TRACE_GRAPH.rootAddress,
      });
    }
    const res = await fetch(`${BASE_URL}/api/v1/trace`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: walletAddress, chain }),
    });
    if (!res.ok) throw new Error('Failed to run trace');
    return res.json();
  },

  // 3. Fetch FIU-IND registered VASP / exchange directory
  async getVasps(): Promise<VASPRegistryEntry[]> {
    if (USE_MOCK) {
      return Promise.resolve(MOCK_VASPS);
    }
    const res = await fetch(`${BASE_URL}/api/v1/exchanges`);
    if (!res.ok) throw new Error('Failed to fetch VASP directory');
    return res.json();
  },

  // 4. Fetch Court Admissible Evidence Dossier
  async getDossier(caseRef: string): Promise<CourtDossier> {
    if (USE_MOCK) {
      return Promise.resolve({
        ...MOCK_DOSSIER,
        caseRef: caseRef || MOCK_DOSSIER.caseRef,
      });
    }
    const res = await fetch(`${BASE_URL}/api/v1/reports/${caseRef}`);
    if (!res.ok) throw new Error('Failed to fetch evidence dossier');
    return res.json();
  },

  // 5. Dispatch Emergency Freeze Request under Sec 94 BNSS
  async dispatchFreeze(caseRef: string, vaspId: string): Promise<{ success: boolean; ackNumber: string; timestamp: string }> {
    if (USE_MOCK) {
      return Promise.resolve({
        success: true,
        ackNumber: `SAHYOG-FRZ-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
      });
    }
    const res = await fetch(`${BASE_URL}/api/v1/freeze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_ref: caseRef, vasp_id: vaspId }),
    });
    if (!res.ok) throw new Error('Failed to dispatch freeze notice');
    return res.json();
  },
};
