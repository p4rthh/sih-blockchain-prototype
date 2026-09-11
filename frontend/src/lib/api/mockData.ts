import { Complaint, CourtDossier, FlowTransaction, HeuristicFinding, NodeType, TraceGraphData, VASPRegistryEntry, ChainType } from '../types/forensics';

export const MOCK_VASPS: VASPRegistryEntry[] = [
  {
    id: 'vasp-wazirx',
    name: 'WazirX',
    legalEntity: 'Zanmai Labs Pvt. Ltd.',
    jurisdiction: 'Mumbai, MH, India',
    fiuStatus: 'REGISTERED',
    fiuRegNumber: 'FIU-IND/VDA/2023/0014',
    nodalOfficer: 'Shri Arvind Singhal (Legal Compliance)',
    nodalEmail: 'nodal-police@wazirx.com',
    emergencyPhone: '+91 22 4893 1100',
    freezeSlaHours: 2,
    chains: ['ethereum', 'bsc', 'tron', 'bitcoin'],
    knownHotWallets: [
      '0xWAZIRX_HOT_091B88102a9b',
      '0x27C703D144C33b79310C3691656A8F08',
      '0x721931508df476575964705339a5b9d2'
    ],
    depositCount24h: 1420,
    compliancePortalUrl: 'https://sahyog.i4c.gov.in/vasp/wazirx'
  },
  {
    id: 'vasp-coindcx',
    name: 'CoinDCX',
    legalEntity: 'Neblio Technologies Pvt. Ltd.',
    jurisdiction: 'Mumbai / Bengaluru, India',
    fiuStatus: 'REGISTERED',
    fiuRegNumber: 'FIU-IND/VDA/2023/0002',
    nodalOfficer: 'Neha K. (Regulatory Head)',
    nodalEmail: 'compliance-lea@coindcx.com',
    emergencyPhone: '+91 22 4910 8822',
    freezeSlaHours: 2,
    chains: ['ethereum', 'bitcoin', 'tron'],
    knownHotWallets: [
      '0xCoinDCX_Vault_01824a91',
      '0x876f2a8910dca298b31a'
    ],
    depositCount24h: 3105,
    compliancePortalUrl: 'https://sahyog.i4c.gov.in/vasp/coindcx'
  },
  {
    id: 'vasp-coinswitch',
    name: 'CoinSwitch Kuber',
    legalEntity: 'Bitcipher Labs LLP',
    jurisdiction: 'Bengaluru, KA, India',
    fiuStatus: 'REGISTERED',
    fiuRegNumber: 'FIU-IND/VDA/2023/0008',
    nodalOfficer: 'Siddharth M. (LEO Liaison)',
    nodalEmail: 'law-enforcement@coinswitch.co',
    emergencyPhone: '+91 80 4719 3300',
    freezeSlaHours: 4,
    chains: ['ethereum', 'bitcoin'],
    knownHotWallets: [
      '0xCoinSwitch_Treasury_4a82'
    ],
    depositCount24h: 2490,
    compliancePortalUrl: 'https://sahyog.i4c.gov.in/vasp/coinswitch'
  },
  {
    id: 'vasp-binance',
    name: 'Binance India',
    legalEntity: 'Nest Services Limited (FIU Registered)',
    jurisdiction: 'Offshore (FIU-IND Reporting)',
    fiuStatus: 'REGISTERED',
    fiuRegNumber: 'FIU-IND/VDA/2024/0089',
    nodalOfficer: 'India Law Enforcement Portal (LEAP)',
    nodalEmail: 'in-investigations@binance.com',
    emergencyPhone: '+91 11 4099 2200',
    freezeSlaHours: 12,
    chains: ['ethereum', 'bsc', 'bitcoin', 'tron'],
    knownHotWallets: [
      '0x28C6c06298d514Db089934071355E5743bf21d60',
      '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d'
    ],
    depositCount24h: 18450,
    compliancePortalUrl: 'https://leap.binance.com'
  }
];

// Helper: Generate full 23-tx ledger for any node
export function generateNodeTransactions(address: string, chain: ChainType = 'ethereum', nodeType: NodeType): FlowTransaction[] {
  const txs: FlowTransaction[] = [];
  const count = 23;
  const hashPrefix = address.slice(0, 8);

  for (let i = 0; i < count; i++) {
    const isOutbound = i % 2 === 0;
    const valueNum = ((i * 1.37 + 0.15) % 8.5).toFixed(4);
    const feeNum = (0.001 + (i % 5) * 0.0008).toFixed(5);
    const minsAgo = (i + 1) * 7;
    const timeStr = minsAgo < 60 ? `${minsAgo}m ago` : `${Math.floor(minsAgo / 60)}h ${minsAgo % 60}m ago`;
    const riskLevel: FlowTransaction['riskLevel'] = 
      nodeType === 'MIXER' || nodeType === 'SUSPECT_BURNER'
        ? (i % 3 === 0 ? 'CRITICAL' : 'SUSPICIOUS')
        : nodeType === 'EXCHANGE_HOT'
        ? 'SAFE'
        : i % 4 === 0 ? 'BALANCED' : 'CLEAN';

    const otherAddr = `0x${((i + 1) * 123456789).toString(16).padEnd(40, 'a').slice(0, 40)}`;
    const txHash = `0x${hashPrefix}${((i + 1) * 987654321).toString(16).padEnd(56, 'f').slice(0, 56)}`;

    txs.push({
      hash: txHash,
      from: isOutbound ? address : otherAddr,
      to: isOutbound ? otherAddr : address,
      valueStr: `${valueNum} ${chain === 'bitcoin' ? 'BTC' : 'ETH'}`,
      fee: `${feeNum} ${chain === 'bitcoin' ? 'BTC' : 'ETH'}`,
      timestamp: timeStr,
      chain,
      riskLevel
    });
  }
  return txs;
}

// Helper: Generate corridor transactions that sum to edge value
export function generateCorridorTxs(sourceAddr: string, targetAddr: string, totalValueStr: string, chain: ChainType = 'ethereum'): FlowTransaction[] {
  const symbol = chain === 'bitcoin' ? 'BTC' : 'ETH';
  const valMatch = totalValueStr.match(/^([\d.]+)/);
  const total = valMatch ? parseFloat(valMatch[1]) : 10.0;
  const p1 = (total * 0.45).toFixed(3);
  const p2 = (total * 0.35).toFixed(3);
  const p3 = (total - parseFloat(p1) - parseFloat(p2)).toFixed(3);

  return [
    {
      hash: `0x${sourceAddr.slice(2, 8)}a1${targetAddr.slice(2, 8)}78bf20a811c0de77b63f2901`,
      from: sourceAddr,
      to: targetAddr,
      valueStr: `${p1} ${symbol}`,
      fee: `0.0018 ${symbol}`,
      timestamp: '15m ago',
      chain,
      riskLevel: 'CRITICAL'
    },
    {
      hash: `0x${sourceAddr.slice(2, 8)}b2${targetAddr.slice(2, 8)}89cf31b922d1ef88c74a3912`,
      from: sourceAddr,
      to: targetAddr,
      valueStr: `${p2} ${symbol}`,
      fee: `0.0021 ${symbol}`,
      timestamp: '12m ago',
      chain,
      riskLevel: 'CRITICAL'
    },
    {
      hash: `0x${sourceAddr.slice(2, 8)}c3${targetAddr.slice(2, 8)}90df42c033e2fa99d85b4923`,
      from: sourceAddr,
      to: targetAddr,
      valueStr: `${p3} ${symbol}`,
      fee: `0.0012 ${symbol}`,
      timestamp: '9m ago',
      chain,
      riskLevel: 'SUSPICIOUS'
    }
  ];
}

// Full Forensic Telemetry Heuristic Evaluation Set
const BASE_HEURISTICS: HeuristicFinding[] = [
  {
    code: 'H1_DEPOSIT_REUSE',
    name: 'Direct VASP Deposit Reuse',
    status: 'CONFIRMED',
    badge: 'CONFIRMED',
    isTriggered: true,
    summary: 'High fan-in address exhibits rapid aggregation characteristic of exchange deposit sweeps.'
  },
  {
    code: 'H2_TEMPORAL_BURST',
    name: 'Rapid Multi-Hop Dispersion',
    status: 'CONFIRMED',
    badge: 'CONFIRMED',
    isTriggered: true,
    summary: 'Successive transfers completed within a 12-minute window, indicating automated peel scripting.'
  },
  {
    code: 'H3_CONTRACT_JACCARD',
    name: 'DeFi Bridge Relayer Corroboration',
    status: 'EVALUATED',
    badge: 'ATTRIBUTED',
    isTriggered: true,
    summary: 'Contract interactions align with cross-chain atomic lock/mint verification.'
  },
  {
    code: 'H4_GNN_EMBEDDING',
    name: 'GraphSAGE Inductive Cluster Score',
    status: 'VERIFIED',
    badge: 'P > 0.94',
    isTriggered: true,
    summary: 'Neural node classification attributes cluster with 94.2% deterministic confidence.'
  },
  {
    code: 'H5_MIXER_HOP',
    name: 'Zero-Knowledge Privacy Pool Interaction',
    status: 'EVALUATED',
    badge: 'EVALUATED',
    isTriggered: false,
    summary: 'Evaluated against OFAC/LEA sanctioned privacy pool registries.'
  }
];

// DYNAMIC TRACE GENERATOR: Handles any address or preset scenario
export function generateDynamicTrace(rawAddress: string, chain: ChainType = 'ethereum'): TraceGraphData {
  const addr = rawAddress.trim();
  const lower = addr.toLowerCase();

  // Scenario 1: Mixer Pool (Tornado Cash / Lazarus Group)
  if (lower.includes('mixer') || lower.includes('tornado') || lower.includes('9484') || lower.includes('lazarus')) {
    const root = addr || '0x94845333028B1204Fbe14E1278Fd4Adde46B22ce';
    const n1 = '0x3b11e299f18a24c08821049b8a31e847';
    const n2 = '0x889a7c01e389b0991823a451e0892c90';
    const mixerAddr = '0x12D66f22889238e0C116001D05C61A2fC990264E';

    return {
      traceId: `trace-mixer-${Date.now()}`,
      rootAddress: root,
      targetEntity: 'Tornado Cash (ZK Privacy Pool)',
      confidence: 98.6,
      totalHops: 3,
      totalValueStolen: '100.00 ETH (~₹2.78 Crore)',
      timeSpan: '38 Minutes',
      riskScore: 98,
      typology: 'ZERO_KNOWLEDGE_MIXER_SEVERANCE',
      trailStatus: 'LOST_TO_MIXER',
      trailVerdict: 'Trail Lost: Stolen funds were deposited into Tornado Cash ZK-SNARK Privacy Pool. Cryptographic link is severed on-chain.',
      nodes: [
        {
          id: 'node-0',
          address: root,
          label: 'Suspect Root (Lazarus Ingress)',
          type: 'VICTIM',
          chain: 'ethereum',
          balance: '0.01 ETH',
          riskScore: 95,
          confidence: 100,
          txCount: 23,
          transactions: generateNodeTransactions(root, 'ethereum', 'VICTIM')
        },
        {
          id: 'node-1',
          address: n1,
          label: 'Peel Hop 1 (Burner Mule)',
          type: 'SUSPECT_BURNER',
          chain: 'ethereum',
          balance: '0.00 ETH',
          riskScore: 94,
          confidence: 98,
          txCount: 23,
          transactions: generateNodeTransactions(n1, 'ethereum', 'SUSPECT_BURNER')
        },
        {
          id: 'node-2',
          address: n2,
          label: 'Peel Hop 2 (Transit Router)',
          type: 'INTERMEDIARY',
          chain: 'ethereum',
          balance: '0.00 ETH',
          riskScore: 96,
          confidence: 97,
          txCount: 23,
          transactions: generateNodeTransactions(n2, 'ethereum', 'INTERMEDIARY')
        },
        {
          id: 'node-3',
          address: mixerAddr,
          label: 'Tornado Cash: 100 ETH ZK Pool',
          type: 'MIXER',
          chain: 'ethereum',
          balance: '14,280.00 ETH',
          riskScore: 100,
          confidence: 99.8,
          entity: 'Tornado Cash Router (OFAC Sanctioned)',
          txCount: 23,
          isTerminal: true,
          terminalStatus: 'TRAIL LOST IN MIXER',
          transactions: generateNodeTransactions(mixerAddr, 'ethereum', 'MIXER')
        }
      ],
      links: [
        {
          source: 'node-0',
          target: 'node-1',
          value: '100.00 ETH',
          currency: 'ETH',
          txHash: '0x8a92...1c4b',
          timestamp: '38m ago',
          fee: '0.0021 ETH',
          chain: 'ethereum',
          heuristic: 'Rapid automated drain from compromised vault',
          txCount: 3,
          individualTxs: generateCorridorTxs(root, n1, '100.00 ETH')
        },
        {
          source: 'node-1',
          target: 'node-2',
          value: '99.98 ETH',
          currency: 'ETH',
          txHash: '0x12dc...f990',
          timestamp: '24m ago',
          fee: '0.0019 ETH',
          chain: 'ethereum',
          heuristic: 'Intermediate peel transit to confuse indexers',
          txCount: 3,
          individualTxs: generateCorridorTxs(n1, n2, '99.98 ETH')
        },
        {
          source: 'node-2',
          target: 'node-3',
          value: '99.95 ETH',
          currency: 'ETH',
          txHash: '0x44ab...e812',
          timestamp: '11m ago',
          fee: '0.0045 ETH',
          chain: 'ethereum',
          heuristic: 'Contract deposit into Tornado.Cash 100 ETH Instance',
          txCount: 3,
          individualTxs: generateCorridorTxs(n2, mixerAddr, '99.95 ETH')
        }
      ],
      heuristics: [
        ...BASE_HEURISTICS.map(h => h.code === 'H5_MIXER_HOP' ? { ...h, isTriggered: true, status: 'CRITICAL', badge: 'SANCTIONED POOL' } : h)
      ]
    };
  }

  // Scenario 2: Cross-Chain Exit (Hop / Stargate Bridge)
  if (lower.includes('bridge') || lower.includes('stargate') || lower.includes('hop')) {
    const root = addr || '0x44abe812c30089f2a00192b0c391a082';
    const n1 = '0x11223344556677889900aabbccddeeff00112233';
    const bridgeAddr = '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590';

    return {
      traceId: `trace-bridge-${Date.now()}`,
      rootAddress: root,
      targetEntity: 'Stargate Finance Bridge Router',
      confidence: 95.2,
      totalHops: 2,
      totalValueStolen: '25.00 ETH (~₹69.5 Lakhs)',
      timeSpan: '22 Minutes',
      riskScore: 86,
      typology: 'CROSS_CHAIN_LIQUIDITY_HOP',
      trailStatus: 'CROSS_CHAIN_EXIT',
      trailVerdict: 'Trail Bridged: Funds siphoned through Stargate Finance Cross-Chain Router. Liquidity hopped from Ethereum to Arbitrum Mainnet.',
      nodes: [
        {
          id: 'node-0',
          address: root,
          label: 'Suspect Root (Bridge Ingress)',
          type: 'VICTIM',
          chain: 'ethereum',
          balance: '0.02 ETH',
          riskScore: 78,
          confidence: 100,
          txCount: 23,
          transactions: generateNodeTransactions(root, 'ethereum', 'VICTIM')
        },
        {
          id: 'node-1',
          address: n1,
          label: 'Intermediate Mule (Aggregator)',
          type: 'INTERMEDIARY',
          chain: 'ethereum',
          balance: '0.01 ETH',
          riskScore: 84,
          confidence: 94,
          txCount: 23,
          transactions: generateNodeTransactions(n1, 'ethereum', 'INTERMEDIARY')
        },
        {
          id: 'node-2',
          address: bridgeAddr,
          label: 'Stargate Finance Bridge Contract',
          type: 'BRIDGE_LOCK',
          chain: 'ethereum',
          balance: '28,190.00 ETH',
          riskScore: 92,
          confidence: 99.5,
          entity: 'Stargate Cross-Chain Pool',
          txCount: 23,
          isTerminal: true,
          terminalStatus: 'CROSS-CHAIN EXIT (ARBITRUM)',
          transactions: generateNodeTransactions(bridgeAddr, 'ethereum', 'BRIDGE_LOCK')
        }
      ],
      links: [
        {
          source: 'node-0',
          target: 'node-1',
          value: '25.00 ETH',
          currency: 'ETH',
          txHash: '0x991a...7123',
          timestamp: '22m ago',
          fee: '0.0015 ETH',
          chain: 'ethereum',
          heuristic: 'Automated rapid transfer',
          txCount: 3,
          individualTxs: generateCorridorTxs(root, n1, '25.00 ETH')
        },
        {
          source: 'node-1',
          target: 'node-2',
          value: '24.98 ETH',
          currency: 'ETH',
          txHash: '0x44cd...991a',
          timestamp: '14m ago',
          fee: '0.0031 ETH',
          chain: 'ethereum',
          heuristic: 'Cross-chain lock/mint deposit',
          txCount: 3,
          individualTxs: generateCorridorTxs(n1, bridgeAddr, '24.98 ETH'),
          isBridge: true
        }
      ],
      heuristics: [
        ...BASE_HEURISTICS.map(h => h.code === 'H3_CONTRACT_JACCARD' ? { ...h, isTriggered: true, status: 'CONFIRMED', badge: 'BRIDGE IDENTIFIED' } : h)
      ]
    };
  }

  // Scenario 3: Unspent Burner / Cold Mule (funds parked in unspent burner)
  if (lower.includes('burner') || lower.includes('unspent') || lower.includes('parked')) {
    const root = addr || '0x55aa44bb33cc22dd11ee00ff99887766';
    const b1 = '0x99887766554433221100ffeeddccbbaa11223344';

    return {
      traceId: `trace-burner-${Date.now()}`,
      rootAddress: root,
      targetEntity: 'Unspent Mule Burner Wallet',
      confidence: 96.8,
      totalHops: 1,
      totalValueStolen: '18.50 ETH (~₹51.4 Lakhs)',
      timeSpan: '1 Hour 15 Mins',
      riskScore: 89,
      typology: 'SINGLE_HOP_MULE_RETENTION',
      trailStatus: 'UNSPENT_BURNER',
      trailVerdict: 'Trail Active at Burner: Funds remain unspent at suspect burner address. No further dispersion detected.',
      nodes: [
        {
          id: 'node-0',
          address: root,
          label: 'Suspect Root (Compromised)',
          type: 'VICTIM',
          chain: 'ethereum',
          balance: '0.00 ETH',
          riskScore: 88,
          confidence: 100,
          txCount: 23,
          transactions: generateNodeTransactions(root, 'ethereum', 'VICTIM')
        },
        {
          id: 'node-1',
          address: b1,
          label: 'Mule Burner (18.50 ETH Sitting)',
          type: 'SUSPECT_BURNER',
          chain: 'ethereum',
          balance: '18.50 ETH',
          riskScore: 92,
          confidence: 96.8,
          entity: 'Identified Mule Account',
          txCount: 23,
          isTerminal: true,
          terminalStatus: 'UNSPENT IN BURNER',
          transactions: generateNodeTransactions(b1, 'ethereum', 'SUSPECT_BURNER')
        }
      ],
      links: [
        {
          source: 'node-0',
          target: 'node-1',
          value: '18.50 ETH',
          currency: 'ETH',
          txHash: '0x33aa...9911',
          timestamp: '1h 15m ago',
          fee: '0.0014 ETH',
          chain: 'ethereum',
          heuristic: 'Complete balance sweep to new uninitialized address',
          txCount: 3,
          individualTxs: generateCorridorTxs(root, b1, '18.50 ETH')
        }
      ],
      heuristics: BASE_HEURISTICS
    };
  }

  // Scenario 4: Dormant Holding (> 180 Days without outflow)
  if (lower.includes('dormant') || lower.includes('cold') || lower.includes('vault')) {
    const root = addr || '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b';
    const d1 = '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f';

    return {
      traceId: `trace-dormant-${Date.now()}`,
      rootAddress: root,
      targetEntity: 'Dormant Cold Storage',
      confidence: 93.4,
      totalHops: 1,
      totalValueStolen: '5.40 BTC (~₹3.12 Crore)',
      timeSpan: '194 Days',
      riskScore: 74,
      typology: 'DORMANT_COLD_PARKING',
      trailStatus: 'DORMANT_HOLDING',
      trailVerdict: 'Trail Dormant: Stolen assets moved to offline cold storage wallet with zero outbound activity for >180 days.',
      nodes: [
        {
          id: 'node-0',
          address: root,
          label: 'Suspect Root (Origin)',
          type: 'VICTIM',
          chain: 'bitcoin',
          balance: '0.0001 BTC',
          riskScore: 82,
          confidence: 100,
          txCount: 23,
          transactions: generateNodeTransactions(root, 'bitcoin', 'VICTIM')
        },
        {
          id: 'node-1',
          address: d1,
          label: 'Dormant Vault Address',
          type: 'INTERMEDIARY',
          chain: 'bitcoin',
          balance: '5.40 BTC',
          riskScore: 76,
          confidence: 93.4,
          entity: 'Inactive Cold Wallet',
          txCount: 23,
          isTerminal: true,
          terminalStatus: 'DORMANT (>180 DAYS)',
          transactions: generateNodeTransactions(d1, 'bitcoin', 'INTERMEDIARY')
        }
      ],
      links: [
        {
          source: 'node-0',
          target: 'node-1',
          value: '5.40 BTC',
          currency: 'BTC',
          txHash: '0x7a8b...33ef',
          timestamp: '194d ago',
          fee: '0.00015 BTC',
          chain: 'bitcoin',
          heuristic: 'UTXO consolidation into high-security multi-sig',
          txCount: 3,
          individualTxs: generateCorridorTxs(root, d1, '5.40 BTC', 'bitcoin')
        }
      ],
      heuristics: BASE_HEURISTICS
    };
  }

  // Scenario 5: Burned (sent to dead address)
  if (lower.includes('dead') || lower.includes('burn') || lower.includes('0x0000')) {
    const root = addr || '0x66778899aabbccddeeff00112233445566778899';
    const deadAddr = '0x000000000000000000000000000000000000dEaD';

    return {
      traceId: `trace-burned-${Date.now()}`,
      rootAddress: root,
      targetEntity: 'EVM Dead Address (Irretrievable)',
      confidence: 100.0,
      totalHops: 1,
      totalValueStolen: '12.00 ETH (~₹33.3 Lakhs)',
      timeSpan: '8 Minutes',
      riskScore: 99,
      typology: 'TOKEN_INCINERATION',
      trailStatus: 'BURNED',
      trailVerdict: 'Trail Destroyed: Stolen funds transferred to EVM 0x000000000000000000000000000000000000dEaD. Cryptographically unrecoverable.',
      nodes: [
        {
          id: 'node-0',
          address: root,
          label: 'Suspect Root (Scam Contract)',
          type: 'VICTIM',
          chain: 'ethereum',
          balance: '0.00 ETH',
          riskScore: 99,
          confidence: 100,
          txCount: 23,
          transactions: generateNodeTransactions(root, 'ethereum', 'VICTIM')
        },
        {
          id: 'node-1',
          address: deadAddr,
          label: 'EVM Incinerator (0x...dEaD)',
          type: 'BENIGN_PUBLIC',
          chain: 'ethereum',
          balance: '148,910.00 ETH',
          riskScore: 100,
          confidence: 100,
          entity: 'Dead Burn Address',
          txCount: 23,
          isTerminal: true,
          terminalStatus: 'PERMANENTLY BURNED',
          transactions: generateNodeTransactions(deadAddr, 'ethereum', 'BENIGN_PUBLIC')
        }
      ],
      links: [
        {
          source: 'node-0',
          target: 'node-1',
          value: '12.00 ETH',
          currency: 'ETH',
          txHash: '0xdead...beef',
          timestamp: '8m ago',
          fee: '0.0009 ETH',
          chain: 'ethereum',
          heuristic: 'Irrevocable transfer to burn contract',
          txCount: 3,
          individualTxs: generateCorridorTxs(root, deadAddr, '12.00 ETH')
        }
      ],
      heuristics: BASE_HEURISTICS
    };
  }

  // DEFAULT / GENERAL ARBITRARY CASE:
  // Dynamically generates a multi-hop trace terminating at FIU-IND registered WazirX / CoinDCX Hot Wallet
  const root = addr || '0x71C8364...a812';
  const effectiveChain: ChainType = (root.startsWith('bc1') || root.startsWith('1') || root.startsWith('3')) ? 'bitcoin' : chain;
  const symbol = effectiveChain === 'bitcoin' ? 'BTC' : 'ETH';

  // Seeded addresses from input
  const h1 = `0x9a${root.slice(2, 6).padEnd(4, '0')}881c${root.slice(-4)}2901a1b2c3d4e5f6`;
  const h2 = `0xb2${root.slice(2, 6).padEnd(4, '1')}11ac${root.slice(-4)}778899aabbccdde0`;
  const depositSweep = `0x27C7${root.slice(2, 6).padEnd(4, '2')}4C33b79310C3691656A8F08`;
  const vaspHotWallet = '0xWAZIRX_HOT_091B88102a9b';

  return {
    traceId: `trace-dyn-${Date.now()}`,
    rootAddress: root,
    targetEntity: 'WazirX (Zanmai Labs Pvt. Ltd.)',
    confidence: 96.4,
    totalHops: 4,
    totalValueStolen: `14.85 ${symbol} (~₹41.2 Lakhs)`,
    timeSpan: '47 Minutes',
    riskScore: 92,
    typology: 'AUTOMATED_PEELING_VASP_SWEEP',
    trailStatus: 'VASP_DEPOSIT',
    trailVerdict: 'Actionable Trail: Funds consolidated into FIU-IND Registered VASP (WazirX). Ready for immediate Section 94 BNSS Emergency Freeze Notice.',
    nodes: [
      {
        id: 'node-0',
        address: root,
        label: 'Suspect Root (Initial Drain)',
        type: 'VICTIM',
        chain: effectiveChain,
        balance: `0.02 ${symbol}`,
        riskScore: 89,
        confidence: 100,
        txCount: 23,
        transactions: generateNodeTransactions(root, effectiveChain, 'VICTIM')
      },
      {
        id: 'node-1',
        address: h1,
        label: 'Peel Hop 1 (Burner Mule)',
        type: 'SUSPECT_BURNER',
        chain: effectiveChain,
        balance: `0.001 ${symbol}`,
        riskScore: 91,
        confidence: 98,
        txCount: 23,
        transactions: generateNodeTransactions(h1, effectiveChain, 'SUSPECT_BURNER')
      },
      {
        id: 'node-2',
        address: h2,
        label: 'Peel Hop 2 (Transit Mule)',
        type: 'INTERMEDIARY',
        chain: effectiveChain,
        balance: `0.002 ${symbol}`,
        riskScore: 87,
        confidence: 96,
        txCount: 23,
        transactions: generateNodeTransactions(h2, effectiveChain, 'INTERMEDIARY')
      },
      {
        id: 'node-3',
        address: depositSweep,
        label: 'WazirX KYC Deposit Address',
        type: 'EXCHANGE_DEPOSIT',
        chain: effectiveChain,
        balance: `0.00 ${symbol}`,
        riskScore: 95,
        confidence: 99.2,
        entity: 'WazirX Customer Account (KYC Linked)',
        txCount: 23,
        transactions: generateNodeTransactions(depositSweep, effectiveChain, 'EXCHANGE_DEPOSIT')
      },
      {
        id: 'node-4',
        address: vaspHotWallet,
        label: 'WazirX FIU Hot Wallet (091B88)',
        type: 'EXCHANGE_HOT',
        chain: effectiveChain,
        balance: `1,280.45 ${symbol}`,
        riskScore: 12,
        confidence: 99.9,
        entity: 'WazirX Treasury (FIU-IND Reg #0014)',
        txCount: 23,
        isTerminal: true,
        terminalStatus: 'ACTIONABLE IN VASP (WAZIRX)',
        transactions: generateNodeTransactions(vaspHotWallet, effectiveChain, 'EXCHANGE_HOT')
      }
    ],
    links: [
      {
        source: 'node-0',
        target: 'node-1',
        value: `14.85 ${symbol}`,
        currency: symbol,
        txHash: `0x8a92...${root.slice(-4)}`,
        timestamp: '47m ago',
        fee: `0.0021 ${symbol}`,
        chain: effectiveChain,
        heuristic: 'Phishing signature drain transaction',
        txCount: 3,
        individualTxs: generateCorridorTxs(root, h1, `14.85 ${symbol}`, effectiveChain)
      },
      {
        source: 'node-1',
        target: 'node-2',
        value: `14.82 ${symbol}`,
        currency: symbol,
        txHash: '0x12dc...f990',
        timestamp: '32m ago',
        fee: `0.0019 ${symbol}`,
        chain: effectiveChain,
        heuristic: 'Peeling chain dispersion',
        txCount: 3,
        individualTxs: generateCorridorTxs(h1, h2, `14.82 ${symbol}`, effectiveChain)
      },
      {
        source: 'node-2',
        target: 'node-3',
        value: `14.80 ${symbol}`,
        currency: symbol,
        txHash: '0x44ab...e812',
        timestamp: '19m ago',
        fee: `0.0018 ${symbol}`,
        chain: effectiveChain,
        heuristic: 'Direct transfer to newly generated VASP deposit tag',
        txCount: 3,
        individualTxs: generateCorridorTxs(h2, depositSweep, `14.80 ${symbol}`, effectiveChain)
      },
      {
        source: 'node-3',
        target: 'node-4',
        value: `14.78 ${symbol}`,
        currency: symbol,
        txHash: '0x991a...7123',
        timestamp: '6m ago',
        fee: `0.0005 ${symbol}`,
        chain: effectiveChain,
        heuristic: 'Automated high-frequency exchange hot wallet aggregation sweep',
        txCount: 3,
        individualTxs: generateCorridorTxs(depositSweep, vaspHotWallet, `14.78 ${symbol}`, effectiveChain)
      }
    ],
    heuristics: BASE_HEURISTICS
  };
}

export const MOCK_TRACE_GRAPH: TraceGraphData = generateDynamicTrace('0x71C8364...a812');

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'case-001',
    acknowledgementNo: 'NCRP-2026-DEL-89210',
    firNumber: 'FIR-402/2026',
    policeStation: 'Special Cell Cyber PS, Mandir Marg',
    victimName: 'Aditya Sharma',
    suspectAddress: '0x71C8364...a812',
    chain: 'ethereum',
    amount: '14.85 ETH (~₹41.2 Lakhs)',
    reportedAt: '12m ago',
    status: 'ATTRIBUTED',
    targetVASP: 'WazirX (FIU-IND/VDA/2023/0014)',
    riskScore: 0.94,
    ioName: 'Inspector R. K. Sharma',
    zone: 'Southern Cyber Range, New Delhi'
  },
  {
    id: 'case-002',
    acknowledgementNo: 'NCRP-2026-MUM-44912',
    firNumber: 'FIR-188/2026',
    policeStation: 'Bandra Kurla Cyber Police Station',
    victimName: 'Sunil Mehta (HNI Account)',
    suspectAddress: '0x94845333028B1204Fbe14E1278Fd4Adde46B22ce',
    chain: 'ethereum',
    amount: '100.00 ETH (~₹2.78 Crore)',
    reportedAt: '42m ago',
    status: 'TRACING',
    targetVASP: 'Tornado Cash (ZK Pool)',
    riskScore: 0.98,
    ioName: 'ACP Priyadarshini Rao',
    zone: 'Zone 8 Cyber Branch, Mumbai'
  },
  {
    id: 'case-003',
    acknowledgementNo: 'NCRP-2026-BLR-12009',
    firNumber: 'FIR-091/2026',
    policeStation: 'CID Cyber Crime Division, Carlton House',
    victimName: 'Dr. Ramesh Narayan',
    suspectAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    chain: 'bitcoin',
    amount: '3.45 BTC (~₹1.98 Crore)',
    reportedAt: '2h ago',
    status: 'FROZEN',
    targetVASP: 'CoinDCX (FIU-IND/VDA/2023/0002)',
    riskScore: 0.88,
    ioName: 'DySP K. Venkatraman',
    zone: 'Cyber Security Operations Center, Bengaluru'
  },
  {
    id: 'case-004',
    acknowledgementNo: 'NCRP-2026-HYD-77189',
    firNumber: 'FIR-312/2026',
    policeStation: 'Cyberabad Police Commissionerate, Gachibowli',
    victimName: 'Ananya Reddy',
    suspectAddress: '0x44abe812c30089f2a00192b0c391a082',
    chain: 'ethereum',
    amount: '25.00 ETH (~₹69.5 Lakhs)',
    reportedAt: '3h ago',
    status: 'QUEUED',
    targetVASP: 'Stargate Finance Bridge',
    riskScore: 0.82,
    ioName: 'Inspector Mohd. Rizwan',
    zone: 'Cyberabad Cyber Cell, Hyderabad'
  }
];

export function generateDynamicDossier(caseRef: string, trace?: TraceGraphData): CourtDossier {
  const activeTrace = trace || generateDynamicTrace('0x71C8364...a812');
  const vasp = MOCK_VASPS[0];

  return {
    caseRef: caseRef || 'NCRP-2026-DEL-89210',
    firNumber: 'FIR-402/2026 u/s 66D IT Act & 318(4) BNS',
    suspectTargetId: activeTrace.rootAddress,
    investigatingOfficer: 'Inspector R. K. Sharma, Cyber Cell Mandir Marg',
    unit: 'Delhi Police Special Cell (Cyber Operations)',
    sha256Digest: '7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    ipfsCid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    synopsisEn: `Forensic analysis of suspect wallet ${activeTrace.rootAddress} initiated pursuant to NCRP Complaint. Multi-hop automated peeling dispersion completed over ${activeTrace.totalHops} hops. Final terminal status: ${activeTrace.trailStatus}. Attributed entity: ${activeTrace.targetEntity}. Section 94 BNSS preservation notice dispatched to nodal compliance officer.`,
    synopsisHi: `संदिग्ध वॉलेट ${activeTrace.rootAddress} की फॉरेंसिक जांच एनसीआरपी शिकायत के तहत पूरी की गई। स्वचालित पीलिंग विश्लेषण से स्पष्ट होता है कि चोरी की धनराशि ${activeTrace.totalHops} चरणों में स्थानांतरित की गई। अंतिम स्थिति: ${activeTrace.trailStatus}। चिन्हित इकाई: ${activeTrace.targetEntity}। धारा 94 बीएनएसएस नोटिस नोडल अनुपालन अधिकारी को प्रेषित किया गया।`,
    traceData: activeTrace,
    assignedVASP: vasp,
    section94NoticePreview: `NOTICE UNDER SECTION 94 OF BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023 / SEC 91 CrPC

To:
The Nodal Officer (Law Enforcement Inquiries),
${vasp.legalEntity} (${vasp.name}),
${vasp.jurisdiction}
FIU-IND Registration: ${vasp.fiuRegNumber}

Subject: URGENT NOTICE TO FREEZE VDA DEPOSIT ACCOUNTS AND PRESERVE TRANSACTION LOGS IN FIR NO. 402/2026

Whereas investigation into FIR No. 402/2026 registered at Cyber Police Station Mandir Marg reveals that stolen cryptocurrency amounting to ${activeTrace.totalValueStolen} has been deposited into your hot wallet/sweep address:
Target Root: ${activeTrace.rootAddress}
Terminal Entity: ${activeTrace.targetEntity}

You are hereby directed to:
1. Immediately freeze and suspend all withdrawal facilities for the recipient deposit account and any linked bank or VDA balances.
2. Furnish full KYC dossier (Aadhaar, PAN, Passport, IP logs, linked bank accounts).
3. Acknowledge compliance within ${vasp.freezeSlaHours} hours pursuant to statutory FIU-IND directives.

Issued under seal:
Inspector R. K. Sharma
Special Cell Cyber Crime Unit, New Delhi`,
    isSigned: true,
    generatedAt: new Date().toISOString()
  };
}

export const MOCK_DOSSIER: CourtDossier = generateDynamicDossier('NCRP-2026-DEL-89210', MOCK_TRACE_GRAPH);
