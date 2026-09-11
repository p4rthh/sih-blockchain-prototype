from typing import Dict
from app.models.schema import TraceGraphData, GraphNode, GraphLink, FlowTransaction

# Primary SIH Demo Scenario: WazirX 12.5 ETH Heist & Bridge Hop
DEFAULT_TRACE_GRAPH: TraceGraphData = TraceGraphData(
    trace_id="TRC-2026-DEL-89412",
    root_address="0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
    target_entity="WazirX (Zanmai Labs Pvt Ltd)",
    confidence=0.87,
    total_hops=4,
    total_value_stolen="12.50 ETH (₹31,25,000)",
    time_span="3.2 hrs",
    risk_score=92.0,
    typology="FAN_OUT_FAN_IN (Temporal Layering)",
    nodes=[
        GraphNode(
            id="node-victim",
            address="0x1A2B3C4D5E6F7890123456789ABCDEF012345678",
            label="Victim (Complainant Origin)",
            type="VICTIM",
            chain="ethereum",
            balance="0.05 ETH",
            risk_score=0.05,
            confidence=1.0,
            entity="Complainant Origin",
            tx_count=42,
            is_terminal=False
        ),
        GraphNode(
            id="node-suspect",
            address="0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
            label="Suspect Burner Alpha",
            type="SUSPECT_BURNER",
            chain="ethereum",
            balance="0.00 ETH",
            risk_score=0.98,
            confidence=0.99,
            entity="Suspect Primary",
            cluster_id="CLUST-091",
            tx_count=4,
            is_terminal=False
        ),
        GraphNode(
            id="node-inter-1",
            address="0x4567890123456789012345678901234567890123",
            label="Intermediary Burner-A",
            type="INTERMEDIARY",
            chain="ethereum",
            balance="0.00 ETH",
            risk_score=0.89,
            confidence=0.92,
            entity="Laundering Layer 1",
            cluster_id="CLUST-091",
            tx_count=2,
            is_terminal=False
        ),
        GraphNode(
            id="node-inter-2",
            address="0x7890123456789012345678901234567890123456",
            label="Intermediary Burner-B",
            type="INTERMEDIARY",
            chain="ethereum",
            balance="0.00 ETH",
            risk_score=0.86,
            confidence=0.90,
            entity="Laundering Layer 1",
            cluster_id="CLUST-091",
            tx_count=2,
            is_terminal=False
        ),
        GraphNode(
            id="node-bridge-lock",
            address="0xBa35678901234567890123456789012345678901",
            label="Stargate Cross-Chain Router",
            type="BRIDGE_LOCK",
            chain="ethereum",
            balance="412.8 ETH",
            risk_score=0.45,
            confidence=0.98,
            entity="Stargate Finance Bridge",
            tx_count=19200,
            is_terminal=False
        ),
        GraphNode(
            id="node-bridge-mint",
            address="0xDe35678901234567890123456789012345678902",
            label="Stargate BSC Relayer",
            type="BRIDGE_MINT",
            chain="bsc",
            balance="89.1 BNB",
            risk_score=0.45,
            confidence=0.98,
            entity="Stargate Finance Bridge",
            tx_count=14120,
            is_terminal=False
        ),
        GraphNode(
            id="node-consolidation",
            address="0xEE35678901234567890123456789012345678903",
            label="Consolidation Wallet",
            type="INTERMEDIARY",
            chain="bsc",
            balance="0.10 BNB",
            risk_score=0.91,
            confidence=0.88,
            entity="Peel Consolidator",
            cluster_id="CLUST-091",
            tx_count=6,
            is_terminal=False
        ),
        GraphNode(
            id="node-vasp-deposit",
            address="0x3456789012345678901234567890123456789012",
            label="WazirX User Deposit Vault",
            type="EXCHANGE_DEPOSIT",
            chain="ethereum",
            balance="0.00 ETH",
            risk_score=0.78,
            confidence=0.94,
            entity="WazirX India (FIU-IND-2023-VASP-001)",
            cluster_id="WAZIRX-CLUSTER-4",
            tx_count=12,
            is_terminal=False
        ),
        GraphNode(
            id="node-vasp-hot",
            address="0x5ACe48b8E8A5E44598F1c667a421b4A59714Da31",
            label="WazirX Hot Wallet 04",
            type="EXCHANGE_HOT",
            chain="ethereum",
            balance="18,421.40 ETH",
            risk_score=0.12,
            confidence=0.99,
            entity="WazirX Sovereign Hot Pool",
            cluster_id="WAZIRX-CLUSTER-4",
            tx_count=482100,
            is_terminal=True
        )
    ],
    links=[
        GraphLink(
            source="node-victim",
            target="node-suspect",
            value="12.50 ETH",
            currency="ETH",
            tx_hash="0xaa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef",
            timestamp="14:32:10 IST",
            fee="0.0021 ETH",
            chain="ethereum",
            heuristic="Phishing Transfer Authorization",
            tx_count=1,
            individual_txs=[
                FlowTransaction(
                    hash="0xaa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef",
                    from_addr="0x1A2B3C4D5E6F7890123456789ABCDEF012345678",
                    to_addr="0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
                    value_str="12.50 ETH",
                    fee="0.0021 ETH",
                    timestamp="14:32:10 IST",
                    chain="ethereum",
                    risk_level="CRITICAL"
                )
            ]
        ),
        GraphLink(
            source="node-suspect",
            target="node-inter-1",
            value="6.25 ETH (2 txs)",
            currency="ETH",
            tx_hash="0xbb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01",
            timestamp="14:35:44 IST",
            fee="0.0018 ETH",
            chain="ethereum",
            heuristic="Fan-Out Split (50% Split)",
            tx_count=2,
            individual_txs=[
                FlowTransaction(
                    hash="0xbb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01",
                    from_addr="0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
                    to_addr="0x4567890123456789012345678901234567890123",
                    value_str="3.25 ETH",
                    fee="0.0009 ETH",
                    timestamp="14:35:44 IST",
                    chain="ethereum",
                    risk_level="SUSPICIOUS"
                ),
                FlowTransaction(
                    hash="0xbb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef09",
                    from_addr="0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
                    to_addr="0x4567890123456789012345678901234567890123",
                    value_str="3.00 ETH",
                    fee="0.0009 ETH",
                    timestamp="14:37:02 IST",
                    chain="ethereum",
                    risk_level="SUSPICIOUS"
                )
            ]
        ),
        GraphLink(
            source="node-suspect",
            target="node-inter-2",
            value="6.25 ETH",
            currency="ETH",
            tx_hash="0xcc3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef02",
            timestamp="14:36:12 IST",
            fee="0.0019 ETH",
            chain="ethereum",
            heuristic="Fan-Out Split (50% Split)",
            tx_count=1,
            individual_txs=[
                FlowTransaction(
                    hash="0xcc3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef02",
                    from_addr="0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
                    to_addr="0x7890123456789012345678901234567890123456",
                    value_str="6.25 ETH",
                    fee="0.0019 ETH",
                    timestamp="14:36:12 IST",
                    chain="ethereum",
                    risk_level="SUSPICIOUS"
                )
            ]
        ),
        GraphLink(
            source="node-inter-1",
            target="node-bridge-lock",
            value="6.20 ETH",
            currency="ETH",
            tx_hash="0xdd4e5f67890123456789abcdef0123456789abcdef0123456789abcdef03",
            timestamp="14:48:20 IST",
            fee="0.0042 ETH",
            chain="ethereum",
            is_bridge=True,
            heuristic="Stargate Router Lock (Dest: BSC)",
            tx_count=1,
            individual_txs=[
                FlowTransaction(
                    hash="0xdd4e5f67890123456789abcdef0123456789abcdef0123456789abcdef03",
                    from_addr="0x4567890123456789012345678901234567890123",
                    to_addr="0xBa35678901234567890123456789012345678901",
                    value_str="6.20 ETH",
                    fee="0.0042 ETH",
                    timestamp="14:48:20 IST",
                    chain="ethereum",
                    risk_level="CRITICAL"
                )
            ]
        ),
        GraphLink(
            source="node-bridge-lock",
            target="node-bridge-mint",
            value="6.18 ETH (eqv. BNB)",
            currency="BNB",
            tx_hash="0xee5f67890123456789abcdef0123456789abcdef0123456789abcdef04",
            timestamp="14:52:10 IST",
            fee="0.0005 BNB",
            chain="bsc",
            is_bridge=True,
            heuristic="Cross-Chain Correlated Mint (Delta: 3.8 mins, 0.32% fee)",
            tx_count=1,
            individual_txs=[
                FlowTransaction(
                    hash="0xee5f67890123456789abcdef0123456789abcdef0123456789abcdef04",
                    from_addr="0xBa35678901234567890123456789012345678901",
                    to_addr="0xDe35678901234567890123456789012345678902",
                    value_str="6.18 ETH (eqv. BNB)",
                    fee="0.0005 BNB",
                    timestamp="14:52:10 IST",
                    chain="bsc",
                    risk_level="BALANCED"
                )
            ]
        ),
        GraphLink(
            source="node-bridge-mint",
            target="node-consolidation",
            value="6.17 BNB",
            currency="BNB",
            tx_hash="0xff6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a",
            timestamp="15:02:40 IST",
            fee="0.0003 BNB",
            chain="bsc",
            heuristic="Consolidation Sweep",
            tx_count=1,
            individual_txs=[
                FlowTransaction(
                    hash="0xff6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a",
                    from_addr="0xDe35678901234567890123456789012345678902",
                    to_addr="0xEE35678901234567890123456789012345678903",
                    value_str="6.17 BNB",
                    fee="0.0003 BNB",
                    timestamp="15:02:40 IST",
                    chain="bsc",
                    risk_level="SUSPICIOUS"
                )
            ]
        ),
        GraphLink(
            source="node-inter-2",
            target="node-vasp-deposit",
            value="6.22 ETH",
            currency="ETH",
            tx_hash="0x11223344556677889900aabbccddeeff0011223344556677889900aabbccddee",
            timestamp="15:14:02 IST",
            fee="0.0015 ETH",
            chain="ethereum",
            heuristic="Direct Exchange User Deposit",
            tx_count=1,
            individual_txs=[
                FlowTransaction(
                    hash="0x11223344556677889900aabbccddeeff0011223344556677889900aabbccddee",
                    from_addr="0x7890123456789012345678901234567890123456",
                    to_addr="0x3456789012345678901234567890123456789012",
                    value_str="6.22 ETH",
                    fee="0.0015 ETH",
                    timestamp="15:14:02 IST",
                    chain="ethereum",
                    risk_level="CRITICAL"
                )
            ]
        ),
        GraphLink(
            source="node-vasp-deposit",
            target="node-vasp-hot",
            value="6.22 ETH (3 txs)",
            currency="ETH",
            tx_hash="0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa",
            timestamp="17:45:00 IST",
            fee="0.0009 ETH",
            chain="ethereum",
            heuristic="VASP Scheduled Batch Sweep (10-block window)",
            tx_count=3,
            individual_txs=[
                FlowTransaction(
                    hash="0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa",
                    from_addr="0x3456789012345678901234567890123456789012",
                    to_addr="0x5ACe48b8E8A5E44598F1c667a421b4A59714Da31",
                    value_str="3.22 ETH",
                    fee="0.0003 ETH",
                    timestamp="17:45:00 IST",
                    chain="ethereum",
                    risk_level="SAFE"
                ),
                FlowTransaction(
                    hash="0x887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa11",
                    from_addr="0x3456789012345678901234567890123456789012",
                    to_addr="0x5ACe48b8E8A5E44598F1c667a421b4A59714Da31",
                    value_str="2.00 ETH",
                    fee="0.0003 ETH",
                    timestamp="17:45:12 IST",
                    chain="ethereum",
                    risk_level="SAFE"
                ),
                FlowTransaction(
                    hash="0x7766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa22",
                    from_addr="0x3456789012345678901234567890123456789012",
                    to_addr="0x5ACe48b8E8A5E44598F1c667a421b4A59714Da31",
                    value_str="1.00 ETH",
                    fee="0.0003 ETH",
                    timestamp="17:45:25 IST",
                    chain="ethereum",
                    risk_level="SAFE"
                )
            ]
        )
    ]
)
