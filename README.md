# 🔗 CHAINWATCH // NCRP-INTEL
### Real-Time Identification of Fraud-Linked Cryptocurrency Exchanges from Victim-Reported Suspect Wallets
**Smart India Hackathon (SIH) 2026 | Automated Blockchain Forensics Engine**

---

## 📌 Executive Overview
In India, cyber fraud losses exceed ₹1,750 crore annually, with cryptocurrency increasingly serving as the rapid exit ramp for stolen funds. Law enforcement officers currently spend **72+ hours manually tracing a single suspect wallet** across blockchains — by then, funds are laundered through peel chains, cross-chain bridges, and offshore exchanges.

**CHAINWATCH** solves this critical window:
- Ingests suspect wallet addresses directly from **NCRP / 1930 / SAHYOG** complaint pipelines.
- Executes real-time **multi-hop graph traversal and clustering algorithms** to attribute fund exits to domestic and international VASPs (Virtual Asset Service Providers) in **under 90 seconds**.
- Detects the **6 Terminal Money Trail Outcomes**:
  1. `VASP_DEPOSIT` (e.g., WazirX, CoinDCX, Binance Hot Vaults)
  2. `LOST_TO_MIXER` (Tornado Cash / ZK Privacy Pools)
  3. `CROSS_CHAIN_EXIT` (Hop, Across, Stargate Bridges)
  4. `UNSPENT_BURNER` / `DORMANT_HOLDING` (Parked in burner wallets)
  5. `BURNED` (Null / Dead addresses)
  6. `FUNDS_HELD_AT_ROOT` (No outbound movements)
- Automatically compiles a **Court-Admissible Evidence Dossier** compliant with **Section 63 of Bharatiya Sakshya Adhiniyam (BSA), 2023** (formerly Section 65B of the Indian Evidence Act, 1872) and **Section 94/102 of Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023**, complete with bilingual prosecution narratives (English & Hindi) and cryptographic SHA-256 / IPFS hash seals.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend UI** | Next.js 14 (App Router), TypeScript, Tailwind CSS, D3.js Force-Directed Graphs |
| **Backend Core** | FastAPI (Python 3.12), NetworkX, ReportLab, Pydantic v2 |
| **Forensic ML/Algorithms** | GraphSAGE GNN Inductive Scoring, Peel Chain Resolution, Bridge Detectors |
| **Legal Compliance** | Section 63 BSA 2023 PDF Generator with Noto Sans Devanagari Hindi font & live QR Verification |
| **Blockchain Data** | Live EVM RPCs, Etherscan API, Blockscout, Mempool Traversal |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+
- Git

### 1. Start the Forensic Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
./run.sh
```
The FastAPI backend will start at:
- **API Server**: `http://localhost:8000`
- **Interactive OpenAPI Docs**: `http://localhost:8000/docs`

### 2. Start the Tactical Dashboard Frontend
```bash
cd frontend
npm install
npm run dev
```
The Next.js dashboard will be live at:
- **Dashboard**: `http://localhost:3000`

---

## 🧪 Running Backend Unit & Forensic Tests
```bash
cd backend
source venv/bin/activate
PYTHONPATH=. pytest
```
*All 17 forensic and legal evidence unit tests pass.*

---

## 📜 Statutory Legal Notice & Disclaimers
This software was engineered specifically for Indian Law Enforcement Agencies (LEAs), the Indian Cybercrime Coordination Centre (I4C), and FIU-IND registered Virtual Asset Service Providers (VASPs). Generated legal dossiers comply with statutory requirements under Bharatiya Sakshya Adhiniyam (BSA), 2023 and the Information Technology Act, 2000.
