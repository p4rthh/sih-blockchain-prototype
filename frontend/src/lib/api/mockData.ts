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

// DYNAMIC TRACE GENERATOR: Complete scenario recognition & dynamic synthesis
export function generateDynamicTrace(rawAddress: string, chain: ChainType = 'ethereum'): TraceGraphData {
  const addr = rawAddress.trim();
  const lower = addr.toLowerCase();

  // 1. LAZARUS GROUP ($624M Ronin Heist)
  if (lower === '0x098b716b8aaf21512996dc57eb0615e2383e2f96' || lower.includes('lazarus') || lower.includes('ronin') || lower.includes('0x098b')) {
    const root = '0x098b716b8aaf21512996dc57eb0615e2383e2f96';
    const m1 = '0x3b11e299f18a24c08821049b8a31e84700112233';
    const m2 = '0x889a7c01e389b0991823a451e0892c90aabbccdd';
    const mixerAddr = '0x12D66f87A04A9E220743712Ce6d9bB1B5616B8Fc';

    return {
      traceId: `TRC-LAZARUS-${Date.now().toString().slice(-6)}`,
      rootAddress: root,
      targetEntity: 'OFAC Sanctioned Mixer Pool (Tornado Cash)',
      confidence: 99.4,
      totalHops: 3,
      totalValueStolen: '173,600.00 ETH (~$624M)',
      timeSpan: '1h 14m',
      riskScore: 99.8,
      typology: 'STATE_SPONSORED_ZK_MIXER_DISSIPATION',
      trailStatus: 'LOST_TO_MIXER',
      trailVerdict: 'Trail Lost in Mixer: Stolen funds from Ronin Bridge exploit deposited into Tornado.Cash 100 ETH ZK pool. Cryptographic trail severed.',
      nodes: [
        {
          id: 'node-0',
          address: root,
          label: 'Lazarus Primary Exploit Root',
          type: 'VICTIM',
          chain: 'ethereum',
          balance: '0.00 ETH',
          riskScore: 100,
          confidence: 100,
          entity: 'Lazarus Group (FBI Wanted)',
          txCount: 23,
          transactions: generateNodeTransactions(root, 'ethereum', 'VICTIM')
        },
        {
          id: 'node-1',
          address: m1,
          label: 'Laundering Mule A (Aggregator)',
          type: 'SUSPECT_BURNER',
          chain: 'ethereum',
          balance: '0.00 ETH',
          riskScore: 98,
          confidence: 99,
          txCount: 23,
          transactions: generateNodeTransactions(m1, 'ethereum', 'SUSPECT_BURNER')
        },
        {
          id: 'node-2',
          address: m2,
          label: 'Peeling Transit Node B',
          type: 'INTERMEDIARY',
          chain: 'ethereum',
          balance: '0.00 ETH',
          riskScore: 96,
          confidence: 98,
          txCount: 23,
          transactions: generateNodeTransactions(m2, 'ethereum', 'INTERMEDIARY')
        },
        {
          id: 'node-3',
          address: mixerAddr,
          label: 'Tornado.Cash 100 ETH Pool (OFAC)',
          type: 'MIXER',
          chain: 'ethereum',
          balance: '48,200.00 ETH',
          riskScore: 100,
          confidence: 99.9,
          entity: 'Tornado Cash ZK Pool',
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
          value: '173,600.00 ETH',
          currency: 'ETH',
          txHash: '0x8a92fe89c1042b918471c08912ba0918c7a10294b81c4e098712a091847291a1',
          timestamp: '1h 14m ago',
          fee: '0.042 ETH',
          chain: 'ethereum',
          heuristic: 'High-value malicious bridge contract drainage',
          txCount: 3,
          individualTxs: generateCorridorTxs(root, m1, '173,600.00 ETH')
        },
        {
          source: 'node-1',
          target: 'node-2',
          value: '173,580.00 ETH',
          currency: 'ETH',
          txHash: '0x12dc889a7f0912410a82b98417c80912da091847291a12903847291a0982341a',
          timestamp: '48m ago',
          fee: '0.038 ETH',
          chain: 'ethereum',
          heuristic: 'Peeling dispersal into intermediate mules',
          txCount: 3,
          individualTxs: generateCorridorTxs(m1, m2, '173,580.00 ETH')
        },
        {
          source: 'node-2',
          target: 'node-3',
          value: '173,550.00 ETH',
          currency: 'ETH',
          txHash: '0x44ab0912e8124901c08912ba0918c7a10294b81c4e098712a091847291a12903',
          timestamp: '22m ago',
          fee: '0.085 ETH',
          chain: 'ethereum',
          heuristic: 'Contract deposit into Tornado.Cash 100 ETH ZK Pool instance',
          txCount: 3,
          individualTxs: generateCorridorTxs(m2, mixerAddr, '173,550.00 ETH')
        }
      ],
      heuristics: [
        ...BASE_HEURISTICS.map(h => h.code === 'H5_MIXER_HOP' ? { ...h, isTriggered: true, status: 'CRITICAL', badge: 'OFAC SANCTIONED' } : h)
      ]
    };
  }

  // 2. TORNADO CASH MIXER DIRECT SEARCH
  if (lower === '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc' || lower.includes('tornado') || lower.includes('mixer') || lower.includes('12d66')) {
    const root = '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc';
    const d1 = '0x94845333028B1204Fbe14E1278Fd4Adde46B22ce';
    const d2 = '0x889a7c01e389b0991823a451e0892c90aabbccdd';

    return {
      traceId: `TRC-MIXER-${Date.now().toString().slice(-6)}`,
      rootAddress: root,
      targetEntity: 'Tornado Cash (ZK Privacy Pool Router)',
      confidence: 100.0,
      totalHops: 2,
      totalValueStolen: '100.00 ETH (~₹2.78 Crore)',
      timeSpan: '38 Minutes',
      riskScore: 100.0,
      typology: 'ZERO_KNOWLEDGE_ANONYMITY_POOL',
      trailStatus: 'LOST_TO_MIXER',
      trailVerdict: 'Trail Lost: Target is an OFAC-sanctioned zero-knowledge mixing contract. Inbound assets lose verifiable lineage upon deposit.',
      nodes: [
        {
          id: 'node-0',
          address: d1,
          label: 'Suspect Mule Ingress',
          type: 'SUSPECT_BURNER',
          chain: 'ethereum',
          balance: '0.00 ETH',
          riskScore: 96,
          confidence: 100,
          txCount: 23,
          transactions: generateNodeTransactions(d1, 'ethereum', 'SUSPECT_BURNER')
        },
        {
          id: 'node-1',
          address: d2,
          label: 'Intermediate Transit Router',
          type: 'INTERMEDIARY',
          chain: 'ethereum',
          balance: '0.00 ETH',
          riskScore: 98,
          confidence: 99,
          txCount: 23,
          transactions: generateNodeTransactions(d2, 'ethereum', 'INTERMEDIARY')
        },
        {
          id: 'node-2',
          address: root,
          label: 'Tornado Cash: 100 ETH ZK Contract',
          type: 'MIXER',
          chain: 'ethereum',
          balance: '34,910.00 ETH',
          riskScore: 100,
          confidence: 100,
          entity: 'Tornado Cash Router (OFAC Sanctioned)',
          txCount: 23,
          isTerminal: true,
          terminalStatus: 'TRAIL LOST IN MIXER',
          transactions: generateNodeTransactions(root, 'ethereum', 'MIXER')
        }
      ],
      links: [
        {
          source: 'node-0',
          target: 'node-1',
          value: '100.00 ETH',
          currency: 'ETH',
          txHash: '0x8a92fe89c1042b918471c08912ba0918c7a10294b81c4e098712a091847291a1',
          timestamp: '38m ago',
          fee: '0.0021 ETH',
          chain: 'ethereum',
          heuristic: 'Automated wallet sweep',
          txCount: 3,
          individualTxs: generateCorridorTxs(d1, d2, '100.00 ETH')
        },
        {
          source: 'node-1',
          target: 'node-2',
          value: '99.95 ETH',
          currency: 'ETH',
          txHash: '0x12dc889a7f0912410a82b98417c80912da091847291a12903847291a0982341a',
          timestamp: '19m ago',
          fee: '0.0048 ETH',
          chain: 'ethereum',
          heuristic: 'Contract deposit into Tornado.Cash 100 ETH pool',
          txCount: 3,
          individualTxs: generateCorridorTxs(d2, root, '99.95 ETH')
        }
      ],
      heuristics: [
        ...BASE_HEURISTICS.map(h => h.code === 'H5_MIXER_HOP' ? { ...h, isTriggered: true, status: 'CRITICAL', badge: 'SANCTIONED POOL' } : h)
      ]
    };
  }

  // 3. FTX DRAINER ($400M Unauthorized Siphon)
  if (lower === '0x59abf3837fa962d6853b4cc0a19513aa031fd32b' || lower.includes('ftx') || lower.includes('59ab')) {
    const root = '0x59abf3837fa962d6853b4cc0a19513aa031fd32b';
    const dexAddr = '0x1111111254EEB25477B68fb85Ed929f73A960582';
    const bridgeAddr = '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590';

    return {
      traceId: `TRC-FTX-${Date.now().toString().slice(-6)}`,
      rootAddress: root,
      targetEntity: 'FTX Drainer / Multi-Bridge Dispersion',
      confidence: 97.5,
      totalHops: 2,
      totalValueStolen: '21,155.00 ETH (~$38 Million)',
      timeSpan: '2h 45m',
      riskScore: 97.0,
      typology: 'MALICIOUS_DEX_SWAP_BRIDGE_HOP',
      trailStatus: 'CROSS_CHAIN_EXIT',
      trailVerdict: 'Trail Bridged: Assets drained from FTX wallets were converted via 1inch DEX Aggregator and bridged cross-chain to Cosmos/Bitcoin.',
      nodes: [
        {
          id: 'node-0',
          address: root,
          label: 'FTX Accounts Drainer Root',
          type: 'SUSPECT_BURNER',
          chain: 'ethereum',
          balance: '1,420.00 ETH',
          riskScore: 98,
          confidence: 100,
          entity: 'FTX Drainer Primary',
          txCount: 23,
          transactions: generateNodeTransactions(root, 'ethereum', 'SUSPECT_BURNER')
        },
        {
          id: 'node-1',
          address: dexAddr,
          label: '1inch v5 DEX Aggregator',
          type: 'INTERMEDIARY',
          chain: 'ethereum',
          balance: '12,980.00 ETH',
          riskScore: 25,
          confidence: 99,
          entity: '1inch Protocol',
          txCount: 23,
          transactions: generateNodeTransactions(dexAddr, 'ethereum', 'INTERMEDIARY')
        },
        {
          id: 'node-2',
          address: bridgeAddr,
          label: 'Stargate Bridge Router',
          type: 'BRIDGE_LOCK',
          chain: 'ethereum',
          balance: '45,210.00 ETH',
          riskScore: 88,
          confidence: 96,
          entity: 'Cross-Chain Bridge Gateway',
          txCount: 23,
          isTerminal: true,
          terminalStatus: 'CROSS-CHAIN EXIT (COSMOS/BTC)',
          transactions: generateNodeTransactions(bridgeAddr, 'ethereum', 'BRIDGE_LOCK')
        }
      ],
      links: [
        {
          source: 'node-0',
          target: 'node-1',
          value: '21,155.00 ETH',
          currency: 'ETH',
          txHash: '0x59abfe89c1042b918471c08912ba0918c7a10294b81c4e098712a091847291a1',
          timestamp: '2h 45m ago',
          fee: '0.015 ETH',
          chain: 'ethereum',
          heuristic: 'Automated slippage-tolerant DEX liquidation swap',
          txCount: 3,
          individualTxs: generateCorridorTxs(root, dexAddr, '21,155.00 ETH')
        },
        {
          source: 'node-1',
          target: 'node-2',
          value: '21,140.00 ETH',
          currency: 'ETH',
          txHash: '0x12dc889a7f0912410a82b98417c80912da091847291a12903847291a0982341a',
          timestamp: '1h 12m ago',
          fee: '0.022 ETH',
          chain: 'ethereum',
          heuristic: 'Cross-chain lock/mint to non-EVM ledger',
          txCount: 3,
          individualTxs: generateCorridorTxs(dexAddr, bridgeAddr, '21,140.00 ETH'),
          isBridge: true
        }
      ],
      heuristics: BASE_HEURISTICS
    };
  }

  // 4. VITALIK BUTERIN (vitalik.eth - BENIGN VERIFIED PUBLIC)
  if (lower === '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' || lower.includes('vitalik') || lower.includes('d8da')) {
    const root = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    const efVault = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe';
    const gitcoin = '0x13c32e924d5571e22709230536484e56bb3fec3f';

    return {
      traceId: `TRC-VITALIK-ETH`,
      rootAddress: root,
      targetEntity: 'Vitalik Buterin (vitalik.eth - Verified Co-Founder)',
      confidence: 100.0,
      totalHops: 2,
      totalValueStolen: '0.00 ETH (Benign / Public Figure)',
      timeSpan: 'Continuous Active',
      riskScore: 0.0,
      typology: 'VERIFIED_PUBLIC_FIGURE_DONATION_HUB',
      trailStatus: 'VERIFIED_PUBLIC',
      trailVerdict: 'Safe / Benign Entity: Address verified as Vitalik Buterin (vitalik.eth). Outflows represent philanthropic grants and protocol stewardship.',
      nodes: [
        {
          id: 'node-0',
          address: root,
          label: 'vitalik.eth (Vitalik Buterin)',
          type: 'BENIGN_PUBLIC',
          chain: 'ethereum',
          balance: '6.71 ETH',
          riskScore: 0.0,
          confidence: 100,
          entity: 'Ethereum Co-Founder',
          txCount: 23,
          transactions: generateNodeTransactions(root, 'ethereum', 'BENIGN_PUBLIC')
        },
        {
          id: 'node-1',
          address: efVault,
          label: 'Ethereum Foundation Treasury',
          type: 'VERIFIED_ENTITY',
          chain: 'ethereum',
          balance: '284,190.00 ETH',
          riskScore: 0.0,
          confidence: 100,
          entity: 'Ethereum Foundation',
          txCount: 23,
          transactions: generateNodeTransactions(efVault, 'ethereum', 'VERIFIED_ENTITY')
        },
        {
          id: 'node-2',
          address: gitcoin,
          label: 'Gitcoin Community Grants Multisig',
          type: 'VERIFIED_ENTITY',
          chain: 'ethereum',
          balance: '4,250.00 ETH',
          riskScore: 0.0,
          confidence: 100,
          entity: 'Gitcoin Public Goods',
          txCount: 23,
          isTerminal: true,
          terminalStatus: 'VERIFIED PUBLIC ENTITY',
          transactions: generateNodeTransactions(gitcoin, 'ethereum', 'VERIFIED_ENTITY')
        }
      ],
      links: [
        {
          source: 'node-0',
          target: 'node-1',
          value: '100.00 ETH',
          currency: 'ETH',
          txHash: '0x18fbf4798992552d03c80a474f2c5b42dfe67a1bbfcba6cacec93268f083cbab',
          timestamp: '2d ago',
          fee: '0.0008 ETH',
          chain: 'ethereum',
          heuristic: 'Ecosystem support transfer',
          txCount: 3,
          individualTxs: generateCorridorTxs(root, efVault, '100.00 ETH')
        },
        {
          source: 'node-0',
          target: 'node-2',
          value: '50.00 ETH',
          currency: 'ETH',
          txHash: '0x77ab1289c0912ba0918c7a10294b81c4e098712a091847291a12903847291a09',
          timestamp: '5d ago',
          fee: '0.0011 ETH',
          chain: 'ethereum',
          heuristic: 'Public goods matching round donation',
          txCount: 3,
          individualTxs: generateCorridorTxs(root, gitcoin, '50.00 ETH')
        }
      ],
      heuristics: BASE_HEURISTICS.map(h => ({ ...h, isTriggered: false, status: 'CLEAN', badge: 'VERIFIED SAFE' }))
    };
  }

  // 5. BINANCE HOT WALLET 14
  if (lower === '0x28c6c06298d514db089934071355e5743bf21d60' || lower.includes('binance') || lower.includes('28c6')) {
    const root = '0x28C6c06298d514Db089934071355E5743bf21d60';
    const dep1 = '0x991823a451e0892c90aabbccdd11223344556677';

    return {
      traceId: `TRC-BINANCE-14`,
      rootAddress: root,
      targetEntity: 'Binance Hot Wallet 14 (FIU-IND Reg #0089)',
      confidence: 99.9,
      totalHops: 1,
      totalValueStolen: '0.00 ETH (Exchange Operating Reserves)',
      timeSpan: 'Live Mempool',
      riskScore: 12.0,
      typology: 'REGULATED_EXCHANGE_HOT_WALLET',
      trailStatus: 'VASP_DEPOSIT',
      trailVerdict: 'Regulated VASP: High-frequency custodial hot wallet operated by Binance. Registered with FIU-IND under registration FIU-IND/VDA/2024/0089.',
      nodes: [
        {
          id: 'node-0',
          address: dep1,
          label: 'Customer Deposit Tag (KYC Linked)',
          type: 'EXCHANGE_DEPOSIT',
          chain: 'ethereum',
          balance: '0.00 ETH',
          riskScore: 65,
          confidence: 98,
          txCount: 23,
          transactions: generateNodeTransactions(dep1, 'ethereum', 'EXCHANGE_DEPOSIT')
        },
        {
          id: 'node-1',
          address: root,
          label: 'Binance Hot Wallet 14',
          type: 'EXCHANGE_HOT',
          chain: 'ethereum',
          balance: '482,910.00 ETH',
          riskScore: 12,
          confidence: 100,
          entity: 'Binance Global / FIU-IND #0089',
          txCount: 23,
          isTerminal: true,
          terminalStatus: 'ACTIONABLE AT VASP (BINANCE)',
          transactions: generateNodeTransactions(root, 'ethereum', 'EXCHANGE_HOT')
        }
      ],
      links: [
        {
          source: 'node-0',
          target: 'node-1',
          value: '45.00 ETH',
          currency: 'ETH',
          txHash: '0x28c6fe89c1042b918471c08912ba0918c7a10294b81c4e098712a091847291a1',
          timestamp: '6m ago',
          fee: '0.0004 ETH',
          chain: 'ethereum',
          heuristic: 'Automated exchange aggregation sweep',
          txCount: 3,
          individualTxs: generateCorridorTxs(dep1, root, '45.00 ETH')
        }
      ],
      heuristics: BASE_HEURISTICS
    };
  }

  // 6. BITCOIN CASE (Dr. Ramesh Narayan / CoinDCX)
  if (lower.startsWith('bc1') || lower.startsWith('1') || lower.startsWith('3') || lower.includes('ramesh')) {
    const root = addr || 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';
    const btcInter = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    const coindcxVault = '0xCoinDCX_Vault_01824a91';

    return {
      traceId: `TRC-BTC-${Date.now().toString().slice(-6)}`,
      rootAddress: root,
      targetEntity: 'CoinDCX (Neblio Technologies Pvt. Ltd.)',
      confidence: 95.8,
      totalHops: 2,
      totalValueStolen: '3.45 BTC (~₹1.98 Crore)',
      timeSpan: '1h 22m',
      riskScore: 88.0,
      typology: 'UTXO_CONSOLIDATION_VASP_DEPOSIT',
      trailStatus: 'VASP_DEPOSIT',
      trailVerdict: 'Actionable Trail: Stolen UTXOs consolidated and deposited into CoinDCX KYC customer deposit account. Ready for Section 94 BNSS freeze dispatch.',
      nodes: [
        {
          id: 'node-0',
          address: root,
          label: 'Suspect Root (Bitcoin Drainage)',
          type: 'VICTIM',
          chain: 'bitcoin',
          balance: '0.0001 BTC',
          riskScore: 88,
          confidence: 100,
          txCount: 23,
          transactions: generateNodeTransactions(root, 'bitcoin', 'VICTIM')
        },
        {
          id: 'node-1',
          address: btcInter,
          label: 'UTXO Peel Intermediary',
          type: 'INTERMEDIARY',
          chain: 'bitcoin',
          balance: '0.0000 BTC',
          riskScore: 82,
          confidence: 96,
          txCount: 23,
          transactions: generateNodeTransactions(btcInter, 'bitcoin', 'INTERMEDIARY')
        },
        {
          id: 'node-2',
          address: coindcxVault,
          label: 'CoinDCX Hot Vault (FIU Reg #0002)',
          type: 'EXCHANGE_HOT',
          chain: 'bitcoin',
          balance: '142.50 BTC',
          riskScore: 12,
          confidence: 99.5,
          entity: 'CoinDCX (FIU-IND/VDA/2023/0002)',
          txCount: 23,
          isTerminal: true,
          terminalStatus: 'ACTIONABLE AT VASP (COINDCX)',
          transactions: generateNodeTransactions(coindcxVault, 'bitcoin', 'EXCHANGE_HOT')
        }
      ],
      links: [
        {
          source: 'node-0',
          target: 'node-1',
          value: '3.45 BTC',
          currency: 'BTC',
          txHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
          timestamp: '1h 22m ago',
          fee: '0.00012 BTC',
          chain: 'bitcoin',
          heuristic: 'UTXO consolidation transfer',
          txCount: 3,
          individualTxs: generateCorridorTxs(root, btcInter, '3.45 BTC', 'bitcoin')
        },
        {
          source: 'node-1',
          target: 'node-2',
          value: '3.448 BTC',
          currency: 'BTC',
          txHash: '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
          timestamp: '34m ago',
          fee: '0.00015 BTC',
          chain: 'bitcoin',
          heuristic: 'Direct transfer to CoinDCX deposit wallet',
          txCount: 3,
          individualTxs: generateCorridorTxs(btcInter, coindcxVault, '3.448 BTC', 'bitcoin')
        }
      ],
      heuristics: BASE_HEURISTICS
    };
  }

  // 7. DEFAULT / DYNAMIC ARBITRARY ADDRESS CRAWL
  // Generates custom, non-static topology uniquely derived from the searched address
  const root = addr || '0x71C8364...a812';
  const effectiveChain: ChainType = (root.startsWith('bc1') || root.startsWith('1') || root.startsWith('3')) ? 'bitcoin' : chain;
  const symbol = effectiveChain === 'bitcoin' ? 'BTC' : 'ETH';

  // Deterministically compute custom values from address bytes
  let seed = 0;
  for (let i = 0; i < root.length; i++) {
    seed = (seed * 31 + root.charCodeAt(i)) & 0xffffffff;
  }
  const absSeed = Math.abs(seed);
  const stolenAmountNum = ((absSeed % 450) / 10 + 1.25).toFixed(2);
  const hopCount = (absSeed % 3) + 2; // 2, 3, or 4 hops
  const riskVal = 85 + (absSeed % 14);

  const h1 = `0x${((absSeed * 11) % 0xffffffffffff).toString(16).padStart(12, '0')}881c${root.slice(-4)}`;
  const h2 = `0x${((absSeed * 17) % 0xffffffffffff).toString(16).padStart(12, '1')}77ab${root.slice(-4)}`;
  const terminalAddr = `0x${((absSeed * 29) % 0xffffffffffff).toString(16).padStart(12, '2')}99dc${root.slice(-4)}`;

  return {
    traceId: `TRC-${root.slice(0, 6)}-${Date.now().toString().slice(-4)}`,
    rootAddress: root,
    targetEntity: `Cluster Hop #${hopCount} (${terminalAddr.slice(0, 8)}...)`,
    confidence: 94.2,
    totalHops: hopCount,
    totalValueStolen: `${stolenAmountNum} ${symbol}`,
    timeSpan: `${15 + (absSeed % 45)} Minutes`,
    riskScore: riskVal,
    typology: hopCount >= 3 ? 'AUTOMATED_PEELING_LAYER' : 'RAPID_DISPERSION_HOP',
    trailStatus: 'UNSPENT_BURNER',
    trailVerdict: `Forensic Trail Active: Traced across ${hopCount} peeling hops from root ${root.slice(0, 10)}... Assets currently parked at burner ${terminalAddr.slice(0, 10)}...`,
    nodes: [
      {
        id: 'node-0',
        address: root,
        label: `Suspect Origin (${root.slice(0, 8)}...)`,
        type: 'VICTIM',
        chain: effectiveChain,
        balance: `0.005 ${symbol}`,
        riskScore: 88,
        confidence: 100,
        txCount: 23,
        transactions: generateNodeTransactions(root, effectiveChain, 'VICTIM')
      },
      {
        id: 'node-1',
        address: h1,
        label: `Mule Transit 1 (${h1.slice(0, 8)}...)`,
        type: 'SUSPECT_BURNER',
        chain: effectiveChain,
        balance: `0.001 ${symbol}`,
        riskScore: 91,
        confidence: 97,
        txCount: 23,
        transactions: generateNodeTransactions(h1, effectiveChain, 'SUSPECT_BURNER')
      },
      {
        id: 'node-2',
        address: h2,
        label: `Peel Layer 2 (${h2.slice(0, 8)}...)`,
        type: 'INTERMEDIARY',
        chain: effectiveChain,
        balance: `0.000 ${symbol}`,
        riskScore: 89,
        confidence: 95,
        txCount: 23,
        transactions: generateNodeTransactions(h2, effectiveChain, 'INTERMEDIARY')
      },
      {
        id: 'node-3',
        address: terminalAddr,
        label: `Terminal Burner (${terminalAddr.slice(0, 8)}...)`,
        type: 'SUSPECT_BURNER',
        chain: effectiveChain,
        balance: `${stolenAmountNum} ${symbol}`,
        riskScore: 94,
        confidence: 96,
        txCount: 23,
        isTerminal: true,
        terminalStatus: 'UNSPENT IN BURNER',
        transactions: generateNodeTransactions(terminalAddr, effectiveChain, 'SUSPECT_BURNER')
      }
    ],
    links: [
      {
        source: 'node-0',
        target: 'node-1',
        value: `${stolenAmountNum} ${symbol}`,
        currency: symbol,
        txHash: `0x${root.slice(2, 8)}fe${h1.slice(2, 8)}918471c08912ba0918c7a102`,
        timestamp: '32m ago',
        fee: `0.0019 ${symbol}`,
        chain: effectiveChain,
        heuristic: 'Initial wallet balance drain',
        txCount: 3,
        individualTxs: generateCorridorTxs(root, h1, `${stolenAmountNum} ${symbol}`, effectiveChain)
      },
      {
        source: 'node-1',
        target: 'node-2',
        value: `${(parseFloat(stolenAmountNum) * 0.98).toFixed(2)} ${symbol}`,
        currency: symbol,
        txHash: `0x${h1.slice(2, 8)}aa${h2.slice(2, 8)}918471c08912ba0918c7a102`,
        timestamp: '18m ago',
        fee: `0.0015 ${symbol}`,
        chain: effectiveChain,
        heuristic: 'Peeling chain dispersion',
        txCount: 3,
        individualTxs: generateCorridorTxs(h1, h2, `${(parseFloat(stolenAmountNum) * 0.98).toFixed(2)} ${symbol}`, effectiveChain)
      },
      {
        source: 'node-2',
        target: 'node-3',
        value: `${(parseFloat(stolenAmountNum) * 0.97).toFixed(2)} ${symbol}`,
        currency: symbol,
        txHash: `0x${h2.slice(2, 8)}cc${terminalAddr.slice(2, 8)}918471c08912ba0918c7a102`,
        timestamp: '7m ago',
        fee: `0.0012 ${symbol}`,
        chain: effectiveChain,
        heuristic: 'Consolidation into holding burner',
        txCount: 3,
        individualTxs: generateCorridorTxs(h2, terminalAddr, `${(parseFloat(stolenAmountNum) * 0.97).toFixed(2)} ${symbol}`, effectiveChain)
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
    suspectAddress: '0x098b716b8aaf21512996dc57eb0615e2383e2f96',
    chain: 'ethereum',
    amount: '173,600.00 ETH (~$624 Million)',
    reportedAt: '42m ago',
    status: 'TRACING',
    targetVASP: 'Tornado Cash (ZK Pool)',
    riskScore: 0.99,
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
