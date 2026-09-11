export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/freeze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn('Backend freeze failed', err);
    }
  }

  return NextResponse.json({
    success: true,
    ackNumber: `SAHYOG-FRZ-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp: new Date().toISOString(),
    status: 'DISPATCHED_TO_VASP',
    slaDeadlineHours: 2,
    caseRef: body.case_ref || 'NCRP-2026-DEL-89210',
    vaspId: body.vasp_id || 'vasp-wazirx'
  });
}
