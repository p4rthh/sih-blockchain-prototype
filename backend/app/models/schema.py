import re
from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

ChainType = Literal['ethereum', 'bsc', 'tron', 'bitcoin']

NodeType = Literal[
    'VICTIM',
    'SUSPECT_BURNER',
    'INTERMEDIARY',
    'BRIDGE_LOCK',
    'BRIDGE_MINT',
    'EXCHANGE_DEPOSIT',
    'EXCHANGE_HOT',
    'MIXER',
    'VERIFIED_ENTITY',
    'SMART_CONTRACT',
    'BENIGN_PUBLIC'
]

ComplaintStatus = Literal['QUEUED', 'TRACING', 'ATTRIBUTED', 'FROZEN']
FiuStatus = Literal['REGISTERED', 'NOTICED', 'SUSPENDED']

class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        serialize_by_alias=True
    )

    def __getattr__(self, item: str) -> Any:
        # Allow accessing both camelCase and snake_case attributes seamlessly
        s = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', item)
        snake = re.sub('([a-z0-9])([A-Z])', r'\1_\2', s).lower()
        if snake != item and snake in self.__dict__:
            return self.__dict__[snake]
        raise AttributeError(f"{type(self).__name__!r} object has no attribute {item!r}")

class FlowTransaction(CamelModel):
    hash: str
    from_addr: Optional[str] = Field(default=None, alias="from")
    to_addr: Optional[str] = Field(default=None, alias="to")
    value_str: str
    fee: str
    timestamp: str
    chain: ChainType = "ethereum"
    risk_level: Optional[str] = "CLEAN"

class GraphNode(CamelModel):
    id: str
    address: str
    label: str
    type: NodeType
    chain: ChainType
    balance: str = "0.00"
    risk_score: float = 0.0
    confidence: float = 1.0
    entity: Optional[str] = None
    cluster_id: Optional[str] = None
    tx_count: int = 1
    is_terminal: Optional[bool] = False
    transactions: Optional[List[FlowTransaction]] = None
    terminal_status: Optional[str] = None

class GraphLink(CamelModel):
    source: str
    target: str
    value: str
    currency: str
    tx_hash: str
    timestamp: str
    fee: str = "0.0001"
    chain: ChainType
    is_bridge: Optional[bool] = False
    heuristic: Optional[str] = None
    tx_count: Optional[int] = 1
    individual_txs: Optional[List[FlowTransaction]] = None

class HeuristicFinding(CamelModel):
    code: str
    name: str
    status: str
    badge: str
    is_triggered: bool
    summary: str

class TraceGraphData(CamelModel):
    trace_id: str
    root_address: str
    target_entity: str
    confidence: float = 0.85
    total_hops: int = 3
    total_value_stolen: str
    time_span: str = "3.2 hrs"
    risk_score: float = 0.88
    typology: str = "FAN_OUT_FAN_IN"
    nodes: List[GraphNode]
    links: List[GraphLink]
    heuristics: Optional[List[HeuristicFinding]] = None
    trail_status: Optional[str] = None
    trail_verdict: Optional[str] = None

class Complaint(CamelModel):
    id: str
    acknowledgement_no: str
    fir_number: str
    police_station: str
    victim_name: str
    suspect_address: str
    chain: ChainType = "ethereum"
    amount: str
    reported_at: str
    status: ComplaintStatus = "QUEUED"
    target_vasp: Optional[str] = Field(default=None, alias="targetVASP")
    risk_score: float = 0.85
    io_name: str
    zone: str = "Cyber Crime HQ, New Delhi"

class ComplaintCreateRequest(CamelModel):
    wallet_address: str
    chain: ChainType = "ethereum"
    complaint_id: Optional[str] = None
    victim_name: Optional[str] = "Confidential Complainant"
    amount: Optional[str] = "12.5 ETH"
    police_station: Optional[str] = "Special Cell PS, Mandir Marg"
    source: Literal["SAHYOG", "NCRP", "MANUAL"] = "NCRP"

class TraceRequest(CamelModel):
    wallet_address: str
    chain: ChainType = "ethereum"
    max_hops: int = 3
    direction: Literal["forward", "backward", "both"] = "forward"

class VASPRegistryEntry(CamelModel):
    id: str
    name: str
    legal_entity: str
    jurisdiction: str
    fiu_status: FiuStatus
    fiu_reg_number: str
    nodal_officer: str
    nodal_email: str
    emergency_phone: str
    freeze_sla_hours: int
    chains: List[ChainType]
    known_hot_wallets: List[str]
    deposit_count_24h: int = 1240
    compliance_portal_url: str

class CourtDossier(CamelModel):
    case_ref: str
    fir_number: str
    suspect_target_id: str
    investigating_officer: str
    unit: str
    sha256_digest: str
    ipfs_cid: str
    synopsis_en: str
    synopsis_hi: str
    trace_data: TraceGraphData
    assigned_vasp: VASPRegistryEntry = Field(alias="assignedVASP")
    section94_notice_preview: str
    is_signed: bool = True
    generated_at: str
    llm_model: Optional[str] = "Ollama (Llama 3.1 8B)"

class FreezeNoticeRequest(CamelModel):
    case_ref: str
    vasp_id: str
    officer_name: Optional[str] = "Inspector R. K. Sharma"
    statutory_act: str = "Section 94 BNSS, 2023 r/w Sec 63 BSA, 2023"

class FreezeNoticeResponse(CamelModel):
    success: bool = True
    ack_number: str
    timestamp: str
    vasp_id: str
    case_ref: str
    status: str = "DISPATCHED"
    message: str = "Statutory Freeze Notice successfully transmitted to FIU-IND designated VASP Nodal Officer."

class ReportGenerateRequest(CamelModel):
    trace_id: str
    case_ref: Optional[str] = None
    format: Literal["PDF", "JSON"] = "JSON"
    language: Literal["en", "hi", "bilingual"] = "bilingual"

class HealthResponse(CamelModel):
    status: str
    version: str
    uptime_seconds: float
    algorithms_active: List[str]
    fiu_vasp_count: int
    gnn_model_status: str
