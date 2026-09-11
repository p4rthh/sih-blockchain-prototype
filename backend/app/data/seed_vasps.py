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
            "0x27C703D144C33b79310C3691656A8F08",
            "0x721931508df476575964705339a5b9d2",
            "0x3456789012345678901234567890123456789012",
            "0x1111111254fb6c44bac0bed2854e76f90643097d",
            "0x2B591e99afE9f32eAA6214f7B7629768c40Eeb39",
            "0xWAZIRX_HOT_091B88102a9b",
            "0xc4c73eeef851cd63756fb607147b4d34ebfe458e",
            "0x9012345678901234567890123456789012345678",
            "0x876f2a8910dca298b31a01290812984180419283",
            "0x48a8342795cf64931a28a38c20188d3e2a2c070c",
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
            "0xCoinDCX_Vault_01824a91",
            "0x876f2a8910dca298b31a",
            "0xa1b2c3d4e5f60718293a4b5c6d7e8f9012345678",
            "0x43842f4f5459345e65660b45b596200219c670a4",
            "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            "bc1q7w00m97c0ygyvdgl30kclz6vwhc4tgy4966wue",
            "1CoinDCXCustodyVaultStorage78921a9"
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
            "0x2d816a7f34c20e5886d34b179e09581970b54321",
            "0x9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d",
            "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
            "1ZebPayIndiaHotSettlementReserve48a9"
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
            "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
            "0x0f2b3e4d5a6c7b8d9e0f1a2b3c4d5e6f7a8b9c0d",
            "0xCoinSwitch_Treasury_4a82",
            "0x7a9c8b7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b",
            "bc1q0switchkuber99128374619283746192837461",
            "bc1q876f2a8910dca298b31a012908129841804192"
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
            "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d",
            "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8",
            "0x56ed3064a3f9149576f4e69b0eb2f27718be6107",
            "0x9696f59e4d72e237be84ffd425dcad154bf96976",
            "0x4e9ce36e442e55ecd9025b9a6e0d88485d628a67",
            "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
            "0xd551234ae421e3bcba99a0da6d736074f22192ff",
            "bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h",
            "34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo"
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
            "0x9965507D1a55bcC2695C58ba16FB37d819B0A4df",
            "0xa4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5",
            "bc1qmudrexindiainstitutionalcustody89"
        ],
        deposit_count_24h=850,
        compliance_portal_url="https://mudrex.com/lea"
    ),
    VASPRegistryEntry(
        id="vasp-007",
        name="Bitbns",
        legal_entity="Buyhatke Internet Private Limited",
        jurisdiction="Bengaluru, Karnataka, India",
        fiu_status="REGISTERED",
        fiu_reg_number="FIU-IND-2023-VASP-0019",
        nodal_officer="Shri Gaurav Dahake, CEO & Regulatory Head",
        nodal_email="compliance-leo@bitbns.com",
        emergency_phone="+91-80-4718-5500",
        freeze_sla_hours=2,
        chains=["ethereum", "bsc", "bitcoin", "tron"],
        known_hot_wallets=[
            "0x524b07ebf058097d76cbfa0fdcfd6b83f0ad9c3b",
            "0x71b835e5d16d03f0b2f7f91757d5cb18e2bf451e",
            "0xd3c5e6f7a8b90123456789012345678901234567",
            "bc1qbitbnsindiacustodyvault09128374619"
        ],
        deposit_count_24h=1120,
        compliance_portal_url="https://bitbns.com/law-enforcement"
    ),
    VASPRegistryEntry(
        id="vasp-008",
        name="Giottus",
        legal_entity="Giottus Technologies Private Limited",
        jurisdiction="Chennai, Tamil Nadu, India",
        fiu_status="REGISTERED",
        fiu_reg_number="FIU-IND-2023-VASP-0022",
        nodal_officer="Shri Vikram Subburaj, CEO & LEA Desk",
        nodal_email="compliance@giottus.com",
        emergency_phone="+91-44-4855-2200",
        freeze_sla_hours=3,
        chains=["ethereum", "bitcoin", "bsc", "tron"],
        known_hot_wallets=[
            "0xa7c2b3d4e5f61728394a5b6c7d8e9f0123456789",
            "0x38b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9",
            "bc1qgiottuschennaicustodyvault991283"
        ],
        deposit_count_24h=940,
        compliance_portal_url="https://giottus.com/compliance-lea"
    ),
    VASPRegistryEntry(
        id="vasp-009",
        name="Unocoin",
        legal_entity="Unocoin Technologies Private Limited",
        jurisdiction="Bengaluru, Karnataka, India",
        fiu_status="REGISTERED",
        fiu_reg_number="FIU-IND-2023-VASP-0007",
        nodal_officer="Shri Sathvik Vishwanath, Director & Regulatory Lead",
        nodal_email="nodal@unocoin.com",
        emergency_phone="+91-80-4719-8800",
        freeze_sla_hours=4,
        chains=["ethereum", "bitcoin"],
        known_hot_wallets=[
            "0x19a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0",
            "1UnocoinIndiaOldestColdVaultStorage89",
            "bc1qunocoinindiabtcsettlementvault01"
        ],
        deposit_count_24h=620,
        compliance_portal_url="https://unocoin.com/in/legal/lea-portal"
    ),
    VASPRegistryEntry(
        id="vasp-010",
        name="KuCoin India",
        legal_entity="Peken Global Limited (FIU-IND Reporting Unit)",
        jurisdiction="Offshore (FIU-IND Registered)",
        fiu_status="REGISTERED",
        fiu_reg_number="FIU-IND-2024-VASP-0094",
        nodal_officer="Regional Enforcement Inquiries Division",
        nodal_email="compliance-in@kucoin.com",
        emergency_phone="+1-888-294-1188",
        freeze_sla_hours=12,
        chains=["ethereum", "bitcoin", "bsc", "tron"],
        known_hot_wallets=[
            "0x163a3d582852eb8ef41ec61204689622d8fd8b7c",
            "0xa9d1e08c7793af67e9d92fe308d5697fb81d3e43",
            "0xd6216fc19db775df9774a6e33526131da7d19a2c",
            "bc1ql49ydapnjafl5t2cp9zqpjwe6pdgmxy98859v2"
        ],
        deposit_count_24h=14200,
        compliance_portal_url="https://kucoin.com/land/law-enforcement-request"
    )
]

def get_vasp_by_id(vasp_id: str) -> Optional[VASPRegistryEntry]:
    low_id = vasp_id.strip().lower()
    for v in SEED_VASPS:
        if v.id.lower() == low_id or v.name.lower() == low_id or v.name.lower() in low_id:
            return v
    return None

def find_vasp_by_hot_wallet(wallet_address: str) -> Optional[VASPRegistryEntry]:
    if not wallet_address:
        return None
    normalized = wallet_address.strip().lower()

    # 1. Exact match on known hot wallets
    for v in SEED_VASPS:
        for hw in v.known_hot_wallets:
            if hw.strip().lower() == normalized:
                return v

    # 2. Heuristic alias or name matching (e.g. 0xWAZIRX_HOT...)
    alias_map = {
        "wazirx": "vasp-001",
        "coindcx": "vasp-002",
        "zebpay": "vasp-003",
        "coinswitch": "vasp-004",
        "binance": "vasp-005",
        "mudrex": "vasp-006",
        "bitbns": "vasp-007",
        "giottus": "vasp-008",
        "unocoin": "vasp-009",
        "kucoin": "vasp-010",
    }
    for keyword, v_id in alias_map.items():
        if keyword in normalized:
            return get_vasp_by_id(v_id)

    return None
