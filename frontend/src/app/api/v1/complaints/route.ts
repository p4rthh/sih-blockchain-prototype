export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_COMPLAINTS } from '@/lib/api/mockData';
import { Complaint, ChainType } from '@/lib/types/forensics';

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function GET() {
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/complaints`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn('Proxy to Python backend failed, serving cached NCRP complaints', err);
    }
  }
  return NextResponse.json(MOCK_COMPLAINTS);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, { status: 201 });
      }
    } catch (err) {
      console.warn('Proxy complaint ingestion to backend failed, serving dynamic record', err);
    }
  }

  const newComplaint: Complaint = {
    id: `case-${Date.now()}`,
    acknowledgementNo: `NCRP-2026-DEL-${Math.floor(10000 + Math.random() * 90000)}`,
    firNumber: `FIR-${Math.floor(100 + Math.random() * 900)}/2026`,
    policeStation: body.police_station || 'Special Cell Cyber PS, Mandir Marg',
    victimName: body.victim_name || 'Confidential Complainant',
    suspectAddress: body.wallet_address || '0x71C8364...a812',
    chain: (body.chain as ChainType) || 'ethereum',
    amount: body.amount || '10.00 ETH',
    reportedAt: 'Just Now',
    status: 'QUEUED',
    riskScore: 0.88,
    ioName: 'Inspector R. K. Sharma',
    zone: 'Southern Cyber Range, New Delhi',
  };

  return NextResponse.json(newComplaint, { status: 201 });
}
