import httpx
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timezone
from app.models.schema import GraphNode, GraphLink, ChainType, NodeType, FlowTransaction
from app.data.seed_vasps import SEED_VASPS, find_vasp_by_hot_wallet
from app.engine.heuristics import ExchangeClusteringHeuristics, SANCTIONED_MIXERS
from app.engine.bridge_detector import CrossChainBridgeDetector
from app.engine.known_entities import get_known_entity, KNOWN_VERIFIED_ENTITIES

EXPLORER_ENDPOINTS = {
    "ethereum": "https://eth.blockscout.com/api/v2",
    "bsc": "https://bsc.blockscout.com/api/v2",
    "polygon": "https://polygon.blockscout.com/api/v2",
}

BURN_ADDRESSES = {
    "0x0000000000000000000000000000000000000000",
    "0x000000000000000000000000000000000000dead",
    "0x0000000000000000000000000000000000000001",
    "0x0000000000000000000000000000000000000002"
}

class LiveBlockchainCrawler:
    """
    Crawls live, verifiable on-chain transactions and account telemetry directly
    from public blockchain indexers (Blockscout for EVM, Blockstream for Bitcoin).
    Zero API keys required.
    """

    @classmethod
    def fetch_address_metadata(cls, address: str, chain: ChainType = "ethereum") -> Dict:
        """
        Fetches true live on-chain balance, total transaction counters, ENS domain,
        contract status, and official reputation flags.
        """
        norm_address = address.strip().lower()

        # 1. Bitcoin handling
        if chain == "bitcoin" or norm_address.startswith("1") or norm_address.startswith("3") or norm_address.startswith("bc1"):
            try:
                url = f"https://blockstream.info/api/address/{norm_address}"
                with httpx.Client(timeout=7.0) as client:
                    resp = client.get(url)
                    if resp.status_code == 200:
                        data = resp.json()
                        stats = data.get("chain_stats", {})
                        funded = stats.get("funded_txo_sum", 0)
                        spent = stats.get("spent_txo_sum", 0)
                        bal_btc = (funded - spent) / 100_000_000.0
                        return {
                            "ens_domain_name": None,
                            "balance_str": f"{bal_btc:.4f} BTC",
                            "balance_num": bal_btc,
                            "tx_count": stats.get("tx_count", 0),
                            "is_contract": False,
                            "is_scam": False,
                            "reputation": "ok",
                            "chain": "bitcoin"
                        }
            except Exception as e:
                print(f"Blockstream address fetch error: {e}")
            return {
                "ens_domain_name": None,
                "balance_str": "0.0000 BTC",
                "balance_num": 0.0,
                "tx_count": 0,
                "is_contract": False,
                "is_scam": False,
                "reputation": "ok",
                "chain": "bitcoin"
            }

        # 2. EVM chains (Ethereum, BSC, Polygon)
        base_api = EXPLORER_ENDPOINTS.get(chain, EXPLORER_ENDPOINTS["ethereum"])
        curr_symbol = "BNB" if chain == "bsc" else ("POL" if chain == "polygon" else "ETH")

        meta_res = {
            "ens_domain_name": None,
            "balance_str": f"0.0000 {curr_symbol}",
            "balance_num": 0.0,
            "tx_count": 0,
            "is_contract": False,
            "is_scam": False,
            "reputation": "ok",
            "name": None,
            "chain": chain
        }

        try:
            with httpx.Client(timeout=7.0) as client:
                # Basic metadata & ENS
                addr_url = f"{base_api}/addresses/{norm_address}"
                r_addr = client.get(addr_url)
                if r_addr.status_code == 200:
                    d_addr = r_addr.json()
                    raw_bal = d_addr.get("coin_balance", "0")
                    try:
                        bal_val = int(raw_bal) / 10**18
                    except Exception:
                        bal_val = 0.0
                    
                    meta_res["ens_domain_name"] = d_addr.get("ens_domain_name")
                    meta_res["balance_str"] = f"{bal_val:.4f} {curr_symbol}"
                    meta_res["balance_num"] = bal_val
                    meta_res["is_contract"] = bool(d_addr.get("is_contract", False))
                    meta_res["is_scam"] = bool(d_addr.get("is_scam", False))
                    meta_res["reputation"] = d_addr.get("reputation", "ok")
                    meta_res["name"] = d_addr.get("name")

                # Counter stats (true global tx count)
                counters_url = f"{base_api}/addresses/{norm_address}/counters"
                r_counters = client.get(counters_url)
                if r_counters.status_code == 200:
                    d_counters = r_counters.json()
                    tx_c = d_counters.get("transactions_count", "0")
                    try:
                        meta_res["tx_count"] = int(tx_c)
                    except Exception:
                        meta_res["tx_count"] = 0
        except Exception as e:
            print(f"Blockscout address metadata fetch error: {e}")

        return meta_res

    @classmethod
    def fetch_live_transactions(cls, address: str, chain: ChainType = "ethereum", limit: int = 50) -> List[Dict]:
        """
        Fetches live transactions for a wallet address from public blockchain indexers.
        """
        norm_address = address.strip()

        # 1. Bitcoin handling
        if chain == "bitcoin" or norm_address.startswith("1") or norm_address.startswith("3") or norm_address.startswith("bc1"):
            try:
                url = f"https://blockstream.info/api/address/{norm_address}/txs"
                with httpx.Client(timeout=8.0) as client:
                    resp = client.get(url)
                    if resp.status_code == 200:
                        raw_txs = resp.json()
                        txs = []
                        for tx in raw_txs[:limit]:
                            vin_addrs = [v.get("prevout", {}).get("scriptpubkey_address") for v in tx.get("vin", []) if v.get("prevout")]
                            vout_addrs = [v.get("scriptpubkey_address") for v in tx.get("vout", []) if v.get("scriptpubkey_address")]
                            
                            from_addr = vin_addrs[0] if vin_addrs else "Unknown_Coinbase"
                            to_addr = vout_addrs[0] if vout_addrs else "Unknown_Output"
                            
                            total_sat = sum(v.get("value", 0) for v in tx.get("vout", []))
                            btc_val = total_sat / 100_000_000.0

                            txs.append({
                                "hash": tx.get("txid"),
                                "from": from_addr,
                                "to": to_addr,
                                "value_str": f"{btc_val:.4f} BTC",
                                "value_num": btc_val,
                                "fee": f"{tx.get('fee', 0)/100_000_000.0:.6f} BTC",
                                "timestamp": datetime.fromtimestamp(tx.get("status", {}).get("block_time", int(datetime.now().timestamp()))).strftime("%Y-%m-%d %H:%M IST"),
                                "chain": "bitcoin"
                            })
                        return txs
            except Exception as e:
                print(f"Blockstream live fetch error: {e}")
                return []

        # 2. EVM chains (Ethereum, BSC, Polygon)
        base_api = EXPLORER_ENDPOINTS.get(chain, EXPLORER_ENDPOINTS["ethereum"])
        url = f"{base_api}/addresses/{norm_address}/transactions"

        try:
            with httpx.Client(timeout=8.0) as client:
                resp = client.get(url)
                if resp.status_code != 200:
                    return []

                data = resp.json()
                items = data.get("items", [])
                if not items:
                    return []

                clean_txs = []
                for item in items[:limit]:
                    tx_hash = item.get("hash", "")
                    from_obj = item.get("from") or {}
                    to_obj = item.get("to") or {}
                    from_addr = from_obj.get("hash", "")
                    to_addr = to_obj.get("hash", "")
                    
                    if not from_addr or not to_addr:
                        continue

                    raw_val = item.get("value", "0")
                    try:
                        eth_val = int(raw_val) / 10**18
                    except Exception:
                        eth_val = 0.0

                    curr = "BNB" if chain == "bsc" else ("POL" if chain == "polygon" else "ETH")
                    raw_fee = item.get("fee", {}).get("value", "0")
                    try:
                        fee_val = f"{int(raw_fee) / 10**18:.5f} {curr}"
                    except Exception:
                        fee_val = f"0.0005 {curr}"

                    ts_raw = item.get("timestamp", "")
                    try:
                        dt = datetime.fromisoformat(ts_raw.replace("Z", "+00:00"))
                        ts_formatted = dt.strftime("%Y-%m-%d %H:%M IST")
                    except Exception:
                        ts_formatted = datetime.now().strftime("%Y-%m-%d %H:%M IST")

                    clean_txs.append({
                        "hash": tx_hash,
                        "from": from_addr,
                        "to": to_addr,
                        "value_str": f"{eth_val:.4f} {curr}",
                        "value_num": eth_val,
                        "fee": fee_val,
                        "timestamp": ts_formatted,
                        "chain": chain
                    })

                return clean_txs
        except Exception as e:
            print(f"Blockscout live fetch error: {e}")
            return []

    @classmethod
    def attribute_single_node(
        cls,
        address: str,
        chain: ChainType,
        default_type: NodeType,
        default_label: str,
        default_entity: str,
        default_risk: float,
        tx_count: int = 1,
        is_terminal: bool = False
    ) -> GraphNode:
        norm = address.strip().lower()
        matched_vasp = find_vasp_by_hot_wallet(norm)
        is_mix = norm in SANCTIONED_MIXERS
        is_br = CrossChainBridgeDetector.is_bridge_contract(norm)
        cp_k = get_known_entity(norm)

        term_stat = None
        if norm in BURN_ADDRESSES:
            n_type: NodeType = "BENIGN_PUBLIC"
            n_label = "Null Burn Address"
            n_risk = 0.00
            n_entity = "Permanently Destroyed Tokens"
            is_term = True
            term_stat = "BURNED"
        elif is_mix:
            n_type: NodeType = "MIXER"
            n_label = SANCTIONED_MIXERS[norm]["name"]
            n_risk = 0.99
            n_entity = "OFAC Sanctioned Mixer Pool (Trail Lost)"
            is_term = True
            term_stat = "LOST_TO_MIXER"
        elif matched_vasp:
            n_type = "EXCHANGE_HOT"
            n_label = f"{matched_vasp.name} Hot Vault"
            n_risk = 0.12
            n_entity = matched_vasp.legal_entity
            is_term = True
            term_stat = "VASP_DEPOSIT"
        elif cp_k:
            n_type = cp_k.get("type", "VERIFIED_ENTITY")
            n_label = cp_k.get("name", "Verified Protocol")
            n_risk = cp_k.get("risk_score", 0.02)
            n_entity = cp_k.get("entity", "Public Ecosystem Account")
            is_term = cp_k.get("is_terminal", False)
            term_stat = "VERIFIED_PROTOCOL"
        elif is_br:
            n_type = "BRIDGE_LOCK"
            n_label = "Cross-Chain Bridge Router"
            n_risk = 0.35
            n_entity = "Bridge Liquidity Protocol"
            is_term = True
            term_stat = "CROSS_CHAIN_EXIT"
        else:
            n_type = default_type
            n_label = default_label
            n_risk = default_risk
            n_entity = default_entity
            is_term = is_terminal
            term_stat = "DORMANT_HOLDING" if is_terminal else "ACTIVE_FLOW"

        return GraphNode(
            id=f"node-{norm[:10]}",
            address=address,
            label=n_label,
            type=n_type,
            chain=chain,
            balance="Verified",
            risk_score=n_risk,
            confidence=0.92,
            entity=n_entity,
            tx_count=tx_count,
            is_terminal=is_term,
            terminal_status=term_stat
        )

    @classmethod
    def build_graph_from_live_txs(
        cls,
        root_address: str,
        chain: ChainType,
        txs: List[Dict],
        metadata: Optional[Dict] = None,
        is_reported_complaint: bool = False,
        max_hops: int = 3
    ) -> Tuple[List[GraphNode], List[GraphLink]]:
        """
        Builds an accurate, contextual forensic GraphNode and GraphLink topology.
        For suspects and fraud complaints, executes Multi-Hop Forward Tracing across hops.
        For benign entities and exchanges, builds an uncluttered counterparty cluster.
        """
        nodes_dict: Dict[str, GraphNode] = {}
        links: List[GraphLink] = []

        norm_root = root_address.strip().lower()
        metadata = metadata or cls.fetch_address_metadata(root_address, chain)

        # 1. Attribute Root Node
        known = get_known_entity(norm_root)
        is_sanctioned = norm_root in SANCTIONED_MIXERS
        root_vasp = find_vasp_by_hot_wallet(norm_root)

        root_type: NodeType = "INTERMEDIARY"
        root_label = f"Wallet ({root_address[:6]}...{root_address[-4:]})"
        root_risk = 0.04
        root_entity = "Standard On-Chain Wallet"
        root_terminal = False

        if is_sanctioned:
            root_type = "MIXER"
            root_label = SANCTIONED_MIXERS[norm_root]["name"]
            root_risk = 0.99
            root_entity = "OFAC Sanctioned ZK Mixer"
            root_terminal = True
        elif root_vasp:
            root_type = "EXCHANGE_HOT"
            root_label = f"{root_vasp.name} Hot Vault"
            root_risk = 0.10
            root_entity = root_vasp.legal_entity
            root_terminal = True
        elif known:
            root_type = known.get("type", "VERIFIED_ENTITY")
            root_label = known.get("name", "Verified Entity")
            root_risk = known.get("risk_score", 0.02)
            root_entity = known.get("entity", "Public Ecosystem Entity")
            root_terminal = known.get("is_terminal", False)
        elif is_reported_complaint or metadata.get("is_scam"):
            root_type = "SUSPECT_BURNER"
            root_label = f"Suspect Target ({root_address[:6]}...{root_address[-4:]})"
            root_risk = 0.96
            root_entity = "Investigation Target (NCRP/FIR)"
            root_terminal = False
        elif metadata.get("ens_domain_name"):
            root_type = "VERIFIED_ENTITY"
            root_label = f"{metadata['ens_domain_name']}"
            root_risk = 0.02
            root_entity = "Verified ENS Identity"
            root_terminal = False
        elif metadata.get("is_contract"):
            root_type = "SMART_CONTRACT"
            root_label = metadata.get("name") or f"Contract ({root_address[:6]}...{root_address[-4:]})"
            root_risk = 0.03
            root_entity = "Verified Smart Contract"
            root_terminal = True

        def create_flow_tx(t: Dict, fallback_risk: str = "CLEAN") -> FlowTransaction:
            f_l = (t.get("from") or "").lower()
            t_l = (t.get("to") or "").lower()
            if f_l in SANCTIONED_MIXERS or t_l in SANCTIONED_MIXERS:
                rl = "CRITICAL"
            elif find_vasp_by_hot_wallet(f_l) or find_vasp_by_hot_wallet(t_l):
                rl = "SAFE"
            elif is_reported_complaint or metadata.get("is_scam"):
                rl = "SUSPICIOUS"
            else:
                rl = fallback_risk
            return FlowTransaction(
                hash=t.get("hash", ""),
                from_addr=t.get("from"),
                to_addr=t.get("to"),
                value_str=t.get("value_str", "0.0000 ETH"),
                fee=t.get("fee", "0.0005 ETH"),
                timestamp=t.get("timestamp", ""),
                chain=t.get("chain", chain),
                risk_level=rl
            )

        root_all_flow_txs = [create_flow_tx(t, "CLEAN") for t in txs]

        root_node = GraphNode(
            id=f"node-{norm_root[:10]}",
            address=root_address,
            label=root_label,
            type=root_type,
            chain=chain,
            balance=metadata.get("balance_str", "Live"),
            risk_score=root_risk,
            confidence=0.99,
            entity=root_entity,
            tx_count=metadata.get("tx_count", len(txs)),
            is_terminal=root_terminal,
            transactions=root_all_flow_txs
        )
        nodes_dict[norm_root] = root_node

        if not txs:
            return list(nodes_dict.values()), []

        curr_symbol = "BTC" if chain == "bitcoin" else ("BNB" if chain == "bsc" else ("POL" if chain == "polygon" else "ETH"))
        is_suspect_flow = (root_node.type in ["SUSPECT_BURNER", "INTERMEDIARY"] or is_reported_complaint)

        # --------------------------------------------------------------------------
        # PATH A: Multi-Hop Forward Tracing for Investigation Targets & General Flows
        # --------------------------------------------------------------------------
        if is_suspect_flow and max_hops >= 2:
            # 1. Inbound flow (Victim / Complainant / Funding Source)
            inbound_txs = [t for t in txs if t["to"].lower() == norm_root and t["from"].lower() != norm_root]
            if inbound_txs:
                top_in = max(inbound_txs, key=lambda x: x["value_num"])
                v_addr = top_in["from"]
                is_fraud_case = bool(is_reported_complaint or metadata.get("is_scam") or root_node.type == "SUSPECT_BURNER")
                v_type: NodeType = "VICTIM" if is_fraud_case else "INTERMEDIARY"
                v_label = f"Victim ({v_addr[:6]}...{v_addr[-4:]})" if is_fraud_case else f"Funding Source ({v_addr[:6]}...{v_addr[-4:]})"
                v_entity = "Complainant Origin / Stolen Funds Source" if is_fraud_case else "Inbound Funding Source"
                v_risk = 0.03
                v_node = cls.attribute_single_node(
                    address=v_addr,
                    chain=chain,
                    default_type=v_type,
                    default_label=v_label,
                    default_entity=v_entity,
                    default_risk=v_risk
                )
                v_node.transactions = [create_flow_tx(t, "CLEAN") for t in inbound_txs]
                nodes_dict[v_addr.lower()] = v_node
                links.append(GraphLink(
                    source=v_node.id,
                    target=root_node.id,
                    value=top_in["value_str"],
                    currency=curr_symbol,
                    tx_hash=top_in["hash"],
                    timestamp=top_in["timestamp"],
                    fee=top_in["fee"],
                    chain=chain,
                    heuristic="Initial Inflow Transfer",
                    tx_count=1,
                    individual_txs=[FlowTransaction(
                        hash=top_in["hash"],
                        from_addr=top_in["from"],
                        to_addr=top_in["to"],
                        value_str=top_in["value_str"],
                        fee=top_in["fee"],
                        timestamp=top_in["timestamp"],
                        chain=chain,
                        risk_level="CLEAN"
                    )]
                ))

            # 2. Sequential Outbound Forward Hops (Follow the money downstream)
            curr_sender = norm_root
            curr_sender_node = root_node
            curr_txs = txs

            for hop_idx in range(1, max_hops + 1):
                out_groups: Dict[str, List[Dict]] = {}
                for t in curr_txs:
                    f = t["from"].lower()
                    to = t["to"].lower()
                    if f == curr_sender and to != curr_sender and to != norm_root:
                        if to not in out_groups:
                            out_groups[to] = []
                        out_groups[to].append(t)

                if not out_groups:
                    # Current sender node has 0 outgoing transactions! Funds are resting here.
                    if curr_sender_node.id != root_node.id:
                        curr_sender_node.terminal_status = "DORMANT_HOLDING"
                        curr_sender_node.is_terminal = True
                        if curr_sender_node.type == "INTERMEDIARY":
                            curr_sender_node.label = f"Holding Wallet ({curr_sender[:6]}...{curr_sender[-4:]})"
                            curr_sender_node.entity = "Dormant Burner / Holding Wallet (Funds Unspent)"
                    else:
                        root_node.terminal_status = "FUNDS_HELD_AT_ROOT"
                        root_node.is_terminal = True
                    break

                # Pick recipient receiving highest aggregated flow
                sorted_recips = sorted(
                    out_groups.keys(),
                    key=lambda r: sum(x["value_num"] for x in out_groups[r]),
                    reverse=True
                )

                top_rec = sorted_recips[0]
                if top_rec in nodes_dict:
                    break

                rec_txs = out_groups[top_rec]
                total_vol = sum(x["value_num"] for x in rec_txs)
                sample_t = rec_txs[0]

                # If this is Hop 1, also capture secondary branches (e.g. fund split across multiple burners/exchanges)
                if hop_idx == 1 and len(sorted_recips) > 1:
                    for sec_rec in sorted_recips[1:3]:
                        if sec_rec in nodes_dict:
                            continue
                        sec_txs = out_groups[sec_rec]
                        sec_vol = sum(x["value_num"] for x in sec_txs)
                        sec_t = sec_txs[0]
                        sec_node = cls.attribute_single_node(
                            address=sec_t["to"],
                            chain=chain,
                            default_type="INTERMEDIARY",
                            default_label=f"Branch Recipient ({sec_t['to'][:6]}...{sec_t['to'][-4:]})",
                            default_entity="Secondary Exfiltration Corridor",
                            default_risk=0.80 if is_suspect_flow else 0.35,
                            tx_count=len(sec_txs)
                        )
                        # Check forward transactions for secondary branch
                        sec_fwd = cls.fetch_live_transactions(sec_t["to"], chain=chain, limit=5)
                        sec_fwd_out = [t for t in sec_fwd if t["from"].lower() == sec_rec and t["to"].lower() != sec_rec]
                        if not sec_fwd_out and not sec_node.is_terminal:
                            sec_node.terminal_status = "DORMANT_HOLDING"
                            sec_node.is_terminal = True
                            sec_node.label = f"Holding Wallet ({sec_t['to'][:6]}...{sec_t['to'][-4:]})"
                            sec_node.entity = f"Dormant Burner (Unspent: {sec_vol:.4f} {curr_symbol})"
                        elif not sec_node.is_terminal:
                            sec_node.terminal_status = "ACTIVE_FLOW"

                        sec_node.transactions = [create_flow_tx(t, "SUSPICIOUS" if is_suspect_flow else "BALANCED") for t in sec_txs]
                        nodes_dict[sec_rec] = sec_node
                        cnt_s = f" ({len(sec_txs)} txs)" if len(sec_txs) > 1 else ""
                        links.append(GraphLink(
                            source=curr_sender_node.id,
                            target=sec_node.id,
                            value=f"{sec_vol:.4f} {curr_symbol}{cnt_s}",
                            currency=curr_symbol,
                            tx_hash=sec_t["hash"],
                            timestamp=sec_t["timestamp"],
                            fee=sec_t["fee"],
                            chain=chain,
                            is_bridge=(sec_node.type == "BRIDGE_LOCK"),
                            heuristic="Secondary Branch Dispersal",
                            tx_count=len(sec_txs),
                            individual_txs=[create_flow_tx(t, "BALANCED") for t in sec_txs]
                        ))

                rec_node = cls.attribute_single_node(
                    address=sample_t["to"],
                    chain=chain,
                    default_type="INTERMEDIARY",
                    default_label=f"Hop #{hop_idx} ({sample_t['to'][:6]}...{sample_t['to'][-4:]})",
                    default_entity=f"Laundering Hop {hop_idx} (Layering Mule)" if is_suspect_flow else f"Transfer Recipient {hop_idx}",
                    default_risk=0.85 if hop_idx == 1 and is_suspect_flow else (0.75 if is_suspect_flow else 0.30),
                    tx_count=len(rec_txs)
                )
                rec_node.transactions = [create_flow_tx(t, "SUSPICIOUS" if is_suspect_flow else "BALANCED") for t in rec_txs]

                heuristic_label = f"Hop #{hop_idx} Layering Transfer"
                if rec_node.type == "MIXER":
                    heuristic_label = "Zero-Knowledge Pool Deposit"
                elif rec_node.type == "EXCHANGE_HOT":
                    heuristic_label = "Direct Exchange User Deposit"
                elif rec_node.type == "BRIDGE_LOCK":
                    heuristic_label = "Cross-Chain Liquidity Lock"

                cnt_suf = f" ({len(rec_txs)} txs)" if len(rec_txs) > 1 else ""
                links.append(GraphLink(
                    source=curr_sender_node.id,
                    target=rec_node.id,
                    value=f"{total_vol:.4f} {curr_symbol}{cnt_suf}",
                    currency=curr_symbol,
                    tx_hash=sample_t["hash"],
                    timestamp=sample_t["timestamp"],
                    fee=sample_t["fee"],
                    chain=chain,
                    is_bridge=(rec_node.type == "BRIDGE_LOCK"),
                    heuristic=heuristic_label,
                    tx_count=len(rec_txs),
                    individual_txs=[
                        create_flow_tx(t, "CRITICAL" if rec_node.type == "MIXER" else ("SAFE" if rec_node.type == "EXCHANGE_HOT" else "SUSPICIOUS"))
                        for t in rec_txs
                    ]
                ))

                if rec_node.is_terminal:
                    nodes_dict[top_rec] = rec_node
                    break

                # Fetch downstream transactions for Hop k+1
                next_txs = []
                if hop_idx < max_hops:
                    next_txs = cls.fetch_live_transactions(sample_t["to"], chain=chain, limit=20)

                out_next = [t for t in next_txs if t["from"].lower() == top_rec and t["to"].lower() != top_rec] if next_txs else []
                if not out_next:
                    # Destination has 0 outgoing transactions! Funds are parked here!
                    rec_node.terminal_status = "DORMANT_HOLDING"
                    rec_node.is_terminal = True
                    rec_node.label = f"Holding Wallet ({sample_t['to'][:6]}...{sample_t['to'][-4:]})"
                    rec_node.entity = f"Dormant Holding Wallet (Unspent: {total_vol:.4f} {curr_symbol})"
                    nodes_dict[top_rec] = rec_node
                    break
                else:
                    rec_node.terminal_status = "ACTIVE_FLOW"
                    nodes_dict[top_rec] = rec_node
                    curr_sender = top_rec
                    curr_sender_node = rec_node
                    curr_txs = next_txs

            ordered_nodes = []
            if inbound_txs and v_addr.lower() in nodes_dict:
                ordered_nodes.append(nodes_dict[v_addr.lower()])
            if norm_root in nodes_dict:
                ordered_nodes.append(nodes_dict[norm_root])
            for n in nodes_dict.values():
                if n not in ordered_nodes:
                    ordered_nodes.append(n)

            return ordered_nodes, links

        # --------------------------------------------------------------------------
        # PATH B: Counterparty Clustering (for Benign Entities / Hot Wallets)
        # --------------------------------------------------------------------------
        cp_stats: Dict[str, Dict] = {}
        for tx in txs:
            from_addr = tx["from"].lower()
            to_addr = tx["to"].lower()
            other_addr = to_addr if from_addr == norm_root else from_addr
            if other_addr == norm_root:
                continue

            matched_vasp = find_vasp_by_hot_wallet(other_addr)
            is_mixer = other_addr in SANCTIONED_MIXERS
            is_bridge = CrossChainBridgeDetector.is_bridge_contract(other_addr)
            cp_known = get_known_entity(other_addr)

            if other_addr not in cp_stats:
                cp_stats[other_addr] = {
                    "address": other_addr,
                    "total_val": tx["value_num"],
                    "tx_count": 1,
                    "is_vasp": bool(matched_vasp),
                    "vasp_obj": matched_vasp,
                    "is_mixer": is_mixer,
                    "is_bridge": is_bridge,
                    "known_obj": cp_known,
                    "sample_tx": tx,
                    "all_txs": [tx],
                    "is_outgoing": (from_addr == norm_root)
                }
            else:
                cp_stats[other_addr]["total_val"] += tx["value_num"]
                cp_stats[other_addr]["tx_count"] += 1
                cp_stats[other_addr]["all_txs"].append(tx)

        sorted_cps = sorted(
            cp_stats.values(),
            key=lambda x: (
                1 if x["is_mixer"] else 0,
                1 if x["is_vasp"] else 0,
                1 if x["is_bridge"] else 0,
                x["total_val"]
            ),
            reverse=True
        )

        selected_cps = sorted_cps[:8]

        for cp in selected_cps:
            other_addr = cp["address"]
            matched_vasp = cp["vasp_obj"]
            is_mixer = cp["is_mixer"]
            is_bridge = cp["is_bridge"]
            cp_known = cp["known_obj"]
            is_outgoing = cp["is_outgoing"]

            if is_mixer:
                n_type: NodeType = "MIXER"
                n_label = SANCTIONED_MIXERS[other_addr]["name"]
                n_risk = 0.99
                n_entity = "OFAC Sanctioned Mixer Pool"
                is_terminal = True
            elif matched_vasp:
                n_type = "EXCHANGE_HOT"
                n_label = f"{matched_vasp.name} Inbound Vault"
                n_risk = 0.12
                n_entity = matched_vasp.legal_entity
                is_terminal = True
            elif cp_known:
                n_type = cp_known.get("type", "VERIFIED_ENTITY")
                n_label = cp_known.get("name", "Verified Protocol")
                n_risk = cp_known.get("risk_score", 0.02)
                n_entity = cp_known.get("entity", "Public Ecosystem Protocol")
                is_terminal = cp_known.get("is_terminal", False)
            elif is_bridge:
                n_type = "BRIDGE_LOCK"
                n_label = "Cross-Chain Bridge Router"
                n_risk = 0.35
                n_entity = "Bridge Liquidity Protocol"
                is_terminal = False
            else:
                n_type = "INTERMEDIARY" if is_outgoing else "VICTIM"
                n_label = f"Wallet ({other_addr[:6]}...{other_addr[-4:]})"
                n_risk = 0.40 if (is_reported_complaint and is_outgoing) else 0.03
                n_entity = "Outbound Recipient" if is_outgoing else "Inbound Sender"
                is_terminal = False

            nodes_dict[other_addr] = GraphNode(
                id=f"node-{other_addr[:10]}",
                address=other_addr,
                label=n_label,
                type=n_type,
                chain=chain,
                balance="Verified",
                risk_score=n_risk,
                confidence=0.92,
                entity=n_entity,
                tx_count=cp["tx_count"],
                is_terminal=is_terminal,
                transactions=[create_flow_tx(t, "BALANCED") for t in cp.get("all_txs", [cp["sample_tx"]])]
            )

        for cp in selected_cps:
            other_addr = cp["address"]
            tx = cp["sample_tx"]
            is_outgoing = cp["is_outgoing"]
            
            source_id = nodes_dict[norm_root].id if is_outgoing else nodes_dict[other_addr].id
            target_id = nodes_dict[other_addr].id if is_outgoing else nodes_dict[norm_root].id

            cnt_suffix = f" ({cp['tx_count']} txs)" if cp["tx_count"] > 1 else ""
            val_str = f"{cp['total_val']:.4f} {curr_symbol}{cnt_suffix}"

            heuristic_label = "Direct Peer-to-Peer Transfer"
            if cp["is_mixer"]:
                heuristic_label = "Zero-Knowledge Pool Deposit"
            elif cp["is_vasp"]:
                heuristic_label = "Exchange Liquidity Sweep"
            elif cp["is_bridge"]:
                heuristic_label = "Cross-Chain Liquidity Lock"

            indiv_tx_list = []
            for t in cp.get("all_txs", [tx]):
                risk_lvl = "CRITICAL" if cp["is_mixer"] else ("SAFE" if (cp["is_vasp"] or cp["known_obj"]) else ("SUSPICIOUS" if is_reported_complaint else "BALANCED"))
                indiv_tx_list.append(FlowTransaction(
                    hash=t["hash"],
                    from_addr=t["from"],
                    to_addr=t["to"],
                    value_str=t["value_str"],
                    fee=t["fee"],
                    timestamp=t["timestamp"],
                    chain=t.get("chain", chain),
                    risk_level=risk_lvl
                ))

            links.append(GraphLink(
                source=source_id,
                target=target_id,
                value=val_str,
                currency=curr_symbol,
                tx_hash=tx["hash"],
                timestamp=tx["timestamp"],
                fee=tx["fee"],
                chain=chain,
                is_bridge=cp["is_bridge"],
                heuristic=heuristic_label,
                tx_count=cp["tx_count"],
                individual_txs=indiv_tx_list
            ))

        return list(nodes_dict.values()), links
