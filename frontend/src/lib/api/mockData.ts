import { Complaint, CourtDossier, FlowTransaction, NodeType, TraceGraphData, VASPRegistryEntry, ChainType } from '../types/forensics';

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
      '0x5ACe48b8E8A5E44598F1c667a421b4A59714Da31',
      '0x91d90479d20c5d57d76d4981d3f0cbdfd55b85d0',
      '0x27C703D144C33b79310C3691656A8F08',
      '0x721931508df476575964705339a5b9d2',
      '0x3456789012345678901234567890123456789012',
      '0x1111111254fb6c44bac0bed2854e76f90643097d',
      '0x2B591e99afE9f32eAA6214f7B7629768c40Eeb39',
      '0xWAZIRX_HOT_091B88102a9b',
      '0xc4c73eeef851cd63756fb607147b4d34ebfe458e',
      '0x9012345678901234567890123456789012345678',
      '0x876f2a8910dca298b31a01290812984180419283',
      '0x48a8342795cf64931a28a38c20188d3e2a2c070c'
    ],
    depositCount24h: 4820,
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
    chains: ['ethereum', 'bitcoin', 'tron', 'bsc'],
    knownHotWallets: [
      '0x7890123456789012345678901234567890123456',
      '0x8894e0a0c962cb723c19fc560899dd33e0047745',
      '0xCoinDCX_Vault_01824a91',
      '0x876f2a8910dca298b31a',
      '0xa1b2c3d4e5f60718293a4b5c6d7e8f9012345678',
      '0x43842f4f5459345e65660b45b596200219c670a4',
      'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      'bc1q7w00m97c0ygyvdgl30kclz6vwhc4tgy4966wue'
    ],
    depositCount24h: 6190,
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
    chains: ['ethereum', 'bitcoin', 'bsc', 'tron'],
    knownHotWallets: [
      '0x4b43343469e38d62A9fD9d685210B39f045053B2',
      '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      '0x0f2b3e4d5a6c7b8d9e0f1a2b3c4d5e6f7a8b9c0d',
      '0xCoinSwitch_Treasury_4a82',
      '0x7a9c8b7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b',
      'bc1q0switchkuber99128374619283746192837461'
    ],
    depositCount24h: 3910,
    compliancePortalUrl: 'https://sahyog.i4c.gov.in/vasp/coinswitch'
  },
  {
    id: 'vasp-zebpay',
    name: 'ZebPay',
    legalEntity: 'Awlencan Innovations India Ltd.',
    jurisdiction: 'Ahmedabad / Mumbai, India',
    fiuStatus: 'REGISTERED',
    fiuRegNumber: 'FIU-IND/VDA/2023/0003',
    nodalOfficer: 'Shri Vikramaditya Sharma (Chief Compliance Officer)',
    nodalEmail: 'compliance-desk@zebpay.com',
    emergencyPhone: '+91 79 6777 4400',
    freezeSlaHours: 6,
    chains: ['ethereum', 'bitcoin'],
    knownHotWallets: [
      '0x2d816a7f34c20e5886d34b179e09581970b54321',
      '0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d',
      'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
    ],
    depositCount24h: 1420,
    compliancePortalUrl: 'https://zebpay.com/regulatory-requests'
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
      '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549',
      '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d',
      '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
      '0x56ed3064a3f9149576f4e69b0eb2f27718be6107',
      '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
      'bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h'
    ],
    depositCount24h: 18450,
    compliancePortalUrl: 'https://leap.binance.com'
  },
  {
    id: 'vasp-mudrex',
    name: 'Mudrex',
    legalEntity: 'Mudrex Wealth Technologies Pvt. Ltd.',
    jurisdiction: 'Bengaluru, KA, India',
    fiuStatus: 'REGISTERED',
    fiuRegNumber: 'FIU-IND/VDA/2023/0004',
    nodalOfficer: 'Shri Alok Kumar (Compliance Lead)',
    nodalEmail: 'compliance@mudrex.com',
    emergencyPhone: '+91 80 4718 9100',
    freezeSlaHours: 4,
    chains: ['ethereum', 'bitcoin', 'tron'],
    knownHotWallets: [
      '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
      '0xa4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5'
    ],
    depositCount24h: 850,
    compliancePortalUrl: 'https://mudrex.com/lea'
  },
  {
    id: 'vasp-bitbns',
    name: 'Bitbns',
    legalEntity: 'Buyhatke Internet Pvt. Ltd.',
    jurisdiction: 'Bengaluru, KA, India',
    fiuStatus: 'REGISTERED',
    fiuRegNumber: 'FIU-IND/VDA/2023/0019',
    nodalOfficer: 'Shri Gaurav Dahake (Regulatory Authority)',
    nodalEmail: 'compliance-leo@bitbns.com',
    emergencyPhone: '+91 80 4718 5500',
    freezeSlaHours: 2,
    chains: ['ethereum', 'bsc', 'bitcoin'],
    knownHotWallets: [
      '0x524b07ebf058097d76cbfa0fdcfd6b83f0ad9c3b',
      '0x71b835e5d16d03f0b2f7f91757d5cb18e2bf451e'
    ],
    depositCount24h: 1120,
    compliancePortalUrl: 'https://bitbns.com/law-enforcement'
  },
  {
    id: 'vasp-giottus',
    name: 'Giottus',
    legalEntity: 'Giottus Technologies Pvt. Ltd.',
    jurisdiction: 'Chennai, TN, India',
    fiuStatus: 'REGISTERED',
    fiuRegNumber: 'FIU-IND/VDA/2023/0022',
    nodalOfficer: 'Shri Vikram Subburaj (CEO & LEA Liaison)',
    nodalEmail: 'compliance@giottus.com',
    emergencyPhone: '+91 44 4855 2200',
    freezeSlaHours: 3,
    chains: ['ethereum', 'bitcoin', 'bsc', 'tron'],
    knownHotWallets: [
      '0xa7c2b3d4e5f61728394a5b6c7d8e9f0123456789',
      '0x38b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9'
    ],
    depositCount24h: 940,
    compliancePortalUrl: 'https://giottus.com/compliance-lea'
  },
  {
    id: 'vasp-unocoin',
    name: 'Unocoin',
    legalEntity: 'Unocoin Technologies Pvt. Ltd.',
    jurisdiction: 'Bengaluru, KA, India',
    fiuStatus: 'REGISTERED',
    fiuRegNumber: 'FIU-IND/VDA/2023/0007',
    nodalOfficer: 'Shri Sathvik Vishwanath (Director)',
    nodalEmail: 'nodal@unocoin.com',
    emergencyPhone: '+91 80 4719 8800',
    freezeSlaHours: 4,
    chains: ['ethereum', 'bitcoin'],
    knownHotWallets: [
      '0x19a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0'
    ],
    depositCount24h: 620,
    compliancePortalUrl: 'https://unocoin.com/in/legal/lea-portal'
  },
  {
    id: 'vasp-kucoin',
    name: 'KuCoin India',
    legalEntity: 'Peken Global Limited (FIU Registered)',
    jurisdiction: 'Offshore (FIU-IND Reporting)',
    fiuStatus: 'REGISTERED',
    fiuRegNumber: 'FIU-IND/VDA/2024/0094',
    nodalOfficer: 'Enforcement Division South Asia',
    nodalEmail: 'compliance-in@kucoin.com',
    emergencyPhone: '+1 888 294 1188',
    freezeSlaHours: 12,
    chains: ['ethereum', 'bitcoin', 'bsc', 'tron'],
    knownHotWallets: [
      '0x163a3d582852eb8ef41ec61204689622d8fd8b7c',
      '0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43'
    ],
    depositCount24h: 14200,
    compliancePortalUrl: 'https://kucoin.com/land/law-enforcement-request'
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
        : nodeType === 'EXCHANGE_HOT' || nodeType === 'EXCHANGE_DEPOSIT'
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
  const symbol = chain === 'bitcoin' ? 'BTC' : (chain === 'bsc' ? 'BNB' : 'ETH');
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

// 1. EXACT 7-NODE LAZARUS GROUP TOPOLOGY (From Backend Engine)
export const EXACT_LAZARUS_TRACE: TraceGraphData = {
  "traceId": "TRC-LIVE-690B2645",
  "rootAddress": "0x098b716b8aaf21512996dc57eb0615e2383e2f96",
  "targetEntity": "OFAC Sanctioned Mixer Pool (Trail Lost)",
  "confidence": 95.0,
  "totalHops": 6,
  "totalValueStolen": "116553.2655 ETH (Recent Flow)",
  "timeSpan": "Real-time on-chain",
  "riskScore": 94.0,
  "typology": "PEEL_CHAIN",
  "nodes": [
    {
      "id": "node-0xb66cd966",
      "address": "0xb66cd966670d962C227B3EABA30a872DbFb995db",
      "label": "Victim (0xb66c...95db)",
      "type": "VICTIM",
      "chain": "ethereum",
      "balance": "Verified",
      "riskScore": 0.03,
      "confidence": 0.92,
      "entity": "Complainant Origin / Stolen Funds Source",
      "txCount": 1,
      "isTerminal": false,
      "transactions": [
        {
          "hash": "0x1b25e6ad8a3344a18a23cffeda2759e8e7d7848115d7196045a5cff0ad2c77fa",
          "from": "0x087238209BaC1D2985b12d7A4bE5bd75daA17243",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00000 ETH",
          "timestamp": "2026-07-27 10:14 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x3ea22b4718f60851bdf4e54a2529bf9759775a419d7d8343f1b4381b2e151796",
          "from": "0x8C75aD518Dce956b488AB65E36aB229d8664BF29",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00001 ETH",
          "timestamp": "2026-04-09 12:21 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x74f7fbfe5a0bd3ef2189619497d9c8445a0b8e6d5630e490534a3d2b6924ac33",
          "from": "0xE546480138D50Bb841B204691C39cC514858d101",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00008 ETH",
          "timestamp": "2025-03-01 20:12 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x6cbd30d24ef00f00763617f75ac1c56fc6d41320cb11326df9603cb73932aa55",
          "from": "0xFc3Ff9d9Abd3ABADda68821e443779bEb1082f43",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0005 ETH",
          "fee": "0.00006 ETH",
          "timestamp": "2024-08-06 18:16 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xb37bc24d865a8021425dff01cd6cc7673010cb7642cd7c73be728cea8fda0dae",
          "from": "0x09564aC9288eD66bD32E793E76ce4336C1a9eD00",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00008 ETH",
          "timestamp": "2024-05-13 23:33 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x7411f1ed289a955e91e5074c75d4af832517dc79e01a3d0530ceb7f2123cb26a",
          "from": "0xbc25D517cc9d7eA453622dEd3213302dE34d29Eb",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00056 ETH",
          "timestamp": "2024-04-04 03:01 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xceb93d896a12e23cf1dc13b7569bc82c9428cd978d2fe9735b6b0b4d7bfe4795",
          "from": "0xdf225c04450504e9198569982c98De2e15b9DF2A",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00049 ETH",
          "timestamp": "2024-04-04 02:48 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x229e7814c872cc447940e00bf5923cbbb95cf9975f8e24b1ea1c30f41d6a1956",
          "from": "0xE129927cfC61CE2F0b2a0CA6d8f9482D4ee60c64",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "2.0000 ETH",
          "fee": "0.00061 ETH",
          "timestamp": "2024-02-24 03:50 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x25e27694fe23b4e5ec01f0ca0ba4966bb4e7c9afd95174d3b80f98e54ad6b2b3",
          "from": "0x4E5B2e1dc63F6b91cb6Cd759936495434C7e972F",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0091 ETH",
          "fee": "0.00029 ETH",
          "timestamp": "2023-10-25 02:46 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xf597722f3619a0aae57e97e6c4b8adc1b354e8f966861b13c146b40b97d7d062",
          "from": "0x9e40b3eCeC1bE687053326c0c3Fe51AcA69eB8Dc",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00063 ETH",
          "timestamp": "2023-08-11 19:21 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xcb5305c3dc2c2f7252d1e15eeb0474a5f7ad9a3cb2f00df494cc76411c337a1d",
          "from": "0xE2601b3896198443A41506a8C2CA6F116F1e9B72",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00173 ETH",
          "timestamp": "2023-08-07 14:08 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x8ca9b69564cc08205c6071d7586bc85666f2b1c7eed641af58fea74a0a63b9b5",
          "from": "0x46eB5BeE5DB0C565F5fa4e83ED8DC0Fb6dE3cD92",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00045 ETH",
          "timestamp": "2023-08-05 07:43 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x693347bbe20aee88199c28b642c8669ba367ac392aa01b45bdc0b1736422439e",
          "from": "0x60DC5BB048310224b8732D732f4a32d16690e470",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00030 ETH",
          "timestamp": "2023-03-24 03:30 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x4f54b0e4b3d1f8312698a75f8b9828e4ce5b83a9ca11a88a5d3c4d7e118f49b4",
          "from": "0x4293b5Dc11B250078Da7359D7d57c15EECfcf70a",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00064 ETH",
          "timestamp": "2023-03-21 18:56 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x7a4380792960756246105335dc4f58233ee93d94f62267f98832c453f1df5757",
          "from": "0x4293b5Dc11B250078Da7359D7d57c15EECfcf70a",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00064 ETH",
          "timestamp": "2023-03-21 18:56 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x01792f7d80bea37a77edec72d2cc34018f4b4282d4551a71e6c00b386b5ff925",
          "from": "0x4293b5Dc11B250078Da7359D7d57c15EECfcf70a",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00045 ETH",
          "timestamp": "2023-03-21 18:56 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xfec610845a006aba5f3d7c1129feebb2668b2245141f836aec03f2912eea54b8",
          "from": "0x4293b5Dc11B250078Da7359D7d57c15EECfcf70a",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00045 ETH",
          "timestamp": "2023-03-21 18:56 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xa59ffc4cb272f13f6e5d74e2b7e6dccb3627137e7a4bc19887662d90e8c4ad2b",
          "from": "0x5b94Fdc888c58dad24192573BBa64E718DB1408C",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00125 ETH",
          "timestamp": "2023-03-21 17:28 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x871829d4928a173433fe1910dd74e3738c804134f5b7d1ff7e25a09550c3ef2b",
          "from": "0xE3aE7649b160b2a38D1D286413BF1956620D9841",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00039 ETH",
          "timestamp": "2023-03-19 12:18 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x2ea87bb66d08272b16da5ffad4083ff0403dda467d35fd14f5b7dab2d7c1efb2",
          "from": "0xE3aE7649b160b2a38D1D286413BF1956620D9841",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00034 ETH",
          "timestamp": "2023-03-19 12:05 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xe583bf07020e9b3a6cf73884e2d53fe68868cade95a298d1bd33181c5a283e9a",
          "from": "0xE3aE7649b160b2a38D1D286413BF1956620D9841",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00040 ETH",
          "timestamp": "2023-03-18 21:25 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xeb3251022b92df7ab6d93425beebc5c47f4d280eec41c0c393ad2997b0e7966f",
          "from": "0x5b94Fdc888c58dad24192573BBa64E718DB1408C",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00055 ETH",
          "timestamp": "2023-03-18 01:40 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x202a67d3a1d52e4dd5e1eebe49da511164b6e4a1ebe717dcf4674dd83a2bd457",
          "from": "0xb66cd966670d962C227B3EABA30a872DbFb995db",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "100.0000 ETH",
          "fee": "0.00044 ETH",
          "timestamp": "2023-03-17 03:48 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xa19bf0e1fa40e9dbf07eeb7e1c66fa144e2b8fa3d1a7b34d23486c725b7cbd3a",
          "from": "0x0dB57B22f78227Ef59c872fD288EAFEF7860c46a",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00151 ETH",
          "timestamp": "2022-06-01 02:08 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x57d1c2d19d30c82f3401be0254dfc7282879278140a55e88ccdb47b5cfc7c65a",
          "from": "0xB84b2C205B27d562345F093fb3D1B36Ce890d396",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00020 ETH",
          "timestamp": "2022-05-22 03:59 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xc215bba75bb84fb1e30b5e604f690468bef7de64a73a1a4ce91a83e30585bb2a",
          "from": "0x46D126Be6902661D640d5b2Bfe8e3A283836299D",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00076 ETH",
          "timestamp": "2022-04-27 14:52 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xb743785cf049b0577ad22646fa1db6ae13414294c35ef65195b24aa97534c250",
          "from": "0x68aF8805f64dcBe82bEBD3C22372D3bbA2210E5c",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00158 ETH",
          "timestamp": "2022-04-27 14:37 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x06d514d941f75671fb1edbccf93a5b959a66b7c10a9d51aa06c29ad0e859cb5c",
          "from": "0x15B853f23a236023E5b465151d76bFffC831F4f6",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00068 ETH",
          "timestamp": "2022-04-27 12:40 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x1dc458bb6ad496f335b37ccad4cee8ebe74fa896b0a09c7dc73feec2c8ea2769",
          "from": "0x34c5b753066d64F3585E4C73e68D5AeB94E3A79B",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00121 ETH",
          "timestamp": "2022-04-24 08:21 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x47e885cb65ecb70fbb9e535a2f0fe742e8eaf64b563ac94ccd08358ed5c78a26",
          "from": "0x5A1a006A7A345dfa518C6C185cF5cBF3B5c05160",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00060 ETH",
          "timestamp": "2022-04-22 08:27 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x5ed7272989ec97be9109758482febef673fd433fb1cf8c043a79b45c502b9f98",
          "from": "0xDD28fd615C9cdB516c73a0110de2Bc28F1F83cB7",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00086 ETH",
          "timestamp": "2022-04-21 07:48 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xac9d100758f62e7c9de9fde89acd31b80a7a02b95f8dfe61a8a179b80b4003eb",
          "from": "0xEB92Ed6e619bCc7a892f559F7c2fF20E41a8D1e4",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00097 ETH",
          "timestamp": "2022-04-20 09:33 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x81964d33cff2f25cee36985f1abf09129a2517cd43b78d0e19b791e2634e14c6",
          "from": "0xD5E3B827ecce4F357Beb6a13F5Bc5a8FB96DF591",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00100 ETH",
          "timestamp": "2022-04-20 09:31 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xbd5d43369d1cf8472926764b57164bd408051c54a0d116d8e6bca1631425176f",
          "from": "0xD5E3B827ecce4F357Beb6a13F5Bc5a8FB96DF591",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0002 ETH",
          "fee": "0.00119 ETH",
          "timestamp": "2022-04-20 09:30 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x23d9242cac2250c66026d53fed18ddef4b9437f0327db1887f1a0629b7c869bf",
          "from": "0xC3C972f575976dEce74cB19cd4D7ec4c55fdf47F",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0007 ETH",
          "fee": "0.00086 ETH",
          "timestamp": "2022-04-20 09:14 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x11a5496f634f896dd51cfaf340bf0e9ea1ae98276a1c847fe22f2253fe1f97dd",
          "from": "0xC3C972f575976dEce74cB19cd4D7ec4c55fdf47F",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00087 ETH",
          "timestamp": "2022-04-20 09:09 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xacb222367cba509acd186589b2a7d5e7b223db896478489beae9a61360460626",
          "from": "0xC3C972f575976dEce74cB19cd4D7ec4c55fdf47F",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00090 ETH",
          "timestamp": "2022-04-20 09:06 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x25533053b29c4d0c5ff9a90e2f4cb81083a84d573966f680602791141aaf83b7",
          "from": "0xC3C972f575976dEce74cB19cd4D7ec4c55fdf47F",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0010 ETH",
          "fee": "0.00076 ETH",
          "timestamp": "2022-04-20 09:02 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x1115ed4fb26fb4528a04c678c6ecdaf643ba79235c3576ed1328c1f767466d57",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:29 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xf5f2776960980db327489271e597e528a1073cd370436d94aa1e1aff734dce7a",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:29 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x5345e7495bc1494a89127c7298a62866ef09a70c432b822095f71310f0ed374d",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:29 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x4a46cc18137c0793ba58caebe4917d1c94c4b79f13d0c3ae5e6a29ae706e6bc4",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:28 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x673e8b66443492cac63b94b6b3de9f57d89aeffaf6cfcf79f94f4725e13d705a",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:28 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x877b16b11963d35f97691f45b7bbb3c02136bded90e1c66819b58d3727f24cb3",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:28 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        }
      ],
      "terminalStatus": "ACTIVE_FLOW"
    },
    {
      "id": "node-0x098b716b",
      "address": "0x098b716b8aaf21512996dc57eb0615e2383e2f96",
      "label": "Lazarus Group (Ronin Exploiter)",
      "type": "SUSPECT_BURNER",
      "chain": "ethereum",
      "balance": "101.8025 ETH",
      "riskScore": 0.99,
      "confidence": 0.99,
      "entity": "North Korean State Threat Actor ($624M Ronin Bridge Heist)",
      "txCount": 430,
      "isTerminal": false,
      "transactions": [
        {
          "hash": "0x1b25e6ad8a3344a18a23cffeda2759e8e7d7848115d7196045a5cff0ad2c77fa",
          "from": "0x087238209BaC1D2985b12d7A4bE5bd75daA17243",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00000 ETH",
          "timestamp": "2026-07-27 10:14 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x3ea22b4718f60851bdf4e54a2529bf9759775a419d7d8343f1b4381b2e151796",
          "from": "0x8C75aD518Dce956b488AB65E36aB229d8664BF29",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00001 ETH",
          "timestamp": "2026-04-09 12:21 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x74f7fbfe5a0bd3ef2189619497d9c8445a0b8e6d5630e490534a3d2b6924ac33",
          "from": "0xE546480138D50Bb841B204691C39cC514858d101",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00008 ETH",
          "timestamp": "2025-03-01 20:12 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x6cbd30d24ef00f00763617f75ac1c56fc6d41320cb11326df9603cb73932aa55",
          "from": "0xFc3Ff9d9Abd3ABADda68821e443779bEb1082f43",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0005 ETH",
          "fee": "0.00006 ETH",
          "timestamp": "2024-08-06 18:16 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xb37bc24d865a8021425dff01cd6cc7673010cb7642cd7c73be728cea8fda0dae",
          "from": "0x09564aC9288eD66bD32E793E76ce4336C1a9eD00",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00008 ETH",
          "timestamp": "2024-05-13 23:33 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x7411f1ed289a955e91e5074c75d4af832517dc79e01a3d0530ceb7f2123cb26a",
          "from": "0xbc25D517cc9d7eA453622dEd3213302dE34d29Eb",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00056 ETH",
          "timestamp": "2024-04-04 03:01 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xceb93d896a12e23cf1dc13b7569bc82c9428cd978d2fe9735b6b0b4d7bfe4795",
          "from": "0xdf225c04450504e9198569982c98De2e15b9DF2A",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00049 ETH",
          "timestamp": "2024-04-04 02:48 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x229e7814c872cc447940e00bf5923cbbb95cf9975f8e24b1ea1c30f41d6a1956",
          "from": "0xE129927cfC61CE2F0b2a0CA6d8f9482D4ee60c64",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "2.0000 ETH",
          "fee": "0.00061 ETH",
          "timestamp": "2024-02-24 03:50 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x25e27694fe23b4e5ec01f0ca0ba4966bb4e7c9afd95174d3b80f98e54ad6b2b3",
          "from": "0x4E5B2e1dc63F6b91cb6Cd759936495434C7e972F",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0091 ETH",
          "fee": "0.00029 ETH",
          "timestamp": "2023-10-25 02:46 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xf597722f3619a0aae57e97e6c4b8adc1b354e8f966861b13c146b40b97d7d062",
          "from": "0x9e40b3eCeC1bE687053326c0c3Fe51AcA69eB8Dc",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00063 ETH",
          "timestamp": "2023-08-11 19:21 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xcb5305c3dc2c2f7252d1e15eeb0474a5f7ad9a3cb2f00df494cc76411c337a1d",
          "from": "0xE2601b3896198443A41506a8C2CA6F116F1e9B72",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00173 ETH",
          "timestamp": "2023-08-07 14:08 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x8ca9b69564cc08205c6071d7586bc85666f2b1c7eed641af58fea74a0a63b9b5",
          "from": "0x46eB5BeE5DB0C565F5fa4e83ED8DC0Fb6dE3cD92",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00045 ETH",
          "timestamp": "2023-08-05 07:43 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x693347bbe20aee88199c28b642c8669ba367ac392aa01b45bdc0b1736422439e",
          "from": "0x60DC5BB048310224b8732D732f4a32d16690e470",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00030 ETH",
          "timestamp": "2023-03-24 03:30 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x4f54b0e4b3d1f8312698a75f8b9828e4ce5b83a9ca11a88a5d3c4d7e118f49b4",
          "from": "0x4293b5Dc11B250078Da7359D7d57c15EECfcf70a",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00064 ETH",
          "timestamp": "2023-03-21 18:56 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x7a4380792960756246105335dc4f58233ee93d94f62267f98832c453f1df5757",
          "from": "0x4293b5Dc11B250078Da7359D7d57c15EECfcf70a",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00064 ETH",
          "timestamp": "2023-03-21 18:56 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x01792f7d80bea37a77edec72d2cc34018f4b4282d4551a71e6c00b386b5ff925",
          "from": "0x4293b5Dc11B250078Da7359D7d57c15EECfcf70a",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00045 ETH",
          "timestamp": "2023-03-21 18:56 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xfec610845a006aba5f3d7c1129feebb2668b2245141f836aec03f2912eea54b8",
          "from": "0x4293b5Dc11B250078Da7359D7d57c15EECfcf70a",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00045 ETH",
          "timestamp": "2023-03-21 18:56 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xa59ffc4cb272f13f6e5d74e2b7e6dccb3627137e7a4bc19887662d90e8c4ad2b",
          "from": "0x5b94Fdc888c58dad24192573BBa64E718DB1408C",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00125 ETH",
          "timestamp": "2023-03-21 17:28 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xcf0b3487dc443f1ef92b4fe27ff7f89e07588cdc0e2b37d50adb8158c697cea6",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0xb66cd966670d962C227B3EABA30a872DbFb995db",
          "valueStr": "2.0000 ETH",
          "fee": "0.00161 ETH",
          "timestamp": "2023-03-21 17:02 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x871829d4928a173433fe1910dd74e3738c804134f5b7d1ff7e25a09550c3ef2b",
          "from": "0xE3aE7649b160b2a38D1D286413BF1956620D9841",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00039 ETH",
          "timestamp": "2023-03-19 12:18 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x2ea87bb66d08272b16da5ffad4083ff0403dda467d35fd14f5b7dab2d7c1efb2",
          "from": "0xE3aE7649b160b2a38D1D286413BF1956620D9841",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00034 ETH",
          "timestamp": "2023-03-19 12:05 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xe583bf07020e9b3a6cf73884e2d53fe68868cade95a298d1bd33181c5a283e9a",
          "from": "0xE3aE7649b160b2a38D1D286413BF1956620D9841",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00040 ETH",
          "timestamp": "2023-03-18 21:25 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xeb3251022b92df7ab6d93425beebc5c47f4d280eec41c0c393ad2997b0e7966f",
          "from": "0x5b94Fdc888c58dad24192573BBa64E718DB1408C",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00055 ETH",
          "timestamp": "2023-03-18 01:40 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x202a67d3a1d52e4dd5e1eebe49da511164b6e4a1ebe717dcf4674dd83a2bd457",
          "from": "0xb66cd966670d962C227B3EABA30a872DbFb995db",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "100.0000 ETH",
          "fee": "0.00044 ETH",
          "timestamp": "2023-03-17 03:48 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xa19bf0e1fa40e9dbf07eeb7e1c66fa144e2b8fa3d1a7b34d23486c725b7cbd3a",
          "from": "0x0dB57B22f78227Ef59c872fD288EAFEF7860c46a",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00151 ETH",
          "timestamp": "2022-06-01 02:08 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x57d1c2d19d30c82f3401be0254dfc7282879278140a55e88ccdb47b5cfc7c65a",
          "from": "0xB84b2C205B27d562345F093fb3D1B36Ce890d396",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00020 ETH",
          "timestamp": "2022-05-22 03:59 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xa0427076e8a3ae2aca5e94928c71a54bbc02bd7c56930f4b126336a21baebc2d",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0x08723392Ed15743cc38513C4925f5e6be5c17243",
          "valueStr": "12595.3000 ETH",
          "fee": "0.00102 ETH",
          "timestamp": "2022-05-04 07:32 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xfd578594dfc23e8ec1403e79ab96cff14c4941b03bbd67674df925faecf32eec",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0x3e37627dEAA754090fBFbb8bd226c1CE66D255e9",
          "valueStr": "23528.8000 ETH",
          "fee": "0.00252 ETH",
          "timestamp": "2022-05-03 08:23 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xc215bba75bb84fb1e30b5e604f690468bef7de64a73a1a4ce91a83e30585bb2a",
          "from": "0x46D126Be6902661D640d5b2Bfe8e3A283836299D",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00076 ETH",
          "timestamp": "2022-04-27 14:52 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xb743785cf049b0577ad22646fa1db6ae13414294c35ef65195b24aa97534c250",
          "from": "0x68aF8805f64dcBe82bEBD3C22372D3bbA2210E5c",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00158 ETH",
          "timestamp": "2022-04-27 14:37 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x06d514d941f75671fb1edbccf93a5b959a66b7c10a9d51aa06c29ad0e859cb5c",
          "from": "0x15B853f23a236023E5b465151d76bFffC831F4f6",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00068 ETH",
          "timestamp": "2022-04-27 12:40 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xadee9d8ba4bed9247c8eac99a4a028f24e3cb9544e3f395f1fd661cbacf99a21",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0xF7B31119c2682c88d88D455dBb9d5932c65Cf1bE",
          "valueStr": "25127.5192 ETH",
          "fee": "0.00252 ETH",
          "timestamp": "2022-04-27 11:05 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x1dc458bb6ad496f335b37ccad4cee8ebe74fa896b0a09c7dc73feec2c8ea2769",
          "from": "0x34c5b753066d64F3585E4C73e68D5AeB94E3A79B",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00121 ETH",
          "timestamp": "2022-04-24 08:21 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x9f6a19c9fed374450dcb1657d5e404ec8a60be752b07c1db1f21049d7bf8d61a",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0x35fB6f6DB4fb05e6A4cE86f2C93691425626d4b1",
          "valueStr": "33568.1520 ETH",
          "fee": "0.00061 ETH",
          "timestamp": "2022-04-24 06:47 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x47e885cb65ecb70fbb9e535a2f0fe742e8eaf64b563ac94ccd08358ed5c78a26",
          "from": "0x5A1a006A7A345dfa518C6C185cF5cBF3B5c05160",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00060 ETH",
          "timestamp": "2022-04-22 08:27 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x5ed7272989ec97be9109758482febef673fd433fb1cf8c043a79b45c502b9f98",
          "from": "0xDD28fd615C9cdB516c73a0110de2Bc28F1F83cB7",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00086 ETH",
          "timestamp": "2022-04-21 07:48 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x899ad3622b561e9175be78c1c819242ca60279430ed49cce488fd3803a1511d4",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0x53b6936513e738f44FB50d2b9476730C0Ab3Bfc1",
          "valueStr": "21629.4821 ETH",
          "fee": "0.00252 ETH",
          "timestamp": "2022-04-21 07:19 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xac9d100758f62e7c9de9fde89acd31b80a7a02b95f8dfe61a8a179b80b4003eb",
          "from": "0xEB92Ed6e619bCc7a892f559F7c2fF20E41a8D1e4",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00097 ETH",
          "timestamp": "2022-04-20 09:33 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x81964d33cff2f25cee36985f1abf09129a2517cd43b78d0e19b791e2634e14c6",
          "from": "0xD5E3B827ecce4F357Beb6a13F5Bc5a8FB96DF591",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00100 ETH",
          "timestamp": "2022-04-20 09:31 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xbd5d43369d1cf8472926764b57164bd408051c54a0d116d8e6bca1631425176f",
          "from": "0xD5E3B827ecce4F357Beb6a13F5Bc5a8FB96DF591",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0002 ETH",
          "fee": "0.00119 ETH",
          "timestamp": "2022-04-20 09:30 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x23d9242cac2250c66026d53fed18ddef4b9437f0327db1887f1a0629b7c869bf",
          "from": "0xC3C972f575976dEce74cB19cd4D7ec4c55fdf47F",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0007 ETH",
          "fee": "0.00086 ETH",
          "timestamp": "2022-04-20 09:14 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x11a5496f634f896dd51cfaf340bf0e9ea1ae98276a1c847fe22f2253fe1f97dd",
          "from": "0xC3C972f575976dEce74cB19cd4D7ec4c55fdf47F",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00087 ETH",
          "timestamp": "2022-04-20 09:09 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xacb222367cba509acd186589b2a7d5e7b223db896478489beae9a61360460626",
          "from": "0xC3C972f575976dEce74cB19cd4D7ec4c55fdf47F",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0001 ETH",
          "fee": "0.00090 ETH",
          "timestamp": "2022-04-20 09:06 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x25533053b29c4d0c5ff9a90e2f4cb81083a84d573966f680602791141aaf83b7",
          "from": "0xC3C972f575976dEce74cB19cd4D7ec4c55fdf47F",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0010 ETH",
          "fee": "0.00076 ETH",
          "timestamp": "2022-04-20 09:02 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x1115ed4fb26fb4528a04c678c6ecdaf643ba79235c3576ed1328c1f767466d57",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:29 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0xf5f2776960980db327489271e597e528a1073cd370436d94aa1e1aff734dce7a",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:29 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x5345e7495bc1494a89127c7298a62866ef09a70c432b822095f71310f0ed374d",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:29 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x4a46cc18137c0793ba58caebe4917d1c94c4b79f13d0c3ae5e6a29ae706e6bc4",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:28 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x673e8b66443492cac63b94b6b3de9f57d89aeffaf6cfcf79f94f4725e13d705a",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:28 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        },
        {
          "hash": "0x877b16b11963d35f97691f45b7bbb3c02136bded90e1c66819b58d3727f24cb3",
          "from": "0x03Cf40B900971561AC6bd997ef1Fe939DcbC95e2",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "0.0000 ETH",
          "fee": "0.00113 ETH",
          "timestamp": "2022-04-19 08:28 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        }
      ]
    },
    {
      "id": "node-0xf7b31119",
      "address": "0xF7B31119c2682c88d88D455dBb9d5932c65Cf1bE",
      "label": "Branch Recipient (0xF7B3...f1bE)",
      "type": "INTERMEDIARY",
      "chain": "ethereum",
      "balance": "Verified",
      "riskScore": 0.8,
      "confidence": 0.92,
      "entity": "Secondary Exfiltration Corridor",
      "txCount": 1,
      "isTerminal": false,
      "transactions": [
        {
          "hash": "0xadee9d8ba4bed9247c8eac99a4a028f24e3cb9544e3f395f1fd661cbacf99a21",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0xF7B31119c2682c88d88D455dBb9d5932c65Cf1bE",
          "valueStr": "25127.5192 ETH",
          "fee": "0.00252 ETH",
          "timestamp": "2022-04-27 11:05 IST",
          "chain": "ethereum",
          "riskLevel": "SUSPICIOUS"
        }
      ],
      "terminalStatus": "ACTIVE_FLOW"
    },
    {
      "id": "node-0x3e37627d",
      "address": "0x3e37627dEAA754090fBFbb8bd226c1CE66D255e9",
      "label": "Branch Recipient (0x3e37...55e9)",
      "type": "INTERMEDIARY",
      "chain": "ethereum",
      "balance": "Verified",
      "riskScore": 0.8,
      "confidence": 0.92,
      "entity": "Secondary Exfiltration Corridor",
      "txCount": 1,
      "isTerminal": false,
      "transactions": [
        {
          "hash": "0xfd578594dfc23e8ec1403e79ab96cff14c4941b03bbd67674df925faecf32eec",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0x3e37627dEAA754090fBFbb8bd226c1CE66D255e9",
          "valueStr": "23528.8000 ETH",
          "fee": "0.00252 ETH",
          "timestamp": "2022-05-03 08:23 IST",
          "chain": "ethereum",
          "riskLevel": "SUSPICIOUS"
        }
      ],
      "terminalStatus": "ACTIVE_FLOW"
    },
    {
      "id": "node-0x35fb6f6d",
      "address": "0x35fB6f6DB4fb05e6A4cE86f2C93691425626d4b1",
      "label": "Hop #1 (0x35fB...d4b1)",
      "type": "INTERMEDIARY",
      "chain": "ethereum",
      "balance": "Verified",
      "riskScore": 0.85,
      "confidence": 0.92,
      "entity": "Laundering Hop 1 (Layering Mule)",
      "txCount": 1,
      "isTerminal": false,
      "transactions": [
        {
          "hash": "0x9f6a19c9fed374450dcb1657d5e404ec8a60be752b07c1db1f21049d7bf8d61a",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0x35fB6f6DB4fb05e6A4cE86f2C93691425626d4b1",
          "valueStr": "33568.1520 ETH",
          "fee": "0.00061 ETH",
          "timestamp": "2022-04-24 06:47 IST",
          "chain": "ethereum",
          "riskLevel": "SUSPICIOUS"
        }
      ],
      "terminalStatus": "ACTIVE_FLOW"
    },
    {
      "id": "node-0x99b6843f",
      "address": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
      "label": "Hop #2 (0x99b6...A12D)",
      "type": "INTERMEDIARY",
      "chain": "ethereum",
      "balance": "Verified",
      "riskScore": 0.75,
      "confidence": 0.92,
      "entity": "Laundering Hop 2 (Layering Mule)",
      "txCount": 1,
      "isTerminal": false,
      "transactions": [
        {
          "hash": "0x40d7f3419494e9afec3f95a3823457322231111281b668fa6d80e8cd2124cd4f",
          "from": "0x35fB6f6DB4fb05e6A4cE86f2C93691425626d4b1",
          "to": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "valueStr": "7009.5000 ETH",
          "fee": "0.00124 ETH",
          "timestamp": "2022-05-06 03:32 IST",
          "chain": "ethereum",
          "riskLevel": "SUSPICIOUS"
        }
      ],
      "terminalStatus": "ACTIVE_FLOW"
    },
    {
      "id": "node-0xd90e2f92",
      "address": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
      "label": "Tornado.Cash (100.0 ETH Pool)",
      "type": "MIXER",
      "chain": "ethereum",
      "balance": "Verified",
      "riskScore": 0.99,
      "confidence": 0.92,
      "entity": "OFAC Sanctioned Mixer Pool (Trail Lost)",
      "txCount": 20,
      "isTerminal": true,
      "transactions": [
        {
          "hash": "0x1553288924a808fa8108680d61dc804bdb7097fd0d5bced05008b4e85b31073b",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04716 ETH",
          "timestamp": "2022-05-06 08:52 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xef72cb93dba46fdfa037fed7b4de6fc0fc23fdbedc7f9549fafb859be6db649b",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04716 ETH",
          "timestamp": "2022-05-06 08:48 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x939f566cae5d4d2c003920da6f7d0900cd84a2f3086f891c28fc484c2369070b",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05021 ETH",
          "timestamp": "2022-05-06 08:44 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xc8e7b3158544b21299290ed03c0e28080a862c804302839c1d6821a6f944bd81",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05394 ETH",
          "timestamp": "2022-05-06 08:40 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xfed0f1ef2595072d1f8b73c935000d640fd75e7dd1e5aad24ff8e2b0fd86380d",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05057 ETH",
          "timestamp": "2022-05-06 08:35 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xdbaa1d579bae87333b98a4d4a47fac64b3f7a403a3145640bcc035f27b9eb128",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.03954 ETH",
          "timestamp": "2022-05-06 08:26 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xe5049bce801b95339f4862872f88f56bdc3bc31c5f9d420f60b06ccbfdc0c939",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04993 ETH",
          "timestamp": "2022-05-06 08:21 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x339bad50805cc3c620c7ba497a4c8d04d6772e71bd2fabfb6ee671de2ea2b200",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05701 ETH",
          "timestamp": "2022-05-06 08:18 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xd054b25bc2775517294fff31ba9d5e56e3795c7547bc015ed76b9c1c55e8736e",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.06380 ETH",
          "timestamp": "2022-05-06 08:10 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x3781da3ad5de98ccd8c12a22329d54dab40a4abb22af60a4fcf03bae912bcfbe",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04623 ETH",
          "timestamp": "2022-05-06 08:06 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x324ef5a869e10ee1b08e77e7df240744f8cdac72decfc469be11a7bb67c2378a",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05021 ETH",
          "timestamp": "2022-05-06 08:00 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x5e56cec588bf0b4b2d2039e2daa9b38988b5af0d429b46b3b57277517e6b5929",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05425 ETH",
          "timestamp": "2022-05-06 07:56 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x762b2e8567804851cddbb430143ea14bfb5ce192f4db5aa940b023c8cac10575",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04623 ETH",
          "timestamp": "2022-05-06 07:50 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x27635b258c5f9701cbb91009ea8a18499d79d00b6c30fa3e2e62b1cbddd23269",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.06578 ETH",
          "timestamp": "2022-05-06 07:45 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x63a09ef28c1f6a8c37de9ef05cb9986a8c16428f790985a69c0ac763a57e2c65",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.06317 ETH",
          "timestamp": "2022-05-06 07:41 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xf624a418aaa680ebd96d59da077792151e763e787b50d67648542e87a223aa01",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05486 ETH",
          "timestamp": "2022-05-06 07:38 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x251e3b636fa0e25ba4bb9054b1606a8619df938a6d51b52a9377dfb09c38896a",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04835 ETH",
          "timestamp": "2022-05-06 07:31 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x954e963e4de14e983ff53a5ba439da48ff14dc1b87c6bc96d10f067221a2a56e",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04769 ETH",
          "timestamp": "2022-05-06 07:28 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x980677903422909cdeed74c95e4cdc274839725d03d14c1ff8a60f8a61e968df",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04571 ETH",
          "timestamp": "2022-05-06 07:24 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x0a2327b5eef24267c0df0fd37816e65c8e6ce5ec829e35f70b9ec739283f16d0",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04689 ETH",
          "timestamp": "2022-05-06 07:20 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        }
      ],
      "terminalStatus": "LOST_TO_MIXER"
    }
  ],
  "links": [
    {
      "source": "node-0xb66cd966",
      "target": "node-0x098b716b",
      "value": "100.0000 ETH",
      "currency": "ETH",
      "txHash": "0x202a67d3a1d52e4dd5e1eebe49da511164b6e4a1ebe717dcf4674dd83a2bd457",
      "timestamp": "2023-03-17 03:48 IST",
      "fee": "0.00044 ETH",
      "chain": "ethereum",
      "isBridge": false,
      "heuristic": "Initial Inflow Transfer",
      "txCount": 1,
      "individualTxs": [
        {
          "hash": "0x202a67d3a1d52e4dd5e1eebe49da511164b6e4a1ebe717dcf4674dd83a2bd457",
          "from": "0xb66cd966670d962C227B3EABA30a872DbFb995db",
          "to": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "valueStr": "100.0000 ETH",
          "fee": "0.00044 ETH",
          "timestamp": "2023-03-17 03:48 IST",
          "chain": "ethereum",
          "riskLevel": "CLEAN"
        }
      ]
    },
    {
      "source": "node-0x098b716b",
      "target": "node-0xf7b31119",
      "value": "25127.5192 ETH",
      "currency": "ETH",
      "txHash": "0xadee9d8ba4bed9247c8eac99a4a028f24e3cb9544e3f395f1fd661cbacf99a21",
      "timestamp": "2022-04-27 11:05 IST",
      "fee": "0.00252 ETH",
      "chain": "ethereum",
      "isBridge": false,
      "heuristic": "Secondary Branch Dispersal",
      "txCount": 1,
      "individualTxs": [
        {
          "hash": "0xadee9d8ba4bed9247c8eac99a4a028f24e3cb9544e3f395f1fd661cbacf99a21",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0xF7B31119c2682c88d88D455dBb9d5932c65Cf1bE",
          "valueStr": "25127.5192 ETH",
          "fee": "0.00252 ETH",
          "timestamp": "2022-04-27 11:05 IST",
          "chain": "ethereum",
          "riskLevel": "BALANCED"
        }
      ]
    },
    {
      "source": "node-0x098b716b",
      "target": "node-0x3e37627d",
      "value": "23528.8000 ETH",
      "currency": "ETH",
      "txHash": "0xfd578594dfc23e8ec1403e79ab96cff14c4941b03bbd67674df925faecf32eec",
      "timestamp": "2022-05-03 08:23 IST",
      "fee": "0.00252 ETH",
      "chain": "ethereum",
      "isBridge": false,
      "heuristic": "Secondary Branch Dispersal",
      "txCount": 1,
      "individualTxs": [
        {
          "hash": "0xfd578594dfc23e8ec1403e79ab96cff14c4941b03bbd67674df925faecf32eec",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0x3e37627dEAA754090fBFbb8bd226c1CE66D255e9",
          "valueStr": "23528.8000 ETH",
          "fee": "0.00252 ETH",
          "timestamp": "2022-05-03 08:23 IST",
          "chain": "ethereum",
          "riskLevel": "BALANCED"
        }
      ]
    },
    {
      "source": "node-0x098b716b",
      "target": "node-0x35fb6f6d",
      "value": "33568.1520 ETH",
      "currency": "ETH",
      "txHash": "0x9f6a19c9fed374450dcb1657d5e404ec8a60be752b07c1db1f21049d7bf8d61a",
      "timestamp": "2022-04-24 06:47 IST",
      "fee": "0.00061 ETH",
      "chain": "ethereum",
      "isBridge": false,
      "heuristic": "Hop #1 Layering Transfer",
      "txCount": 1,
      "individualTxs": [
        {
          "hash": "0x9f6a19c9fed374450dcb1657d5e404ec8a60be752b07c1db1f21049d7bf8d61a",
          "from": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
          "to": "0x35fB6f6DB4fb05e6A4cE86f2C93691425626d4b1",
          "valueStr": "33568.1520 ETH",
          "fee": "0.00061 ETH",
          "timestamp": "2022-04-24 06:47 IST",
          "chain": "ethereum",
          "riskLevel": "SUSPICIOUS"
        }
      ]
    },
    {
      "source": "node-0x35fb6f6d",
      "target": "node-0x99b6843f",
      "value": "7009.5000 ETH",
      "currency": "ETH",
      "txHash": "0x40d7f3419494e9afec3f95a3823457322231111281b668fa6d80e8cd2124cd4f",
      "timestamp": "2022-05-06 03:32 IST",
      "fee": "0.00124 ETH",
      "chain": "ethereum",
      "isBridge": false,
      "heuristic": "Hop #2 Layering Transfer",
      "txCount": 1,
      "individualTxs": [
        {
          "hash": "0x40d7f3419494e9afec3f95a3823457322231111281b668fa6d80e8cd2124cd4f",
          "from": "0x35fB6f6DB4fb05e6A4cE86f2C93691425626d4b1",
          "to": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "valueStr": "7009.5000 ETH",
          "fee": "0.00124 ETH",
          "timestamp": "2022-05-06 03:32 IST",
          "chain": "ethereum",
          "riskLevel": "SUSPICIOUS"
        }
      ]
    },
    {
      "source": "node-0x99b6843f",
      "target": "node-0xd90e2f92",
      "value": "2000.0000 ETH (20 txs)",
      "currency": "ETH",
      "txHash": "0x1553288924a808fa8108680d61dc804bdb7097fd0d5bced05008b4e85b31073b",
      "timestamp": "2022-05-06 08:52 IST",
      "fee": "0.04716 ETH",
      "chain": "ethereum",
      "isBridge": false,
      "heuristic": "Zero-Knowledge Pool Deposit",
      "txCount": 20,
      "individualTxs": [
        {
          "hash": "0x1553288924a808fa8108680d61dc804bdb7097fd0d5bced05008b4e85b31073b",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04716 ETH",
          "timestamp": "2022-05-06 08:52 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xef72cb93dba46fdfa037fed7b4de6fc0fc23fdbedc7f9549fafb859be6db649b",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04716 ETH",
          "timestamp": "2022-05-06 08:48 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x939f566cae5d4d2c003920da6f7d0900cd84a2f3086f891c28fc484c2369070b",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05021 ETH",
          "timestamp": "2022-05-06 08:44 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xc8e7b3158544b21299290ed03c0e28080a862c804302839c1d6821a6f944bd81",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05394 ETH",
          "timestamp": "2022-05-06 08:40 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xfed0f1ef2595072d1f8b73c935000d640fd75e7dd1e5aad24ff8e2b0fd86380d",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05057 ETH",
          "timestamp": "2022-05-06 08:35 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xdbaa1d579bae87333b98a4d4a47fac64b3f7a403a3145640bcc035f27b9eb128",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.03954 ETH",
          "timestamp": "2022-05-06 08:26 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xe5049bce801b95339f4862872f88f56bdc3bc31c5f9d420f60b06ccbfdc0c939",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04993 ETH",
          "timestamp": "2022-05-06 08:21 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x339bad50805cc3c620c7ba497a4c8d04d6772e71bd2fabfb6ee671de2ea2b200",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05701 ETH",
          "timestamp": "2022-05-06 08:18 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xd054b25bc2775517294fff31ba9d5e56e3795c7547bc015ed76b9c1c55e8736e",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.06380 ETH",
          "timestamp": "2022-05-06 08:10 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x3781da3ad5de98ccd8c12a22329d54dab40a4abb22af60a4fcf03bae912bcfbe",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04623 ETH",
          "timestamp": "2022-05-06 08:06 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x324ef5a869e10ee1b08e77e7df240744f8cdac72decfc469be11a7bb67c2378a",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05021 ETH",
          "timestamp": "2022-05-06 08:00 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x5e56cec588bf0b4b2d2039e2daa9b38988b5af0d429b46b3b57277517e6b5929",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05425 ETH",
          "timestamp": "2022-05-06 07:56 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x762b2e8567804851cddbb430143ea14bfb5ce192f4db5aa940b023c8cac10575",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04623 ETH",
          "timestamp": "2022-05-06 07:50 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x27635b258c5f9701cbb91009ea8a18499d79d00b6c30fa3e2e62b1cbddd23269",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.06578 ETH",
          "timestamp": "2022-05-06 07:45 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x63a09ef28c1f6a8c37de9ef05cb9986a8c16428f790985a69c0ac763a57e2c65",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.06317 ETH",
          "timestamp": "2022-05-06 07:41 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0xf624a418aaa680ebd96d59da077792151e763e787b50d67648542e87a223aa01",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.05486 ETH",
          "timestamp": "2022-05-06 07:38 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x251e3b636fa0e25ba4bb9054b1606a8619df938a6d51b52a9377dfb09c38896a",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04835 ETH",
          "timestamp": "2022-05-06 07:31 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x954e963e4de14e983ff53a5ba439da48ff14dc1b87c6bc96d10f067221a2a56e",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04769 ETH",
          "timestamp": "2022-05-06 07:28 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x980677903422909cdeed74c95e4cdc274839725d03d14c1ff8a60f8a61e968df",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04571 ETH",
          "timestamp": "2022-05-06 07:24 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        },
        {
          "hash": "0x0a2327b5eef24267c0df0fd37816e65c8e6ce5ec829e35f70b9ec739283f16d0",
          "from": "0x99b6843f8410ee696b7487A5535dD5B0Ca32A12D",
          "to": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
          "valueStr": "100.0000 ETH",
          "fee": "0.04689 ETH",
          "timestamp": "2022-05-06 07:20 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        }
      ]
    }
  ],
  "heuristics": [
    {
      "code": "H1",
      "name": "Deposit Address Reuse",
      "status": "CLEAN",
      "badge": "in:1, out:3",
      "isTriggered": false,
      "summary": "Standard decentralized transfer distribution with no exchange mailbox clustering."
    },
    {
      "code": "H2",
      "name": "Temporal Consolidation",
      "status": "MATCH",
      "badge": "\u0394t \u2264 10 BLOCKS",
      "isTriggered": true,
      "summary": "Rapid multi-hop sweeping sequence observed across consecutive block windows."
    },
    {
      "code": "H3",
      "name": "Sanctions & Mixer Fingerprinting",
      "status": "CRITICAL",
      "badge": "OFAC SDN MATCH",
      "isTriggered": true,
      "summary": "Direct on-chain interaction identified with OFAC-sanctioned mixer pool (Tornado.Cash (100.0 ETH Pool))."
    },
    {
      "code": "H4",
      "name": "GraphSAGE Inductive GNN",
      "status": "SUSPICIOUS",
      "badge": "P = 0.940",
      "isTriggered": true,
      "summary": "12-dimensional topological embedding classifies destination as high-risk laundering (PEEL_CHAIN)."
    }
  ],
  "trailStatus": "TRAIL_LOST_TO_MIXER",
  "trailVerdict": "Trail Lost in Mixer: Funds were routed into Tornado.Cash (100.0 ETH Pool). Cryptographic trail is broken in zero-knowledge obfuscation pool."
};

// Ensure all Lazarus nodes have full transactions
for (const n of EXACT_LAZARUS_TRACE.nodes) {
  if (!n.transactions || n.transactions.length === 0) {
    n.transactions = generateNodeTransactions(n.address, 'ethereum', n.type);
    n.txCount = n.transactions.length;
  }
}
for (const l of EXACT_LAZARUS_TRACE.links) {
  if (!l.individualTxs || l.individualTxs.length === 0) {
    const s = String(l.source);
    const t = String(l.target);
    l.individualTxs = generateCorridorTxs(s, t, l.value, 'ethereum');
    l.txCount = l.individualTxs.length;
  }
}

// 2. EXACT 9-NODE WAZIRX BENCHMARK FIR TOPOLOGY (From Backend Engine)
export const EXACT_WAZIRX_TRACE: TraceGraphData = {
  "traceId": "TRC-2026-B88FF66C",
  "rootAddress": "0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
  "targetEntity": "WazirX (Zanmai Labs Pvt Ltd)",
  "confidence": 0.87,
  "totalHops": 4,
  "totalValueStolen": "12.50 ETH (\u20b931,25,000)",
  "timeSpan": "3.2 hrs",
  "riskScore": 92.0,
  "typology": "FAN_OUT_FAN_IN (Temporal Layering)",
  "nodes": [
    {
      "id": "node-victim",
      "address": "0x1A2B3C4D5E6F7890123456789ABCDEF012345678",
      "label": "Victim (Complainant Origin)",
      "type": "VICTIM",
      "chain": "ethereum",
      "balance": "0.05 ETH",
      "riskScore": 0.05,
      "confidence": 1.0,
      "entity": "Complainant Origin",
      "txCount": 42,
      "isTerminal": false
    },
    {
      "id": "node-suspect",
      "address": "0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
      "label": "Suspect Burner Alpha",
      "type": "SUSPECT_BURNER",
      "chain": "ethereum",
      "balance": "0.00 ETH",
      "riskScore": 0.98,
      "confidence": 0.99,
      "entity": "Suspect Primary",
      "clusterId": "CLUST-091",
      "txCount": 4,
      "isTerminal": false
    },
    {
      "id": "node-inter-1",
      "address": "0x4567890123456789012345678901234567890123",
      "label": "Intermediary Burner-A",
      "type": "INTERMEDIARY",
      "chain": "ethereum",
      "balance": "0.00 ETH",
      "riskScore": 0.89,
      "confidence": 0.92,
      "entity": "Laundering Layer 1",
      "clusterId": "CLUST-091",
      "txCount": 2,
      "isTerminal": false
    },
    {
      "id": "node-inter-2",
      "address": "0x7890123456789012345678901234567890123456",
      "label": "Intermediary Burner-B",
      "type": "INTERMEDIARY",
      "chain": "ethereum",
      "balance": "0.00 ETH",
      "riskScore": 0.86,
      "confidence": 0.9,
      "entity": "Laundering Layer 1",
      "clusterId": "CLUST-091",
      "txCount": 2,
      "isTerminal": false
    },
    {
      "id": "node-bridge-lock",
      "address": "0xBa35678901234567890123456789012345678901",
      "label": "Stargate Cross-Chain Router",
      "type": "BRIDGE_LOCK",
      "chain": "ethereum",
      "balance": "412.8 ETH",
      "riskScore": 0.45,
      "confidence": 0.98,
      "entity": "Stargate Finance Bridge",
      "txCount": 19200,
      "isTerminal": false
    },
    {
      "id": "node-bridge-mint",
      "address": "0xDe35678901234567890123456789012345678902",
      "label": "Stargate BSC Relayer",
      "type": "BRIDGE_MINT",
      "chain": "bsc",
      "balance": "89.1 BNB",
      "riskScore": 0.45,
      "confidence": 0.98,
      "entity": "Stargate Finance Bridge",
      "txCount": 14120,
      "isTerminal": false
    },
    {
      "id": "node-consolidation",
      "address": "0xEE35678901234567890123456789012345678903",
      "label": "Consolidation Wallet",
      "type": "INTERMEDIARY",
      "chain": "bsc",
      "balance": "0.10 BNB",
      "riskScore": 0.91,
      "confidence": 0.88,
      "entity": "Peel Consolidator",
      "clusterId": "CLUST-091",
      "txCount": 6,
      "isTerminal": false
    },
    {
      "id": "node-vasp-deposit",
      "address": "0x3456789012345678901234567890123456789012",
      "label": "WazirX User Deposit Vault",
      "type": "EXCHANGE_DEPOSIT",
      "chain": "ethereum",
      "balance": "0.00 ETH",
      "riskScore": 0.78,
      "confidence": 0.94,
      "entity": "WazirX India (FIU-IND-2023-VASP-001)",
      "clusterId": "WAZIRX-CLUSTER-4",
      "txCount": 12,
      "isTerminal": false
    },
    {
      "id": "node-vasp-hot",
      "address": "0x5ACe48b8E8A5E44598F1c667a421b4A59714Da31",
      "label": "WazirX Hot Wallet 04",
      "type": "EXCHANGE_HOT",
      "chain": "ethereum",
      "balance": "18,421.40 ETH",
      "riskScore": 0.12,
      "confidence": 0.99,
      "entity": "WazirX Sovereign Hot Pool",
      "clusterId": "WAZIRX-CLUSTER-4",
      "txCount": 482100,
      "isTerminal": true
    }
  ],
  "links": [
    {
      "source": "node-victim",
      "target": "node-suspect",
      "value": "12.50 ETH",
      "currency": "ETH",
      "txHash": "0xaa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef",
      "timestamp": "14:32:10 IST",
      "fee": "0.0021 ETH",
      "chain": "ethereum",
      "isBridge": false,
      "heuristic": "Phishing Transfer Authorization",
      "txCount": 1,
      "individualTxs": [
        {
          "hash": "0xaa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef",
          "from": "0x1A2B3C4D5E6F7890123456789ABCDEF012345678",
          "to": "0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
          "valueStr": "12.50 ETH",
          "fee": "0.0021 ETH",
          "timestamp": "14:32:10 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        }
      ]
    },
    {
      "source": "node-suspect",
      "target": "node-inter-1",
      "value": "6.25 ETH (2 txs)",
      "currency": "ETH",
      "txHash": "0xbb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01",
      "timestamp": "14:35:44 IST",
      "fee": "0.0018 ETH",
      "chain": "ethereum",
      "isBridge": false,
      "heuristic": "Fan-Out Split (50% Split)",
      "txCount": 2,
      "individualTxs": [
        {
          "hash": "0xbb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01",
          "from": "0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
          "to": "0x4567890123456789012345678901234567890123",
          "valueStr": "3.25 ETH",
          "fee": "0.0009 ETH",
          "timestamp": "14:35:44 IST",
          "chain": "ethereum",
          "riskLevel": "SUSPICIOUS"
        },
        {
          "hash": "0xbb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef09",
          "from": "0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
          "to": "0x4567890123456789012345678901234567890123",
          "valueStr": "3.00 ETH",
          "fee": "0.0009 ETH",
          "timestamp": "14:37:02 IST",
          "chain": "ethereum",
          "riskLevel": "SUSPICIOUS"
        }
      ]
    },
    {
      "source": "node-suspect",
      "target": "node-inter-2",
      "value": "6.25 ETH",
      "currency": "ETH",
      "txHash": "0xcc3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef02",
      "timestamp": "14:36:12 IST",
      "fee": "0.0019 ETH",
      "chain": "ethereum",
      "isBridge": false,
      "heuristic": "Fan-Out Split (50% Split)",
      "txCount": 1,
      "individualTxs": [
        {
          "hash": "0xcc3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef02",
          "from": "0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
          "to": "0x7890123456789012345678901234567890123456",
          "valueStr": "6.25 ETH",
          "fee": "0.0019 ETH",
          "timestamp": "14:36:12 IST",
          "chain": "ethereum",
          "riskLevel": "SUSPICIOUS"
        }
      ]
    },
    {
      "source": "node-inter-1",
      "target": "node-bridge-lock",
      "value": "6.20 ETH",
      "currency": "ETH",
      "txHash": "0xdd4e5f67890123456789abcdef0123456789abcdef0123456789abcdef03",
      "timestamp": "14:48:20 IST",
      "fee": "0.0042 ETH",
      "chain": "ethereum",
      "isBridge": true,
      "heuristic": "Stargate Router Lock (Dest: BSC)",
      "txCount": 1,
      "individualTxs": [
        {
          "hash": "0xdd4e5f67890123456789abcdef0123456789abcdef0123456789abcdef03",
          "from": "0x4567890123456789012345678901234567890123",
          "to": "0xBa35678901234567890123456789012345678901",
          "valueStr": "6.20 ETH",
          "fee": "0.0042 ETH",
          "timestamp": "14:48:20 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        }
      ]
    },
    {
      "source": "node-bridge-lock",
      "target": "node-bridge-mint",
      "value": "6.18 ETH (eqv. BNB)",
      "currency": "BNB",
      "txHash": "0xee5f67890123456789abcdef0123456789abcdef0123456789abcdef04",
      "timestamp": "14:52:10 IST",
      "fee": "0.0005 BNB",
      "chain": "bsc",
      "isBridge": true,
      "heuristic": "Cross-Chain Correlated Mint (Delta: 3.8 mins, 0.32% fee)",
      "txCount": 1,
      "individualTxs": [
        {
          "hash": "0xee5f67890123456789abcdef0123456789abcdef0123456789abcdef04",
          "from": "0xBa35678901234567890123456789012345678901",
          "to": "0xDe35678901234567890123456789012345678902",
          "valueStr": "6.18 ETH (eqv. BNB)",
          "fee": "0.0005 BNB",
          "timestamp": "14:52:10 IST",
          "chain": "bsc",
          "riskLevel": "BALANCED"
        }
      ]
    },
    {
      "source": "node-bridge-mint",
      "target": "node-consolidation",
      "value": "6.17 BNB",
      "currency": "BNB",
      "txHash": "0xff6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a",
      "timestamp": "15:02:40 IST",
      "fee": "0.0003 BNB",
      "chain": "bsc",
      "isBridge": false,
      "heuristic": "Consolidation Sweep",
      "txCount": 1,
      "individualTxs": [
        {
          "hash": "0xff6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a",
          "from": "0xDe35678901234567890123456789012345678902",
          "to": "0xEE35678901234567890123456789012345678903",
          "valueStr": "6.17 BNB",
          "fee": "0.0003 BNB",
          "timestamp": "15:02:40 IST",
          "chain": "bsc",
          "riskLevel": "SUSPICIOUS"
        }
      ]
    },
    {
      "source": "node-inter-2",
      "target": "node-vasp-deposit",
      "value": "6.22 ETH",
      "currency": "ETH",
      "txHash": "0x11223344556677889900aabbccddeeff0011223344556677889900aabbccddee",
      "timestamp": "15:14:02 IST",
      "fee": "0.0015 ETH",
      "chain": "ethereum",
      "isBridge": false,
      "heuristic": "Direct Exchange User Deposit",
      "txCount": 1,
      "individualTxs": [
        {
          "hash": "0x11223344556677889900aabbccddeeff0011223344556677889900aabbccddee",
          "from": "0x7890123456789012345678901234567890123456",
          "to": "0x3456789012345678901234567890123456789012",
          "valueStr": "6.22 ETH",
          "fee": "0.0015 ETH",
          "timestamp": "15:14:02 IST",
          "chain": "ethereum",
          "riskLevel": "CRITICAL"
        }
      ]
    },
    {
      "source": "node-vasp-deposit",
      "target": "node-vasp-hot",
      "value": "6.22 ETH (3 txs)",
      "currency": "ETH",
      "txHash": "0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa",
      "timestamp": "17:45:00 IST",
      "fee": "0.0009 ETH",
      "chain": "ethereum",
      "isBridge": false,
      "heuristic": "VASP Scheduled Batch Sweep (10-block window)",
      "txCount": 3,
      "individualTxs": [
        {
          "hash": "0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa",
          "from": "0x3456789012345678901234567890123456789012",
          "to": "0x5ACe48b8E8A5E44598F1c667a421b4A59714Da31",
          "valueStr": "3.22 ETH",
          "fee": "0.0003 ETH",
          "timestamp": "17:45:00 IST",
          "chain": "ethereum",
          "riskLevel": "SAFE"
        },
        {
          "hash": "0x887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa11",
          "from": "0x3456789012345678901234567890123456789012",
          "to": "0x5ACe48b8E8A5E44598F1c667a421b4A59714Da31",
          "valueStr": "2.00 ETH",
          "fee": "0.0003 ETH",
          "timestamp": "17:45:12 IST",
          "chain": "ethereum",
          "riskLevel": "SAFE"
        },
        {
          "hash": "0x7766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa22",
          "from": "0x3456789012345678901234567890123456789012",
          "to": "0x5ACe48b8E8A5E44598F1c667a421b4A59714Da31",
          "valueStr": "1.00 ETH",
          "fee": "0.0003 ETH",
          "timestamp": "17:45:25 IST",
          "chain": "ethereum",
          "riskLevel": "SAFE"
        }
      ]
    }
  ],
  "heuristics": [
    {
      "code": "H1",
      "name": "Deposit Address Reuse",
      "status": "MATCH",
      "badge": "in:8, out:2",
      "isTriggered": true,
      "summary": "Funnel ratio confirms inbound transactions consolidate into a centralized exchange deposit vault."
    },
    {
      "code": "H2",
      "name": "Temporal Consolidation",
      "status": "MATCH",
      "badge": "\u0394t \u2264 10 BLOCKS",
      "isTriggered": true,
      "summary": "Rapid multi-hop sweeping sequence observed across consecutive block windows."
    },
    {
      "code": "H3",
      "name": "Contract & VASP Fingerprinting",
      "status": "ATTRIBUTED",
      "badge": "JACCARD: 0.87 (CoinDCX)",
      "isTriggered": true,
      "summary": "Attributed to CoinDCX liquidity custody network via contract fingerprint overlap."
    },
    {
      "code": "H4",
      "name": "GraphSAGE Inductive GNN",
      "status": "SUSPICIOUS",
      "badge": "P = 0.920",
      "isTriggered": true,
      "summary": "12-dimensional topological embedding classifies destination as high-risk laundering (FAN_OUT_FAN_IN (Temporal Layering))."
    }
  ]
};

// Ensure all WazirX nodes have full transactions
for (const n of EXACT_WAZIRX_TRACE.nodes) {
  if (!n.transactions || n.transactions.length === 0) {
    n.transactions = generateNodeTransactions(n.address, n.chain || 'ethereum', n.type);
    n.txCount = n.transactions.length;
  }
}
for (const l of EXACT_WAZIRX_TRACE.links) {
  if (!l.individualTxs || l.individualTxs.length === 0) {
    const s = String(l.source);
    const t = String(l.target);
    l.individualTxs = generateCorridorTxs(s, t, l.value, l.chain || 'ethereum');
    l.txCount = l.individualTxs.length;
  }
}

export const MOCK_TRACE_GRAPH: TraceGraphData = EXACT_WAZIRX_TRACE;

// 3. DYNAMIC TRACE SELECTOR
export function generateDynamicTrace(rawAddress: string, chain: ChainType = 'ethereum'): TraceGraphData {
  const addr = rawAddress.trim();
  const lower = addr.toLowerCase();

  // 1. LAZARUS GROUP MATCH (Exact address or keywords)
  if (lower === '0x098b716b8aaf21512996dc57eb0615e2383e2f96' || lower.includes('lazarus') || lower.includes('ronin') || lower.includes('0x098b')) {
    return JSON.parse(JSON.stringify(EXACT_LAZARUS_TRACE));
  }

  // 2. WAZIRX FIR BENCHMARK MATCH
  if (lower === '0x71c438d9a40326e7a2b9d0b5030225d3129889a4' || lower.includes('wazirx') || lower.includes('71c') || lower.includes('sanjay')) {
    return JSON.parse(JSON.stringify(EXACT_WAZIRX_TRACE));
  }

  // 3. BITCOIN CASE MATCH
  if (lower.startsWith('bc1') || lower.startsWith('1') || lower.startsWith('3') || lower.includes('ramesh')) {
    const root = addr || 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';
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
          address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          label: 'UTXO Peel Intermediary',
          type: 'INTERMEDIARY',
          chain: 'bitcoin',
          balance: '0.0000 BTC',
          riskScore: 82,
          confidence: 96,
          txCount: 23,
          transactions: generateNodeTransactions('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'bitcoin', 'INTERMEDIARY')
        },
        {
          id: 'node-2',
          address: '0xCoinDCX_Vault_01824a91',
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
          transactions: generateNodeTransactions('0xCoinDCX_Vault_01824a91', 'bitcoin', 'EXCHANGE_HOT')
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
          individualTxs: generateCorridorTxs(root, '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', '3.45 BTC', 'bitcoin')
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
          individualTxs: generateCorridorTxs('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', '0xCoinDCX_Vault_01824a91', '3.448 BTC', 'bitcoin')
        }
      ]
    };
  }

  // 4. VITALIK BUTERIN MATCH
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
      ]
    };
  }

  // 5. DEFAULT ARBITRARY CASE: Unique custom graph derived from address
  const root = addr || '0x71C438D9A40326e7a2b9d0b5030225d3129889A4';
  const effectiveChain: ChainType = (root.startsWith('bc1') || root.startsWith('1') || root.startsWith('3')) ? 'bitcoin' : chain;
  const symbol = effectiveChain === 'bitcoin' ? 'BTC' : 'ETH';

  let seed = 0;
  for (let i = 0; i < root.length; i++) {
    seed = (seed * 31 + root.charCodeAt(i)) & 0xffffffff;
  }
  const absSeed = Math.abs(seed);
  const stolenAmountNum = ((absSeed % 450) / 10 + 1.25).toFixed(2);
  const hopCount = (absSeed % 3) + 2;
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
    ]
  };
}

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'case-001',
    acknowledgementNo: 'NCRP-2026-DEL-89210',
    firNumber: 'FIR-402/2026',
    policeStation: 'Special Cell Cyber PS, Mandir Marg',
    victimName: 'Aditya Sharma',
    suspectAddress: '0x71C438D9A40326e7a2b9d0b5030225d3129889A4',
    chain: 'ethereum',
    amount: '12.50 ETH (~₹31.2 Lakhs)',
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

export function generateDynamicDossier(
  caseRef?: string,
  trace?: TraceGraphData,
  metadata?: {
    victimName?: string;
    firNumber?: string;
    policeUnit?: string;
    ioName?: string;
    amount?: string;
  }
): CourtDossier {
  const activeTrace = trace || EXACT_WAZIRX_TRACE;
  
  // Find matching complaint by caseRef or suspect root address
  const matchingComplaint = MOCK_COMPLAINTS.find(
    (c) => (caseRef && (c.acknowledgementNo.toLowerCase() === caseRef.toLowerCase() || c.id.toLowerCase() === caseRef.toLowerCase() || c.firNumber.toLowerCase().includes(caseRef.toLowerCase())))
        || (activeTrace.rootAddress && c.suspectAddress.toLowerCase() === activeTrace.rootAddress.toLowerCase())
  );

  const firNumber = metadata?.firNumber || matchingComplaint?.firNumber || 'FIR-402/2026 u/s 66D IT Act & 318(4) BNS';
  const victimName = metadata?.victimName || matchingComplaint?.victimName || (activeTrace.rootAddress ? `Complainant (${activeTrace.rootAddress.slice(0, 8)}...)` : 'Aditya Sharma');
  const policeUnit = metadata?.policeUnit || matchingComplaint?.policeStation || 'Delhi Police Special Cell (Cyber Operations)';
  const ioName = metadata?.ioName || matchingComplaint?.ioName || 'Inspector R. K. Sharma';
  const effectiveCaseRef = caseRef || matchingComplaint?.acknowledgementNo || 'NCRP-2026-DEL-89210';
  const totalAmount = metadata?.amount || matchingComplaint?.amount || activeTrace.totalValueStolen;
  const confidencePct = Math.round(activeTrace.confidence <= 1 ? activeTrace.confidence * 100 : activeTrace.confidence);

  // Match designated terminal exchange or fallback to registered VASP
  const vasp = MOCK_VASPS.find(
    (v) => v.name.toLowerCase() === activeTrace.targetEntity.toLowerCase() ||
           activeTrace.targetEntity.toLowerCase().includes(v.name.toLowerCase()) ||
           v.knownHotWallets.some(w => w.toLowerCase() === activeTrace.rootAddress.toLowerCase())
  ) || MOCK_VASPS[0];

  return {
    caseRef: effectiveCaseRef,
    firNumber: firNumber,
    suspectTargetId: activeTrace.rootAddress,
    investigatingOfficer: `${ioName}, Cyber Crime Division`,
    unit: policeUnit,
    sha256Digest: '7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    ipfsCid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    synopsisEn: `Forensic blockchain attribution initiated under ${effectiveCaseRef} established that stolen funds (${totalAmount}) siphoned from complainant ${victimName} were routed through a ${activeTrace.totalHops}-hop ${activeTrace.typology} obfuscation network. Automated multi-hop heuristics and GraphSAGE neural clustering conclusively attributed the terminal funds to domestic exchange ${vasp.name} (${vasp.fiuRegNumber}) with ${confidencePct}% confidence. Statutory directive under Section 94 BNSS prepared for compliance dispatch.`,
    synopsisHi: `एनसीआरपी शिकायत ${effectiveCaseRef} (शिकायतकर्ता: ${victimName}) के अंतर्गत संदिग्ध वॉलेट ${activeTrace.rootAddress} की ब्लॉकचेन फोरेंसिक जांच पूर्ण की गई। कुल ${activeTrace.totalHops} चरणों के उपरांत उड़ाई गई धनराशि (${totalAmount}) को ${activeTrace.typology} नेटवर्क के माध्यम से अंतरित पाया गया। चेनवॉच फोरेंसिक इंजन द्वारा ${confidencePct}% विश्वसनीयता के साथ यह राशि एफआईयू-पंजीकृत एक्सचेंज ${vasp.name} के अधिकृत खाते में प्रमाणित की गई। धारा 94 बीएनएसएस नोटिस तैयार किया गया है।`,
    traceData: activeTrace,
    assignedVASP: vasp,
    section94NoticePreview: `NOTICE UNDER SECTION 94 OF BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023 / SEC 91 CrPC

To:
The Nodal Officer (Law Enforcement Inquiries),
${vasp.legalEntity} (${vasp.name}),
${vasp.jurisdiction}
FIU-IND Registration: ${vasp.fiuRegNumber}

Subject: URGENT STATUTORY NOTICE TO FREEZE VDA DEPOSIT ACCOUNTS IN ${firNumber}

Whereas an investigation into cyber fraud under ${firNumber} at ${policeUnit} reveals that illicit proceeds amounting to ${totalAmount} stolen from complainant ${victimName} were deposited into your exchange vault cluster:
Target Root: ${activeTrace.rootAddress}
Attributed Destination: ${vasp.name} Vault

YOU ARE HEREBY DIRECTED TO:
1. Immediately freeze and suspend all outbound withdrawal, transfer, and swap facilities for this deposit vault cluster within your ${vasp.freezeSlaHours}-hour statutory SLA.
2. Furnish full KYC dossier (Aadhaar, PAN, Passport, IP access logs, linked Indian bank accounts).
3. Transmit a Certificate of Electronic Evidence under Section 63 of Bharatiya Sakshya Adhiniyam (BSA), 2023.

Issued under seal of Law Enforcement:
${ioName}
${policeUnit}`,
    isSigned: true,
    generatedAt: new Date().toISOString(),
    victimName: victimName,
    llmModel: 'Ollama (Llama 3 8B)'
  };
}

export const MOCK_DOSSIER: CourtDossier = generateDynamicDossier('NCRP-2026-DEL-89210', EXACT_WAZIRX_TRACE);
