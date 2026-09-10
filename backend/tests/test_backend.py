import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.engine.heuristics import ExchangeClusteringHeuristics
from app.engine.bridge_detector import CrossChainBridgeDetector
from app.engine.topology_rules import LaunderingTopologyDetector
from app.engine.gnn_scorer import GraphSAGEScorer
from app.engine.tracer import GraphTracer

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ONLINE"
    assert "CHAINWATCH" in data["system"]

def test_health_endpoint():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "OPERATIONAL"
    count = data.get("fiuVaspCount", data.get("fiu_vasp_count", 0))
    assert count >= 6
    algs = data.get("algorithmsActive", data.get("algorithms_active", []))
    assert "GraphSAGE_GNN_Inductive" in algs

def test_metrics_prometheus():
    res = client.get("/api/v1/metrics")
    assert res.status_code == 200
    assert "chainwatch_uptime_seconds" in res.text
    assert "chainwatch_attribution_accuracy_pct" in res.text

def test_complaints_flow():
    # 1. List complaints
    res = client.get("/api/v1/complaints")
    assert res.status_code == 200
    complaints = res.json()
    assert len(complaints) >= 5
    first_c = complaints[0]
    assert "id" in first_c
    assert "acknowledgementNo" in first_c or "acknowledgement_no" in first_c

    # 2. Ingest new complaint
    new_c_payload = {
        "wallet_address": "0xABCDEF1234567890ABCDEF1234567890ABCDEF12",
        "chain": "ethereum",
        "complaint_id": "case-99999",
        "victim_name": "Test Complainant",
        "amount": "15.00 ETH",
        "police_station": "Cyber Cell Testing Unit",
        "source": "NCRP"
    }
    create_res = client.post("/api/v1/complaints", json=new_c_payload)
    assert create_res.status_code == 200
    created = create_res.json()
    assert created["id"] == "case-99999"
    assert created["status"] == "QUEUED"

def test_vasp_registry():
    res = client.get("/api/v1/exchanges")
    assert res.status_code == 200
    vasps = res.json()
    assert len(vasps) >= 6
    vasp_names = [v["name"] for v in vasps]
    assert "WazirX" in vasp_names
    assert "CoinDCX" in vasp_names
    assert "Binance India" in vasp_names

def test_forensic_trace_execution():
    trace_payload = {
        "wallet_address": "0x71C438D9A40326e7a2b9d0b5030225d3129889A4",
        "chain": "ethereum",
        "max_hops": 4,
        "direction": "forward"
    }
    res = client.post("/api/v1/trace", json=trace_payload)
    assert res.status_code == 200
    data = res.json()
    assert "nodes" in data
    assert "links" in data
    assert len(data["nodes"]) >= 5
    assert len(data["links"]) >= 4
    assert data["confidence"] >= 0.85
    assert "WazirX" in data["targetEntity"] or "Zanmai" in data["targetEntity"]

def test_adhoc_wallet_trace():
    trace_payload = {
        "wallet_address": "0x9999888877776666555544443333222211110000",
        "chain": "ethereum",
        "max_hops": 3
    }
    res = client.post("/api/v1/trace", json=trace_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["totalHops"] >= 1
    assert "nodes" in data

def test_court_dossier_generation():
    res = client.get("/api/v1/reports/CASE-10928")
    assert res.status_code == 200
    dossier = res.json()
    assert dossier["caseRef"] == "CASE-10928"
    assert len(dossier["sha256Digest"]) == 64
    assert dossier["ipfsCid"].startswith("Qm")
    assert "synopsisEn" in dossier
    assert "synopsisHi" in dossier
    assert "SECTION 94" in dossier["section94NoticePreview"] or "Section 94" in dossier["section94NoticePreview"]
    assert dossier["isSigned"] is True

def test_sahyog_freeze_dispatch():
    freeze_payload = {
        "case_ref": "CASE-10928",
        "vasp_id": "vasp-001",
        "officer_name": "Inspector R. K. Sharma",
        "statutory_act": "Section 94 BNSS, 2023 r/w Sec 63 BSA, 2023"
    }
    res = client.post("/api/v1/freeze", json=freeze_payload)
    assert res.status_code == 200
    dispatch = res.json()
    assert dispatch["success"] is True
    assert dispatch["status"] == "DISPATCHED"
    assert "SAHYOG-FRZ-" in dispatch["ackNumber"]

def test_heuristics_unit():
    # Heuristic 1
    match, vasp, conf = ExchangeClusteringHeuristics.evaluate_deposit_reuse(
        in_degree=25,
        out_degree=1,
        outgoing_addresses=["0x5ACe48b8E8A5E44598F1c667a421b4A59714Da31"]
    )
    assert match is True
    assert vasp is not None
    assert vasp.name == "WazirX"
    assert conf > 0.90

    # Heuristic 3 Jaccard
    matched_exchange, score = ExchangeClusteringHeuristics.evaluate_contract_jaccard(
        interacted_contracts=[
            "0x1111111254fb6c44bac0bed2854e76f90643097d",
            "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        ]
    )
    assert matched_exchange == "WazirX"
    assert score >= 0.50

def test_bridge_detector_unit():
    stargate_addr = "0xba35678901234567890123456789012345678901"
    assert CrossChainBridgeDetector.is_bridge_contract(stargate_addr) is True
    
    is_match, conf, expl = CrossChainBridgeDetector.correlate_cross_chain_hop(
        origin_tx_value=10.0,
        origin_timestamp_epoch=1700000000,
        destination_tx_value=9.965, # 0.35% fee
        destination_timestamp_epoch=1700000300, # 5 mins delta
        bridge_address=stargate_addr,
        dest_chain="bsc"
    )
    assert is_match is True
    assert conf >= 0.80

def test_court_dossier_pdf_download():
    res = client.get("/api/v1/reports/CASE-10928/pdf")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert res.content.startswith(b"%PDF")
    assert len(res.content) > 1000

def test_unified_search():
    # Search by exchange name
    res = client.get("/api/v1/search?q=wazirx")
    assert res.status_code == 200
    data = res.json()
    assert len(data["vasps"]) >= 1
    assert data["vasps"][0]["name"] == "WazirX"

    # Search by victim name
    res2 = client.get("/api/v1/search?q=Malhotra")
    assert res2.status_code == 200
    data2 = res2.json()
    assert len(data2["complaints"]) >= 1
    assert "Malhotra" in data2["complaints"][0]["victimName"]

def test_unhappy_path_mixer_and_dusting():
    # 1. Tornado Cash mixer check
    is_mixer, meta = ExchangeClusteringHeuristics.evaluate_mixer_obfuscation(
        "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc"
    )
    assert is_mixer is True
    assert "OFAC SDN" in meta["sanctions"]
    assert meta["denomination"] == "0.1 ETH"

    # 2. Dusting attack filter
    dirty_txs = [
        {"value": "12.5 ETH", "target": "0x1111"},
        {"value": "0.000001 ETH", "target": "0x2222"}, # Dust
        {"value": "6.25 ETH", "target": "0x3333"}
    ]
    clean_txs = ExchangeClusteringHeuristics.filter_dust_transactions(dirty_txs)
    assert len(clean_txs) == 2

def test_live_blockchain_crawler_and_trace():
    from app.engine.live_crawler import LiveBlockchainCrawler
    vitalik_wallet = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
    txs = LiveBlockchainCrawler.fetch_live_transactions(vitalik_wallet, "ethereum", limit=3)
    assert isinstance(txs, list)
    if txs:
        assert len(txs) > 0
        assert "hash" in txs[0]
        nodes, links = LiveBlockchainCrawler.build_graph_from_live_txs(vitalik_wallet, "ethereum", txs)
        assert len(nodes) >= 2
        assert len(links) >= 1

    # Test trace endpoint with real address
    res = client.post("/api/v1/trace", json={
        "wallet_address": vitalik_wallet,
        "chain": "ethereum",
        "max_hops": 2
    })
    assert res.status_code == 200
    trace_data = res.json()
    assert trace_data["rootAddress"] == vitalik_wallet
    assert len(trace_data["nodes"]) >= 2
    assert len(trace_data["links"]) >= 1

def test_pdf_dossier_download():
    res = client.get("/api/v1/reports/CC-MUM-2026-0941/pdf?vasp_id=vasp-001")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert len(res.content) > 1000
    assert res.content.startswith(b"%PDF")

def test_pdf_dossier_post():
    res = client.post("/api/v1/reports/pdf", json={
        "trace_id": "default",
        "case_ref": "CC-DEL-2026-TEST"
    })
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert len(res.content) > 1000
    assert res.content.startswith(b"%PDF")


