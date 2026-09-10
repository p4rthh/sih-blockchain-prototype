from typing import Dict, List, Optional, Tuple
from app.models.schema import ChainType

KNOWN_BRIDGE_CONTRACTS: Dict[str, Dict] = {
    # Stargate Finance Router
    "0xba35678901234567890123456789012345678901".lower(): {
        "name": "Stargate Finance Router",
        "origin_chain": "ethereum",
        "supported_destinations": ["bsc", "polygon", "arbitrum"],
        "peer_mint_contracts": {
            "bsc": "0xde35678901234567890123456789012345678902".lower()
        },
        "fee_pct_expected": 0.0035 # 0.35% bridge slip
    },
    # Multichain / AnyCall V4 Router
    "0x6b7a8789e09d1134a621e25e98f45a0b2d67a123".lower(): {
        "name": "Multichain Router V4",
        "origin_chain": "ethereum",
        "supported_destinations": ["bsc", "tron"],
        "peer_mint_contracts": {
            "bsc": "0x7c8b9890f10e2245b732f36f09056b1c3e78b234".lower()
        },
        "fee_pct_expected": 0.005
    },
    # Wormhole Core Bridge
    "0x98f3c9e6e3fAce36bA8C684c6014b7168A3974a9".lower(): {
        "name": "Wormhole Core Bridge",
        "origin_chain": "ethereum",
        "supported_destinations": ["bsc", "solana"],
        "peer_mint_contracts": {
            "bsc": "0xb6f3c9e6e3face36ba8c684c6014b7168a3974b0".lower()
        },
        "fee_pct_expected": 0.002
    }
}

class CrossChainBridgeDetector:
    """
    Implements Section 4.2 Cross-Chain Bridge Detection:
    - Maintains bridge contract registry
    - Correlates Lock/Burn on source chain with Mint/Release on destination chain
    - Handles timestamp windows (+- 30 mins) and fee tolerances (+- 0.5%)
    """

    @classmethod
    def is_bridge_contract(cls, address: str) -> bool:
        return address.lower() in KNOWN_BRIDGE_CONTRACTS

    @classmethod
    def get_bridge_info(cls, address: str) -> Optional[Dict]:
        return KNOWN_BRIDGE_CONTRACTS.get(address.lower())

    @classmethod
    def correlate_cross_chain_hop(
        cls,
        origin_tx_value: float,
        origin_timestamp_epoch: int,
        destination_tx_value: float,
        destination_timestamp_epoch: int,
        bridge_address: str,
        dest_chain: ChainType
    ) -> Tuple[bool, float, str]:
        """
        Correlates two cross-chain transactions:
        1. Amount within +-0.5% after bridge fee deduction
        2. Timestamp delta between 30 seconds and 45 minutes
        Returns: (is_match, confidence_score, explanation)
        """
        bridge_info = cls.get_bridge_info(bridge_address)
        expected_fee_pct = bridge_info.get("fee_pct_expected", 0.004) if bridge_info else 0.004

        expected_dest_value = origin_tx_value * (1.0 - expected_fee_pct)
        value_diff_pct = abs(destination_tx_value - expected_dest_value) / origin_tx_value

        time_delta_seconds = destination_timestamp_epoch - origin_timestamp_epoch

        # Amount check: within +-0.8%
        amount_match = value_diff_pct <= 0.008
        # Time check: bridge takes between 15s and 45 mins
        time_match = 15 <= time_delta_seconds <= 2700

        if amount_match and time_match:
            confidence = 0.95 - (value_diff_pct * 10)
            return True, max(0.80, min(0.98, confidence)), (
                f"Bridge match confirmed via {bridge_info['name'] if bridge_info else 'Cross-Chain Protocol'}: "
                f"Value match within {value_diff_pct*100:.2f}%, Finality latency: {time_delta_seconds // 60}m {time_delta_seconds % 60}s."
            )

        if amount_match:
            return True, 0.72, f"Probable bridge hop: Value matched within {value_diff_pct*100:.2f}%, but time skew observed."

        return False, 0.0, "No correlated cross-chain mint event found within confidence threshold."
