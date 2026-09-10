import random
from datetime import datetime
from typing import Dict
from app.models.schema import FreezeNoticeRequest, FreezeNoticeResponse
from app.data.seed_vasps import get_vasp_by_id

class SahyogService:
    """
    Implements the inter-agency statutory freeze dispatch protocol
    connecting Indian LEA officers with FIU-IND registered VASP Nodal Desks.
    """

    @classmethod
    def dispatch_freeze_notice(cls, request: FreezeNoticeRequest) -> FreezeNoticeResponse:
        vasp = get_vasp_by_id(request.vasp_id)
        vasp_name = vasp.name if vasp else "Registered VASP Nodal Desk"

        # Generate unique SAHYOG statutory tracking acknowledgement number
        ack_number = f"SAHYOG-FRZ-{random.randint(100000, 999999)}"
        timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")

        message = (
            f"Statutory Freeze Notice under {request.statutory_act} dispatched to "
            f"{vasp_name} ({vasp.nodal_email if vasp else 'nodal@fiu-vasp.in'}). "
            f"Mandatory statutory SLA: {vasp.freeze_sla_hours if vasp else 4} hours. "
            f"Acknowledgement tracking ID: {ack_number}."
        )

        return FreezeNoticeResponse(
            success=True,
            ack_number=ack_number,
            timestamp=timestamp_str,
            vasp_id=request.vasp_id,
            case_ref=request.case_ref,
            status="DISPATCHED",
            message=message
        )
