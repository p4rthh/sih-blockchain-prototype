export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { MOCK_VASPS } from '@/lib/api/mockData';

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/exchanges`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn('Backend exchange directory fetch failed', err);
    }
  }
  return NextResponse.json(MOCK_VASPS);
}
