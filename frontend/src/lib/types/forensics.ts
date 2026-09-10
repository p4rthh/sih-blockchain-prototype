export type ChainType = 'ethereum' | 'bsc' | 'tron' | 'bitcoin';

export type NodeType = 
  | 'VICTIM'
  | 'SUSPECT_BURNER'
  | 'INTERMEDIARY'
  | 'BRIDGE_LOCK'
  | 'BRIDGE_MINT'
  | 'EXCHANGE_DEPOSIT'
  | 'EXCHANGE_HOT'
  | 'MIXER'
  | 'VERIFIED_ENTITY'
  | 'SMART_CONTRACT'
  | 'BENIGN_PUBLIC';

export interface FlowTransaction {
  hash: string;
  from?: string;
  to?: string;
  valueStr: string;
  fee: string;
  timestamp: string;
  chain: ChainType;
  riskLevel?: 'SAFE' | 'CLEAN' | 'BALANCED' | 'SUSPICIOUS' | 'CRITICAL';
}

export interface GraphNode {
  id: string;
  address: string;
  label: string;
  type: NodeType;
  chain: ChainType;
  balance: string;
  riskScore: number;
  confidence: number;
  entity?: string;
  clusterId?: string;
  txCount: number;
  isTerminal?: boolean;
  transactions?: FlowTransaction[];
  terminalStatus?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  value: string;
  currency: string;
  txHash: string;
  timestamp: string;
  fee: string;
  chain: ChainType;
  isBridge?: boolean;
  heuristic?: string;
  txCount?: number;
  individualTxs?: FlowTransaction[];
}

export interface HeuristicFinding {
  code: string;
  name: string;
  status: string;
  badge: string;
  isTriggered: boolean;
  summary: string;
}

export interface TraceGraphData {
  traceId: string;
  rootAddress: string;
  targetEntity: string;
  confidence: number;
  totalHops: number;
  totalValueStolen: string;
  timeSpan: string;
  riskScore: number;
  typology: string;
  nodes: GraphNode[];
  links: GraphLink[];
  heuristics?: HeuristicFinding[];
  trailVerdict?: string;
  trailStatus?: string;
}

export interface Complaint {
  id: string;
  acknowledgementNo: string;
  firNumber: string;
  policeStation: string;
  victimName: string;
  suspectAddress: string;
  chain: ChainType;
  amount: string;
  reportedAt: string;
  status: 'QUEUED' | 'TRACING' | 'ATTRIBUTED' | 'FROZEN';
  targetVASP?: string;
  riskScore: number;
  ioName: string;
  zone: string;
}

export interface VASPRegistryEntry {
  id: string;
  name: string;
  legalEntity: string;
  jurisdiction: string;
  fiuStatus: 'REGISTERED' | 'NOTICED' | 'SUSPENDED';
  fiuRegNumber: string;
  nodalOfficer: string;
  nodalEmail: string;
  emergencyPhone: string;
  freezeSlaHours: number;
  chains: ChainType[];
  knownHotWallets: string[];
  depositCount24h: number;
  compliancePortalUrl: string;
}

export interface CourtDossier {
  caseRef: string;
  firNumber: string;
  suspectTargetId: string;
  investigatingOfficer: string;
  unit: string;
  sha256Digest: string;
  ipfsCid: string;
  synopsisEn: string;
  synopsisHi: string;
  traceData: TraceGraphData;
  assignedVASP: VASPRegistryEntry;
  section94NoticePreview: string;
  isSigned: boolean;
  generatedAt: string;
}
