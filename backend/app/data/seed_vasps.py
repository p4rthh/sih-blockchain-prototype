from typing import List, Dict, Optional
from app.models.schema import VASPRegistryEntry

SEED_VASPS: List[VASPRegistryEntry] = [
    VASPRegistryEntry(
        id="vasp-001",
        name="WazirX",
        legal_entity="Zanmai Labs Private Limited",
        jurisdiction="India (Registered FIU Entity)",
        fiu_status="REGISTERED",
        fiu_reg_number="FIU-IND-2023-VASP-001",
        nodal_officer="Shri Arvind Singhal, Head of Regulatory Affairs",
        nodal_email="nodal-police@wazirx.com",
        emergency_phone="+91-22-4893-1100 (24x7 LEA Desk)",
        freeze_sla_hours=2,
        chains=["ethereum", "bsc", "tron", "bitcoin"],
        known_hot_wallets=[
            "0x5ACe48b8E8A5E44598F1c667a421b4A59714Da31",
            "0x91d90479d20c5d57d76d4981d3f0cbdfd55b85d0",
            "0x1111111254fb6c44bac0bed2854e76f90643097d",
            "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        ],
        deposit_count_24h=4820,
        compliance_portal_url="https://compliance.wazirx.com/lea/portal"
    ),
    VASPRegistryEntry(
        id="vasp-002",
        name="CoinDCX",
        legal_entity="Neblio Technologies Private Limited",
        jurisdiction="India (Registered FIU Entity)",
        fiu_status="REGISTERED",
        fiu_reg_number="FIU-IND-2023-VASP-002",
        nodal_officer="Smt. Priyanka Rao, VP Legal & Compliance",
        nodal_email="nodal.officer@coindcx.com",
        emergency_phone="+91-80-6922-8800 (Law Enforcement Desk)",
        freeze_sla_hours=4,
        chains=["ethereum", "bitcoin", "tron", "bsc"],
        known_hot_wallets=[
            "0x7890123456789012345678901234567890123456",
            "0x8894e0a0c962cb723c19fc560899dd33e0047745",
            "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
        ],
        deposit_count_24h=6190,
        compliance_portal_url="https://coindcx.com/legal/lea-dashboard"
    ),
    VASPRegistryEntry(
        id="vasp-003",
        name="ZebPay",
        legal_entity="Awlencan Innovations India Limited",
        jurisdiction="India (FIU-IND Reporting Entity)",
        fiu_status="REGISTERED",
        fiu_reg_number="FIU-IND-2023-VASP-003",
        nodal_officer="Shri Vikramaditya Sharma, Chief Compliance Officer",
        nodal_email="compliance-desk@zebpay.com",
        emergency_phone="+91-79-6777-4400 (Statutory Cell)",
        freeze_sla_hours=6,
        chains=["ethereum", "bitcoin"],
        known_hot_wallets=[
            "0x3456789012345678901234567890123456789012",
            "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq"
        ],
        deposit_count_24h=1420,
        compliance_portal_url="https://zebpay.com/regulatory-requests"
    ),
    VASPRegistryEntry(
        id="vasp-004",
        name="CoinSwitch",
        legal_entity="Bitcipher Labs LLP",
        jurisdiction="India (FIU-IND Registered)",
        fiu_status="REGISTERED",
        fiu_reg_number="FIU-IND-2023-VASP-005",
        nodal_officer="Shri Rohan Joshi, Head Compliance & Law Enforcement",
        nodal_email="lea.escalation@coinswitch.co",
        emergency_phone="+91-80-4568-1200",
        freeze_sla_hours=3,
        chains=["ethereum", "bitcoin", "bsc", "tron"],
        known_hot_wallets=[
            "0x4b43343469e38d62A9fD9d685210B39f045053B2",
            "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
        ],
        deposit_count_24h=3910,
        compliance_portal_url="https://coinswitch.co/lea-inquiry"
    ),
    VASPRegistryEntry(
        id="vasp-005",
        name="Binance India",
        legal_entity="Nest Services Limited (FIU-IND Compliance Unit)",
        jurisdiction="Offshore Registered with FIU-IND",
        fiu_status="REGISTERED",
        fiu_reg_number="FIU-IND-2024-VASP-011",
        nodal_officer="Mr. Gregory C., Special Inquiries Lead (South Asia)",
        nodal_email="lawenforcement-in@binance.com",
        emergency_phone="+1-888-912-3401 (Direct LEA Portal)",
        freeze_sla_hours=12,
        chains=["ethereum", "bsc", "bitcoin", "tron"],
        known_hot_wallets=[
            "0x28C6c06298d514Db089934071355E5743bf21d60",
            "0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549",
            "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d"
        ],
        deposit_count_24h=18400,
        compliance_portal_url="https://kodexglobal.com/binance/india"
    ),
    VASPRegistryEntry(
        id="vasp-006",
        name="Mudrex",
        legal_entity="Mudrex Wealth Technologies Private Limited",
        jurisdiction="India (FIU-IND Reporting Entity)",
        fiu_status="REGISTERED",
        fiu_reg_number="FIU-IND-2023-VASP-004",
        nodal_officer="Shri Alok Kumar, Compliance Manager",
        nodal_email="compliance@mudrex.com",
        emergency_phone="+91-80-4718-9100",
        freeze_sla_hours=4,
        chains=["ethereum", "bitcoin", "tron"],
        known_hot_wallets=[
            "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df"
        ],
        deposit_count_24h=850,
        compliance_portal_url="https://mudrex.com/lea"
    )
]

def get_vasp_by_id(vasp_id: str) -> Optional[VASPRegistryEntry]:
    for v in SEED_VASPS:
        if v.id.lower() == vasp_id.lower() or v.name.lower() == vasp_id.lower():
            return v
    return None

def find_vasp_by_hot_wallet(wallet_address: str) -> Optional[VASPRegistryEntry]:
    normalized = wallet_address.strip().lower()
    for v in SEED_VASPS:
        for hw in v.known_hot_wallets:
            if hw.strip().lower() == normalized:
                return v
    return None
