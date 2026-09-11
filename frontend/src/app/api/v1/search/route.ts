export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_COMPLAINTS, MOCK_VASPS } from '@/lib/api/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();

  const complaints = MOCK_COMPLAINTS.filter(c =>
    c.acknowledgementNo.toLowerCase().includes(q) ||
    c.suspectAddress.toLowerCase().includes(q) ||
    c.victimName.toLowerCase().includes(q)
  );

  const vasps = MOCK_VASPS.filter(v =>
    v.name.toLowerCase().includes(q) ||
    v.legalEntity.toLowerCase().includes(q)
  );

  const wallets = [
    { address: '0xWAZIRX_HOT_091B88102a9b', entity: 'WazirX Hot Wallet', type: 'EXCHANGE_HOT', fiuStatus: 'REGISTERED' },
    { address: '0x12D66f22889238e0C116001D05C61A2fC990264E', entity: 'Tornado Cash Router', type: 'MIXER', status: 'SANCTIONED' },
    { address: '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590', entity: 'Stargate Bridge', type: 'BRIDGE_LOCK' },
    { address: '0x000000000000000000000000000000000000dEaD', entity: 'EVM Burn Address', type: 'BENIGN_PUBLIC', status: 'BURNED' }
  ].filter(w => w.address.toLowerCase().includes(q) || w.entity.toLowerCase().includes(q));

  return NextResponse.json({ complaints, vasps, wallets });
}
