export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generateDynamicTrace } from '@/lib/api/mockData';
import { ChainType } from '@/lib/types/forensics';

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const walletAddress = (body.wallet_address || '').trim();
  const chain: ChainType = (walletAddress.startsWith('bc1') || walletAddress.startsWith('1') || walletAddress.startsWith('3'))
    ? 'bitcoin'
    : (body.chain as ChainType || 'ethereum');

  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/trace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: walletAddress, chain }),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn('Backend trace failed, serving dynamic multi-hop trace', err);
    }
  }

  const dynamicTrace = generateDynamicTrace(walletAddress, chain);
  return NextResponse.json(dynamicTrace);
}
