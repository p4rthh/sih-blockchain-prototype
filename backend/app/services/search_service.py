from typing import List, Dict, Any
from app.models.schema import Complaint, VASPRegistryEntry
from app.data.seed_vasps import SEED_VASPS
from app.services.trace_service import trace_service

class UnifiedSearchService:
    """
    Implements instant search across complaints, wallet addresses,
    FIR numbers, and FIU-IND registered VASP profiles.
    """

    @classmethod
    def search(cls, query: str) -> Dict[str, Any]:
        q = query.strip().lower()
        if not q:
            return {
                "query": query,
                "complaints": [],
                "vasps": [],
                "wallets": []
            }

        matched_complaints = []
        for c in trace_service.get_all_complaints():
            if (
                q in c.id.lower() or
                q in c.acknowledgement_no.lower() or
                q in c.fir_number.lower() or
                q in c.victim_name.lower() or
                q in c.police_station.lower() or
                q in c.suspect_address.lower() or
                q in (c.target_vasp or "").lower()
            ):
                matched_complaints.append(c)

        matched_vasps = []
        for v in SEED_VASPS:
            if (
                q in v.name.lower() or
                q in v.legal_entity.lower() or
                q in v.fiu_reg_number.lower() or
                q in v.nodal_officer.lower() or
                any(q in hw.lower() for hw in v.known_hot_wallets)
            ):
                matched_vasps.append(v)

        # Matched wallets across known hot wallets & suspect addresses
        matched_wallets = []
        for v in SEED_VASPS:
            for hw in v.known_hot_wallets:
                if q in hw.lower():
                    matched_wallets.append({
                        "address": hw,
                        "entity": v.name,
                        "type": "EXCHANGE_HOT",
                        "fiuStatus": v.fiu_status
                    })

        for c in trace_service.get_all_complaints():
            if q in c.suspect_address.lower():
                matched_wallets.append({
                    "address": c.suspect_address,
                    "entity": f"Suspect Target ({c.fir_number})",
                    "type": "SUSPECT_BURNER",
                    "status": c.status
                })

        return {
            "query": query,
            "total_matches": len(matched_complaints) + len(matched_vasps) + len(matched_wallets),
            "complaints": matched_complaints,
            "vasps": matched_vasps,
            "wallets": matched_wallets
        }
