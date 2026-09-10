import asyncio
import json
from typing import Dict, List, Optional, AsyncGenerator
from datetime import datetime, timezone
from app.models.schema import Complaint, TraceGraphData, ComplaintCreateRequest, TraceRequest
from app.data.seed_complaints import INITIAL_COMPLAINTS
from app.engine.tracer import GraphTracer
from app.engine.narrator import InvestigativeNarrator
from app.services.evidence_service import EvidenceService

class TraceService:
    """
    Orchestrates complaint intake, multi-hop blockchain tracing,
    and WebSocket event emission for real-time forensic visualization.
    """

    def __init__(self):
        # In-memory storage seeded with initial complaints
        self.complaints: Dict[str, Complaint] = {c.id: c for c in INITIAL_COMPLAINTS}
        self.traces: Dict[str, TraceGraphData] = {}

    def get_all_complaints(self) -> List[Complaint]:
        return list(self.complaints.values())

    def get_complaint_by_id(self, complaint_id: str) -> Optional[Complaint]:
        return self.complaints.get(complaint_id)

    def create_complaint(self, req: ComplaintCreateRequest) -> Complaint:
        cid = req.complaint_id or f"case-{len(self.complaints) + 10928}"
        ack = f"NCRP-2026-DEL-{len(self.complaints) * 1111 + 4000}"
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M IST")

        complaint = Complaint(
            id=cid,
            acknowledgement_no=ack,
            fir_number=f"FIR-{len(self.complaints) + 400}/2026",
            police_station=req.police_station or "Special Cell Cyber Crime PS, Mandir Marg",
            victim_name=req.victim_name or "Confidential Complainant",
            suspect_address=req.wallet_address,
            chain=req.chain,
            amount=req.amount or "10.00 ETH",
            reported_at=now_str,
            status="QUEUED",
            target_vasp=None,
            risk_score=0.88,
            io_name="Inspector R. K. Sharma",
            zone="Southern Cyber Range, New Delhi"
        )
        self.complaints[cid] = complaint
        return complaint

    def run_trace(self, req: TraceRequest) -> TraceGraphData:
        trace_data = GraphTracer.execute_trace(
            wallet_address=req.wallet_address,
            chain=req.chain,
            max_hops=req.max_hops,
            direction=req.direction
        )
        self.traces[trace_data.trace_id] = trace_data
        
        # Link back to any matching complaint
        for c in self.complaints.values():
            if c.suspect_address.lower() in req.wallet_address.lower() or req.wallet_address.lower() in c.suspect_address.lower():
                c.status = "ATTRIBUTED"
                c.target_vasp = trace_data.target_entity
                c.risk_score = trace_data.risk_score
                break

        return trace_data

    def get_trace_by_id(self, trace_id: str) -> Optional[TraceGraphData]:
        if trace_id in self.traces:
            return self.traces[trace_id]
        
        # If not already executed, run a default trace
        trace_data = GraphTracer.execute_trace(wallet_address="0x71C438D9A40326e7a2b9d0b5030225d3129889A4")
        self.traces[trace_data.trace_id] = trace_data
        return trace_data

    async def stream_trace_events(self, trace_id: str) -> AsyncGenerator[str, None]:
        """
        Emits live WebSocket events as per Section 8.2 of SIH Master Plan:
        1. NODE_DISCOVERED (each node as discovered)
        2. EDGE_ADDED (each transaction link)
        3. ATTRIBUTION_FOUND (VASP cluster detected)
        4. COMPLETE (final graph ready)
        """
        trace_data = self.get_trace_by_id(trace_id)
        if not trace_data:
            trace_data = self.run_trace(TraceRequest(wallet_address="0x71C438D9A40326e7a2b9d0b5030225d3129889A4"))

        # Step 1: Stream root and nodes
        for node in trace_data.nodes:
            event = {
                "type": "NODE_DISCOVERED",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": node.model_dump(by_alias=True)
            }
            yield json.dumps(event)
            await asyncio.sleep(0.3)

        # Step 2: Stream edges
        for link in trace_data.links:
            event = {
                "type": "EDGE_ADDED",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": link.model_dump(by_alias=True)
            }
            yield json.dumps(event)
            await asyncio.sleep(0.3)

        # Step 3: Attribution event
        yield json.dumps({
            "type": "ATTRIBUTION_FOUND",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "data": {
                "targetEntity": trace_data.target_entity,
                "confidence": trace_data.confidence,
                "typology": trace_data.typology,
                "riskScore": trace_data.risk_score
            }
        })
        await asyncio.sleep(0.2)

        # Step 4: Complete
        yield json.dumps({
            "type": "COMPLETE",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "data": trace_data.model_dump(by_alias=True)
        })

trace_service = TraceService()
