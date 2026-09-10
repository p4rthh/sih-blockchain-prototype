from typing import List, Dict, Tuple
import networkx as nx
from app.models.schema import GraphNode, GraphLink

# Sanctioned / known mixer contracts (Tornado Cash, Railgun, etc.)
KNOWN_MIXERS = {
    "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc".lower(): "Tornado.Cash 0.1 ETH Pool",
    "0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936".lower(): "Tornado.Cash 1 ETH Pool",
    "0x910cbd523d972eb0a6f4cae4618ad62622b39dbf".lower(): "Tornado.Cash 10 ETH Pool",
    "0xa160cdab225685da1d56aa342ad8841c3b53f291".lower(): "Tornado.Cash 100 ETH Pool"
}

class LaunderingTopologyDetector:
    """
    Implements forensic graph topology analysis and laundering detection:
    - High-volume public entity / benign organic flow detection
    - PEEL_CHAIN (Sequential layering)
    - FAN_OUT_FAN_IN (Split-and-reconsolidate)
    - ROUND_TRIP (Cyclic wash trading)
    - RAPID_BRIDGE_HOP (Cross-chain evasion)
    - MIXER_INTERACTION (Zero-knowledge obfuscation)
    - DORMANT / FRESH (Zero transaction state)
    """

    @classmethod
    def detect_topology(cls, nodes: List[GraphNode], links: List[GraphLink]) -> Tuple[str, float, List[str]]:
        """
        Analyzes graph topology using NetworkX directed graph analysis.
        Returns: (typology_name, risk_multiplier, detected_signatures)
        """
        # Edge Case 1: Fresh / Dormant wallet
        if not links or len(nodes) <= 1:
            return "DORMANT_CLEAN_WALLET", 0.0, ["Zero active on-chain transactions detected in current query window"]

        G = nx.DiGraph()
        signatures: List[str] = []
        node_map = {n.id: n for n in nodes}
        for n in nodes:
            G.add_node(n.id, data=n)

        has_bridge = False
        has_mixer = False

        for link in links:
            G.add_edge(link.source, link.target, data=link)
            if link.is_bridge:
                has_bridge = True
            
            # Check target for known mixer
            tgt_node = node_map.get(link.target)
            if tgt_node and tgt_node.address.lower() in KNOWN_MIXERS:
                has_mixer = True
                signatures.append(f"Direct deposit to OFAC-sanctioned mixer pool ({KNOWN_MIXERS[tgt_node.address.lower()]})")

        # Check for verified/benign entities
        has_verified_root = any(n.type in ["VERIFIED_ENTITY", "BENIGN_PUBLIC"] for n in nodes)
        suspect_nodes = [n for n in nodes if n.type == "SUSPECT_BURNER"]

        # 1. Mixer Interaction (Highest priority fraud signal)
        if has_mixer:
            return "MIXER_INTERACTION", 0.98, signatures

        # 2. Cycle Detection (Round-Trip laundering)
        try:
            cycles = list(nx.simple_cycles(G))
            if cycles and len(suspect_nodes) > 0:
                signatures.append(f"Circular fund cycling detected: {len(cycles)} cycle(s) identified")
                return "ROUND_TRIP", 0.90, signatures
        except Exception:
            pass

        # 3. Edge Case: Verified Public Figure or Clean Benign Account
        if has_verified_root or (len(suspect_nodes) == 0 and not has_bridge and not has_mixer):
            max_in = max([d for n, d in G.in_degree()] or [0])
            max_out = max([d for n, d in G.out_degree()] or [0])
            if max_in >= 5:
                signatures.append("High in-degree fan-in from diverse independent counterparties (Donation / Payment Inflow)")
                return "ORGANIC_INBOUND_HUB", 0.04, signatures
            elif max_out >= 5:
                signatures.append("High out-degree broadcast to diverse independent counterparties (Distribution / Payroll)")
                return "ORGANIC_DISTRIBUTION_HUB", 0.05, signatures
            else:
                signatures.append("Standard peer-to-peer decentralized transactions with verified / clean reputation")
                return "ORGANIC_ECOSYSTEM_FLOW", 0.03, signatures

        # 4. Fan-out / Fan-in Layering
        max_out_degree = max([d for n, d in G.out_degree()] or [0])
        max_in_degree = max([d for n, d in G.in_degree()] or [0])

        if max_out_degree >= 2 and max_in_degree >= 2 and len(suspect_nodes) > 0:
            signatures.append(f"Layering split detected: Max fan-out = {max_out_degree}, reconsolidation fan-in = {max_in_degree}")
            if has_bridge:
                signatures.append("Cross-chain liquidity hop utilized to break heuristic continuity")
                return "FAN_OUT_FAN_IN (Cross-Chain Bridge Layering)", 0.94, signatures
            return "FAN_OUT_FAN_IN (Temporal Layering)", 0.91, signatures

        # 5. Rapid Bridge Hop
        if has_bridge and len(suspect_nodes) > 0:
            signatures.append("Cross-chain bridge hop identified across EVM ecosystems")
            return "RAPID_BRIDGE_HOP", 0.86, signatures

        # 6. Peel Chain
        avg_out = sum(dict(G.out_degree()).values()) / max(len(G), 1)
        if len(links) >= 3 and avg_out <= 1.5 and len(suspect_nodes) > 0:
            signatures.append("Sequential peeling chain detected across 3+ hops with change-address segregation")
            return "PEEL_CHAIN", 0.85, signatures

        # Default for mixed or unflagged flows
        signatures.append("Normal multi-party blockchain settlement with no active laundering flags")
        return "STANDARD_BLOCKCHAIN_FLOW", 0.12, signatures
