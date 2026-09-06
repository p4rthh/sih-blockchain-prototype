import { Complaint, CourtDossier, TraceGraphData, VASPRegistryEntry } from '../types/forensics';

export const MOCK_VASPS: VASPRegistryEntry[] = [
  {
    id: 'vasp-wazirx',
    name: 'WazirX',
    legalEntity: 'Zanmai Labs Pvt. Ltd.',
    jurisdiction: 'Mumbai, MH, India',
    fiuStatus: 'REGISTERED',
    fiuRegNumber: 'FIU-IND/VDA/2023/0014',
    nodalOfficer: 'Prateek S. (Legal Compliance)',
    nodalEmail: 'nodal-law@wazirx.com',
    emergencyPhone: '+91 22 6842 1900',
    freezeSlaHours: 24,
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
    freezeSlaHours: 12,
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
    freezeSlaHours: 24,
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
    freezeSlaHours: 48,
    chains: ['ethereum', 'bsc', 'bitcoin', 'tron'],
    knownHotWallets: [
      '0x28C6c06298d514Db089934071355E5743bf21d60',
      '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d'
    ],
    depositCount24h: 18450,
    compliancePortalUrl: 'https://leap.binance.com'
  }
];

export const MOCK_TRACE_GRAPH: TraceGraphData = {
  traceId: 'TRC-2026-ETH-9902',
  rootAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  targetEntity: 'WazirX (Zanmai Labs)',
  confidence: 91.4,
  totalHops: 4,
  totalValueStolen: '12.50 ETH (~₹34.8 Lakhs)',
  timeSpan: '1 Hour 15 Minutes',
  riskScore: 94,
  typology: 'CROSS_CHAIN_PEEL_CHAIN_CONSOLIDATION',
  nodes: [
    {
      id: 'node-0',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      label: 'Victim Wallet (Complainant)',
      type: 'VICTIM',
      chain: 'ethereum',
      balance: '0.04 ETH',
      riskScore: 5,
      confidence: 100,
      txCount: 38
    },
    {
      id: 'node-1',
      address: '0x3b11e299f18a24c08821049b8a31e847',
      label: 'Suspect Burner Drain (#00)',
      type: 'SUSPECT_BURNER',
      chain: 'ethereum',
      balance: '0.00 ETH',
      riskScore: 95,
      confidence: 99.4,
      clusterId: 'Lazarus-Sub-B',
      txCount: 2
    },
    {
      id: 'node-2',
      address: '0x889a7c01e389b0991823a451e0892c90',
      label: 'Burner Transit Hop (#01)',
      type: 'INTERMEDIARY',
      chain: 'ethereum',
      balance: '0.01 ETH',
      riskScore: 88,
      confidence: 96.2,
      txCount: 4
    },
    {
      id: 'node-3',
      address: '0x44abe812c30089f2a00192b0c391a082',
      label: 'Multichain Bridge Lock Contract',
      type: 'BRIDGE_LOCK',
      chain: 'ethereum',
      balance: '14,200.00 ETH',
      riskScore: 75,
      confidence: 98.0,
      entity: 'Multichain Router',
      txCount: 140920
    },
    {
      id: 'node-4',
      address: '0x99fea30248e91024bc019385b018c091',
      label: 'BSC Cross-Chain Mint Recipient',
      type: 'BRIDGE_MINT',
      chain: 'bsc',
      balance: '0.05 BNB',
      riskScore: 92,
      confidence: 94.0,
      txCount: 3
    },
    {
      id: 'node-5',
      address: '0xWAZIRX_HOT_091B88102a9b',
      label: 'WazirX Terminal Deposit Hot Vault',
      type: 'EXCHANGE_HOT',
      chain: 'bsc',
      balance: '4,850,210 USDT',
      riskScore: 30,
      confidence: 91.4,
      entity: 'WazirX / Zanmai Labs',
      txCount: 894002,
      isTerminal: true
    }
  ],
  links: [
    {
      source: 'node-0',
      target: 'node-1',
      value: '12.5000 ETH',
      currency: 'ETH',
      txHash: '0x8a92...1c4b',
      timestamp: '15-AUG 14:22:04 IST',
      fee: '24.2 Gwei',
      chain: 'ethereum',
      heuristic: 'H0: Unauthorized Account Drain'
    },
    {
      source: 'node-1',
      target: 'node-2',
      value: '12.4882 ETH',
      currency: 'ETH',
      txHash: '0x12dc...f990',
      timestamp: '15-AUG 14:38:19 IST',
      fee: '18.5 Gwei',
      chain: 'ethereum',
      heuristic: 'H1: Peel Chain Salami Layering'
    },
    {
      source: 'node-2',
      target: 'node-3',
      value: '12.4500 ETH',
      currency: 'ETH',
      txHash: '0x44ab...e812',
      timestamp: '15-AUG 15:02:44 IST',
      fee: '32.1 Gwei',
      chain: 'ethereum',
      isBridge: true,
      heuristic: 'H2: Cross-Chain State Bridge Lock'
    },
    {
      source: 'node-3',
      target: 'node-4',
      value: '41,200.54 USDT',
      currency: 'USDT',
      txHash: '0x66c8...09ab',
      timestamp: '15-AUG 15:04:52 IST',
      fee: '0.002 BNB',
      chain: 'bsc',
      isBridge: true,
      heuristic: 'H2: Probabilistic Lock-Mint Corroboration'
    },
    {
      source: 'node-4',
      target: 'node-5',
      value: '41,200.54 USDT',
      currency: 'USDT',
      txHash: '0x99fe...a302',
      timestamp: '15-AUG 15:19:12 IST',
      fee: '5.0 Gwei',
      chain: 'bsc',
      heuristic: 'H4: GraphSAGE Exchange Sweeper Attribution'
    }
  ]
};

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2026-9041',
    acknowledgementNo: 'NCRP/2026/DEL/098412',
    firNumber: 'FIR #402/2026',
    policeStation: 'Bandra Cyber Cell, Mumbai Zone',
    victimName: 'Sanjay Deshmukh',
    suspectAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    chain: 'ethereum',
    amount: '12.50 ETH (₹34,85,000)',
    reportedAt: '15-AUG-2026 14:45 IST',
    status: 'ATTRIBUTED',
    targetVASP: 'WazirX (Zanmai Labs)',
    riskScore: 94,
    ioName: 'Insp. R. Sharma',
    zone: 'Mumbai Cyber Command'
  },
  {
    id: 'CMP-2026-8812',
    acknowledgementNo: 'NCRP/2026/BLR/074129',
    firNumber: 'FIR #118/2026',
    policeStation: 'Koramangala Cyber Cell, Bengaluru',
    victimName: 'Ananya Rao',
    suspectAddress: 'bc1q9x448a0029bcf8821a3840291ba',
    chain: 'bitcoin',
    amount: '1.45 BTC (₹72,50,000)',
    reportedAt: '16-AUG-2026 10:12 IST',
    status: 'FROZEN',
    targetVASP: 'CoinDCX',
    riskScore: 98,
    ioName: 'Sub-Insp. V. Nair',
    zone: 'Bengaluru Zone 1'
  },
  {
    id: 'CMP-2026-9104',
    acknowledgementNo: 'NCRP/2026/HYD/110294',
    firNumber: 'FIR #89/2026',
    policeStation: 'Cyberabad Police Commissionerate',
    victimName: 'M. Venkat Reddy',
    suspectAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    chain: 'tron',
    amount: '65,000 USDT (₹54,20,000)',
    reportedAt: '16-AUG-2026 12:30 IST',
    status: 'TRACING',
    targetVASP: 'Binance India',
    riskScore: 89,
    ioName: 'Insp. K. Praveen',
    zone: 'Telangana Cyber Security'
  },
  {
    id: 'CMP-2026-9140',
    acknowledgementNo: 'NCRP/2026/DEL/120934',
    firNumber: 'FIR #512/2026',
    policeStation: 'IFSO Special Cell, Delhi Police',
    victimName: 'Rohit Aggarwal',
    suspectAddress: '0xDEF992148a7b0294819a8bc8192a0',
    chain: 'ethereum',
    amount: '4.80 ETH (₹13,40,000)',
    reportedAt: '16-AUG-2026 15:45 IST',
    status: 'QUEUED',
    riskScore: 72,
    ioName: 'ACP Amit Verma',
    zone: 'Delhi IFSO'
  }
];

export const MOCK_DOSSIER: CourtDossier = {
  caseRef: 'CC-MUM-2026-0941',
  firNumber: 'FIR #402/2026 Bandra PS',
  suspectTargetId: 'TGT-ETH-892 (Cluster: Lazarus Sub-Branch B)',
  investigatingOfficer: 'Insp. R. Sharma (Cyber Unit 47-B)',
  unit: 'HQ-47 // Sahyog LEO Unit // Mumbai Cyber Command',
  sha256Digest: '7e43f1b0a9c84e1b8c19ad4ef0816dfb7762a4d3f545464cb3d16298e3b2e773',
  ipfsCid: 'bafybeihdwdcefgh4637910zkv4982a0b1824a91823bc',
  synopsisEn: 'On 15th August 2026, 12.5 ETH was exfiltrated from complainant wallet (0x742d...44e) following an unauthorized credential phishing breach. The stolen collateral was traced through 3 burner hops, bridged to BSC network via Multichain-Mimic router, and terminated at WazirX Hot Wallet (0xWAZIRX_HOT_091B). Automated gas payer links indicate centralized laundering infrastructure operated under syndicate directive.',
  synopsisHi: '15 अगस्त 2026 को संदिग्ध वॉलेट द्वारा 12.5 ETH अंतरित किए गए। साइबर अनुसंधान विंग द्वारा उक्त धनराशि को 3 हॉप्स के माध्यम से वज़ीरएक्स एक्सचेंज हॉट वॉलेट में जमा किए जाने की 87% पुष्टि की गई है। वित्तीय सूचना इकाई (FIU-IND) अधिदेश के तहत आरोपी खाते की त्वरित जब्ती एवं पहचान विवरण (KYC) धारा 91 सीआरपीसी / बीएनएसएस धारा 94 के अंतर्गत तलब किए जाने योग्य हैं।',
  traceData: MOCK_TRACE_GRAPH,
  assignedVASP: MOCK_VASPS[0],
  section94NoticePreview: `TO: THE COMPLIANCE OFFICER, ZANMAI LABS PVT LTD (WAZIRX).
UNDER POWERS CONFERRED UNDER SECTION 94 OF BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023 / SECTION 91 OF CODE OF CRIMINAL PROCEDURE (CRPC), 1973:

YOU ARE HEREBY ORDERED TO IMMEDIATELY RESTRAIN AND FREEZE ALL OUTWARD TRADING, FIAT WITHDRAWALS, AND ON-CHAIN TRANSFERS ASSOCIATED WITH DEPOSIT HASH 0x99fe...a302 (USDT 41,200.54) AND FURNISH COMPLETE KYC (AADHAAR, PAN, BANK PARTICULARS, AND IP ACCESS LOGS) WITHIN 24 HOURS OF RECEIPT HEREOF.

BY ORDER OF INVESTIGATING OFFICER, CYBER CRIME CELL, MUMBAI.`,
  isSigned: true,
  generatedAt: '15-AUG-2026 16:04:22 IST'
};
