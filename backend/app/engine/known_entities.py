from typing import Optional, Dict

KNOWN_VERIFIED_ENTITIES: Dict[str, Dict] = {
    "0xd8da6bf26964af9d7eed9e03e53415d37aa96045": {
        "name": "vitalik.eth (Vitalik Buterin)",
        "entity": "Ethereum Co-Founder / Public Figure",
        "type": "VERIFIED_ENTITY",
        "risk_score": 0.02,
        "is_terminal": False,
        "is_scam": False
    },
    "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae": {
        "name": "ethfoundation.eth (Ethereum Foundation)",
        "entity": "Ecosystem Non-Profit Foundation",
        "type": "VERIFIED_ENTITY",
        "risk_score": 0.01,
        "is_terminal": False,
        "is_scam": False
    },
    "0x1db3439a222c519ab44bb1144fc28167b4fa6ee6": {
        "name": "vitalik2.eth (Vitalik Secondary)",
        "entity": "Ethereum Co-Founder Secondary Account",
        "type": "VERIFIED_ENTITY",
        "risk_score": 0.02,
        "is_terminal": False,
        "is_scam": False
    },
    "0x7a250d5630b4cf539739df2c5dacb4c659f2488d": {
        "name": "Uniswap V2 Router 02",
        "entity": "Uniswap Protocol Automated Market Maker",
        "type": "SMART_CONTRACT",
        "risk_score": 0.03,
        "is_terminal": True,
        "is_scam": False
    },
    "0xe592427a0aece92de3edee1f18e0157c05861564": {
        "name": "Uniswap V3 SwapRouter",
        "entity": "Uniswap V3 Concentrated Liquidity Router",
        "type": "SMART_CONTRACT",
        "risk_score": 0.03,
        "is_terminal": True,
        "is_scam": False
    },
    "0xdac17f958d2ee523a2206206994597c13d831ec7": {
        "name": "Tether USD (USDT)",
        "entity": "Tether International Token Contract",
        "type": "SMART_CONTRACT",
        "risk_score": 0.02,
        "is_terminal": True,
        "is_scam": False
    },
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
        "name": "USD Coin (USDC)",
        "entity": "Circle Financial Token Contract",
        "type": "SMART_CONTRACT",
        "risk_score": 0.02,
        "is_terminal": True,
        "is_scam": False
    },
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": {
        "name": "Wrapped Ether (WETH9)",
        "entity": "Canonical WETH Protocol Contract",
        "type": "SMART_CONTRACT",
        "risk_score": 0.02,
        "is_terminal": True,
        "is_scam": False
    },
    "0x00000000219ab540356cbb839cbe05303d7705fa": {
        "name": "Eth2 Deposit Contract",
        "entity": "Ethereum Consensus Layer Deposit Contract",
        "type": "SMART_CONTRACT",
        "risk_score": 0.01,
        "is_terminal": True,
        "is_scam": False
    },
    "0x388c818ca8b9251b393131c08a7368297b893130": {
        "name": "Lido Execution Layer Rewards Vault",
        "entity": "Lido DAO Liquid Staking Pool",
        "type": "SMART_CONTRACT",
        "risk_score": 0.02,
        "is_terminal": True,
        "is_scam": False
    },
    "0x28c6c06298d514db089934071355e5743bf21d60": {
        "name": "Binance Hot Wallet 14",
        "entity": "Binance Exchange Settlement Reserve",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0xbe0eb53f46cd790cd13851d5eff43d12404d33e8": {
        "name": "Binance Hot Wallet 7",
        "entity": "Binance Exchange Settlement Reserve",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0x21a31ee1afc51d94c2efccaa2092ad1028285549": {
        "name": "Binance Hot Wallet 20",
        "entity": "Binance Exchange Settlement Reserve",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0x5ace48b8e8a5e44598f1c667a421b4a59714da31": {
        "name": "WazirX Hot Wallet 04",
        "entity": "WazirX Sovereign Hot Pool (Zanmai Labs)",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0x91d90479d20c5d57d76d4981d3f0cbdfd55b85d0": {
        "name": "WazirX Hot Wallet 01",
        "entity": "WazirX India Regulated Hot Pool",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0x3456789012345678901234567890123456789012": {
        "name": "WazirX User Deposit Vault",
        "entity": "WazirX India (FIU-IND-2023-VASP-001)",
        "type": "EXCHANGE_DEPOSIT",
        "risk_score": 0.15,
        "is_terminal": False,
        "is_scam": False
    },
    "0x7890123456789012345678901234567890123456": {
        "name": "CoinDCX Main Hot 1",
        "entity": "CoinDCX (Neblio Technologies)",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0x8894e0a0c962cb723c19fc560899dd33e0047745": {
        "name": "CoinDCX Settlement Vault",
        "entity": "CoinDCX India Custody Pool",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0x4b43343469e38d62a9fd9d685210b39f045053b2": {
        "name": "CoinSwitch Hot Reserve",
        "entity": "CoinSwitch Kuber (Bitcipher Labs)",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0x2d816a7f34c20e5886d34b179e09581970b54321": {
        "name": "ZebPay Hot Settlement",
        "entity": "ZebPay India (Awlencan Innovations)",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0x9965507d1a55bcc2695c58ba16fb37d819b0a4df": {
        "name": "Mudrex Institutional Vault",
        "entity": "Mudrex Wealth Technologies",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0x524b07ebf058097d76cbfa0fdcfd6b83f0ad9c3b": {
        "name": "Bitbns Hot Wallet 1",
        "entity": "Bitbns (Buyhatke Internet)",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0xa7c2b3d4e5f61728394a5b6c7d8e9f0123456789": {
        "name": "Giottus Hot Vault",
        "entity": "Giottus Technologies India",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0x19a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0": {
        "name": "Unocoin Settlement Vault",
        "entity": "Unocoin Technologies",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "0x163a3d582852eb8ef41ec61204689622d8fd8b7c": {
        "name": "KuCoin India Hot 1",
        "entity": "KuCoin FIU-IND Reporting Unit",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.12,
        "is_terminal": True,
        "is_scam": False
    },
    "bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97": {
        "name": "Bitfinex Cold Storage 1",
        "entity": "Bitfinex Institutional Custody Vault",
        "type": "EXCHANGE_HOT",
        "risk_score": 0.05,
        "is_terminal": True,
        "is_scam": False
    },
    # --------------------------------------------------------------------------
    # Famous Exploiter, Hacker, and Phishing Scam Wallets (Live Forensic Testcases)
    # --------------------------------------------------------------------------
    "0x098b716b8aaf21512996dc57eb0615e2383e2f96": {
        "name": "Lazarus Group (Ronin Exploiter)",
        "entity": "North Korean State Threat Actor ($624M Ronin Bridge Heist)",
        "type": "SUSPECT_BURNER",
        "risk_score": 0.99,
        "is_terminal": False,
        "is_scam": True
    },
    "0x59abf3837fa962d6853b4cc0a19513aa031fd32b": {
        "name": "FTX Accounts Drainer",
        "entity": "Unauthorized FTX Insolvency Exfiltrator ($400M Drain)",
        "type": "SUSPECT_BURNER",
        "risk_score": 0.98,
        "is_terminal": False,
        "is_scam": True
    },
    "0xda25ee226e534d868f0dd8a459536b03fee9079b": {
        "name": "BadgerDAO Exploiter",
        "entity": "Cloudflare Malicious Route Injection Hacker ($120M Loss)",
        "type": "SUSPECT_BURNER",
        "risk_score": 0.98,
        "is_terminal": False,
        "is_scam": True
    },
    "0xc8a65fadf0e0ddaf421f28feab69bf6e2e589963": {
        "name": "Poly Network Exploiter",
        "entity": "Cross-Chain EthCrossChainManager Exploit ($611M Stolen)",
        "type": "SUSPECT_BURNER",
        "risk_score": 0.97,
        "is_terminal": False,
        "is_scam": True
    },
    "0x04e5943b73141185894867417644c41be166f3a7": {
        "name": "WazirX July 2024 Exploiter",
        "entity": "Liminal Multisig Compromise Threat Actor ($235M Indian Mega-Heist)",
        "type": "SUSPECT_BURNER",
        "risk_score": 0.99,
        "is_terminal": False,
        "is_scam": True
    },
    "0xb66cd966670d962c2204367300e071739799ddbe": {
        "name": "Euler Finance Exploiter",
        "entity": "Flash Loan Liquidation Donation Flaw Exploiter ($197M)",
        "type": "SUSPECT_BURNER",
        "risk_score": 0.96,
        "is_terminal": False,
        "is_scam": True
    },
    "0x4c2a6a238b57d2a713915f02d963f8fcf151aa3b": {
        "name": "Pink Drainer Phishing Operator",
        "entity": "Syndicated Permit2 Phishing Infrastructure ($85M Theft)",
        "type": "SUSPECT_BURNER",
        "risk_score": 0.98,
        "is_terminal": False,
        "is_scam": True
    },
    "0xd1b465134f998b3f27ff75b71e89f14a51f22146": {
        "name": "Monkey Drainer Operator",
        "entity": "High-Volume Discord / Web3 Ice Phishing Drainer",
        "type": "SUSPECT_BURNER",
        "risk_score": 0.97,
        "is_terminal": False,
        "is_scam": True
    },
    "0x71c438d9a40326e7a2b9d0b5030225d3129889a4": {
        "name": "Suspect Burner Alpha (FIR-402/2026)",
        "entity": "Active Cyber Crime Cell Suspect Account",
        "type": "SUSPECT_BURNER",
        "risk_score": 0.98,
        "is_terminal": False,
        "is_scam": True
    }
}

def get_known_entity(address: str) -> Optional[Dict]:
    norm = address.strip().lower()
    return KNOWN_VERIFIED_ENTITIES.get(norm)
