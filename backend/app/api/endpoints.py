import time
from typing import List, Optional
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Response, Query
from app.models.schema import (
    Complaint,
    ComplaintCreateRequest,
    TraceRequest,
    TraceGraphData,
    VASPRegistryEntry,
    CourtDossier,
    FreezeNoticeRequest,
    FreezeNoticeResponse,
    ReportGenerateRequest,
    HealthResponse
)
from app.data.seed_vasps import SEED_VASPS, get_vasp_by_id
from app.services.trace_service import trace_service
from app.services.evidence_service import EvidenceService
from app.services.sahyog_service import SahyogService
from app.core.config import settings

router = APIRouter()
START_TIME = time.time()

# --------------------------------------------------------------------------
# System Health & Prometheus Metrics
# --------------------------------------------------------------------------
@router.get("/health", response_model=HealthResponse, tags=["System"])
def get_health():
    uptime = time.time() - START_TIME
    return HealthResponse(
        status="OPERATIONAL",
        version=settings.APP_VERSION,
        uptime_seconds=round(uptime, 2),
        algorithms_active=[
            "GraphSAGE_GNN_Inductive",
            "Heuristic_1_Deposit_Reuse",
            "Heuristic_2_Temporal_Sweep",
            "Heuristic_3_Contract_Jaccard",
            "Cross_Chain_Bridge_Detector",
            "Laundering_Topology_Detector",
            "Analyst_In_A_Box_Narrator",
            "SHA256_HSM_Evidence_Sealer"
        ],
        fiu_vasp_count=len(SEED_VASPS),
        gnn_model_status="LOADED_LOCAL_INDUCTIVE"
    )

@router.get("/metrics", tags=["System"])
def get_prometheus_metrics():
    uptime = time.time() - START_TIME
    metrics_text = (
        f"# HELP chainwatch_uptime_seconds Total backend uptime in seconds\n"
        f"# TYPE chainwatch_uptime_seconds gauge\n"
        f"chainwatch_uptime_seconds {uptime:.2f}\n\n"
        f"# HELP chainwatch_active_vasps Number of FIU-IND registered VASPs loaded\n"
        f"# TYPE chainwatch_active_vasps gauge\n"
        f"chainwatch_active_vasps {len(SEED_VASPS)}\n\n"
        f"# HELP chainwatch_benchmark_trace_seconds Average trace turnaround time\n"
        f"# TYPE chainwatch_benchmark_trace_seconds gauge\n"
        f"chainwatch_benchmark_trace_seconds {settings.AVERAGE_BENCHMARK_SECONDS}\n\n"
        f"# HELP chainwatch_attribution_accuracy_pct Estimated model attribution accuracy\n"
        f"# TYPE chainwatch_attribution_accuracy_pct gauge\n"
        f"chainwatch_attribution_accuracy_pct {settings.ATTRIBUTION_ACCURACY_PCT}\n\n"
        f"# HELP chainwatch_avg_cost_inr Cost per trace in INR\n"
        f"# TYPE chainwatch_avg_cost_inr gauge\n"
        f"chainwatch_avg_cost_inr {settings.AVERAGE_COST_INR}\n"
    )
    return Response(content=metrics_text, media_type="text/plain; version=0.0.4")

# --------------------------------------------------------------------------
# 1. Complaint Intake (NCRP / SAHYOG Pipeline)
# --------------------------------------------------------------------------
@router.get("/complaints", response_model=List[Complaint], tags=["Complaints"])
def list_complaints():
    """Returns active complaints ingested from NCRP / 1930 / SAHYOG pipeline."""
    return trace_service.get_all_complaints()

@router.post("/complaints", response_model=Complaint, tags=["Complaints"])
def create_complaint(request: ComplaintCreateRequest):
    """Ingests a new cyber fraud complaint and enqueues automated tracing."""
    return trace_service.create_complaint(request)

# --------------------------------------------------------------------------
# 2. Blockchain Multi-Hop Forensics Trace
# --------------------------------------------------------------------------
@router.post("/trace", response_model=TraceGraphData, tags=["Forensic Tracing"])
def run_trace(request: TraceRequest):
    """
    Executes automated multi-hop blockchain BFS trace,
    GraphSAGE GNN classification, and exchange attribution.
    """
    return trace_service.run_trace(request)

@router.get("/trace/{trace_id}", response_model=TraceGraphData, tags=["Forensic Tracing"])
def get_trace(trace_id: str):
    """Retrieves forensic trace graph and attribution findings by trace ID."""
    res = trace_service.get_trace_by_id(trace_id)
    if not res:
        raise HTTPException(status_code=404, detail="Trace record not found")
    return res

@router.websocket("/trace/{trace_id}/stream")
async def websocket_trace_stream(websocket: WebSocket, trace_id: str):
    """
    Streams live node-by-node and link-by-link graph discovery events
    matching Section 8.2 WebSocket contract.
    """
    await websocket.accept()
    try:
        async for event_payload in trace_service.stream_trace_events(trace_id):
            await websocket.send_text(event_payload)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.close()

# --------------------------------------------------------------------------
# 3. FIU-IND Registered VASP Directory
# --------------------------------------------------------------------------
@router.get("/exchanges", response_model=List[VASPRegistryEntry], tags=["VASP Registry"])
def list_vasps():
    """Lists verified Indian and international crypto exchanges registered with FIU-IND."""
    return SEED_VASPS

@router.get("/vasps", response_model=List[VASPRegistryEntry], tags=["VASP Registry"])
def list_vasps_alias():
    """Alias for /exchanges endpoint."""
    return SEED_VASPS

# --------------------------------------------------------------------------
# 4. Court-Admissible Dossier & Legal Evidence Packets
# --------------------------------------------------------------------------
@router.get("/reports/{case_ref}", response_model=CourtDossier, tags=["Legal Evidence"])
def get_dossier(case_ref: str):
    """
    Generates or fetches an immutable court-admissible forensic dossier
    with SHA-256 seal, IPFS reference, and bilingual narrative.
    """
    trace_data = trace_service.get_trace_by_id("default")
    return EvidenceService.compile_dossier(
        trace_data=trace_data,
        case_ref=case_ref
    )

@router.get("/reports/{case_ref}/pdf", tags=["Legal Evidence"])
def download_dossier_pdf(
    case_ref: str,
    trace_id: Optional[str] = Query(None, description="Active trace ID"),
    wallet_address: Optional[str] = Query(None, description="Suspect target wallet address"),
    vasp_id: Optional[str] = Query(None, description="Target VASP ID")
):
    """
    Generates and downloads the official court-admissible PDF dossier
    with Ashoka insignia, Section 63 BSA certificate, and Section 94 notice.
    """
    from app.services.pdf_service import PDFDossierGenerator
    
    trace_data = None
    if trace_id:
        trace_data = trace_service.get_trace_by_id(trace_id)
    elif wallet_address:
        trace_data = trace_service.run_trace(TraceRequest(wallet_address=wallet_address))
    
    if not trace_data:
        trace_data = trace_service.get_trace_by_id("default")

    dossier = EvidenceService.compile_dossier(
        trace_data=trace_data,
        case_ref=case_ref,
        target_vasp_id=vasp_id or "vasp-001"
    )
    pdf_bytes = PDFDossierGenerator.generate_pdf_bytes(dossier)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="CHAINWATCH_Dossier_{case_ref}.pdf"'
        }
    )

@router.post("/reports", response_model=CourtDossier, tags=["Legal Evidence"])
def generate_report(request: ReportGenerateRequest):
    """Compiles a statutory investigation report for court submission."""
    trace_data = trace_service.get_trace_by_id(request.trace_id)
    return EvidenceService.compile_dossier(
        trace_data=trace_data,
        case_ref=request.case_ref or f"CASE-{request.trace_id[-5:]}"
    )

@router.post("/reports/pdf", tags=["Legal Evidence"])
def generate_report_pdf(request: ReportGenerateRequest):
    """Compiles and downloads statutory investigation PDF report directly."""
    from app.services.pdf_service import PDFDossierGenerator
    trace_data = trace_service.get_trace_by_id(request.trace_id)
    case_ref = request.case_ref or f"CASE-{request.trace_id[-5:]}"
    dossier = EvidenceService.compile_dossier(
        trace_data=trace_data,
        case_ref=case_ref
    )
    pdf_bytes = PDFDossierGenerator.generate_pdf_bytes(dossier)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="CHAINWATCH_Dossier_{case_ref}.pdf"'
        }
    )

# --------------------------------------------------------------------------
# 5. Section 94 BNSS Emergency Freeze Notice Dispatch
# --------------------------------------------------------------------------
@router.post("/freeze", response_model=FreezeNoticeResponse, tags=["Legal Dispatch"])
def dispatch_statutory_freeze(request: FreezeNoticeRequest):
    """
    Transmits an emergency statutory freeze notice under Section 94 BNSS, 2023
    directly to the designated VASP compliance nodal desk.
    """
    return SahyogService.dispatch_freeze_notice(request)

# --------------------------------------------------------------------------
# 6. Unified Typo-Tolerant Search (Complaints, VASPs, Wallets)
# --------------------------------------------------------------------------
@router.get("/search", tags=["Search"])
def unified_search(q: str = ""):
    """
    Instant search across complaints, wallet addresses,
    FIR numbers, and FIU-IND registered VASP profiles.
    """
    from app.services.search_service import UnifiedSearchService
    return UnifiedSearchService.search(q)
