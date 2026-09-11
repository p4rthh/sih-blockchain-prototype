export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateDynamicDossier } from '@/lib/api/mockData';

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const caseRef = body.case_ref || 'NCRP-2026-DEL-89210';

  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn('Backend compile dossier failed, generating local dossier', err);
    }
  }

  const dossier = generateDynamicDossier(caseRef, body.trace);
  return NextResponse.json(dossier);
}
