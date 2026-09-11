export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateDynamicDossier } from '@/lib/api/mockData';

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  req: NextRequest,
  { params }: { params: { caseRef: string } }
) {
  const caseRef = decodeURIComponent(params.caseRef || '');

  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/reports/${encodeURIComponent(caseRef)}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn('Backend dossier fetch failed, generating dynamic dossier', err);
    }
  }

  const dossier = generateDynamicDossier(caseRef);
  return NextResponse.json(dossier);
}
