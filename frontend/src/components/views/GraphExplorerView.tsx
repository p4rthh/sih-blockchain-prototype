'use client';

import React, { useState } from 'react';
import { FlowTransaction, GraphLink, GraphNode, TraceGraphData } from '../../lib/types/forensics';
import { D3GraphVisualizer } from '../graph/D3GraphVisualizer';
import { apiClient } from '../../lib/api/client';

interface GraphExplorerViewProps {
  traceData: TraceGraphData;
  onGenerateDossier: () => void;
  onTraceWallet?: (address: string) => void;
}

export const GraphExplorerView: React.FC<GraphExplorerViewProps> = ({
  traceData,
  onGenerateDossier,
  onTraceWallet,
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(traceData.nodes[1] || traceData.nodes[0] || null);
  const [selectedLink, setSelectedLink] = useState<GraphLink | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [txFilter, setTxFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [quickInput, setQuickInput] = useState('');

  // Keep selectedNode synchronized with traceData changes
  React.useEffect(() => {
    if (traceData && traceData.nodes && traceData.nodes.length > 0) {
      setSelectedNode(traceData.nodes[1] || traceData.nodes[0] || null);
      setSelectedLink(null);
    }
  }, [traceData]);

  const handleQuickExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      await apiClient.downloadPdf(`NCRP-${traceData.traceId.slice(-6).toUpperCase()}`, traceData.traceId, traceData.rootAddress);
    } finally {
      setTimeout(() => setIsExportingPdf(false), 800);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSelectNode = (node: GraphNode) => {
    setSelectedNode(node);
    setSelectedLink(null);
  };

  const handleSelectLink = (link: GraphLink) => {
    setSelectedLink(link);
    setSelectedNode(null);
  };

  const formatAddr = (addr: string) => {
    if (!addr) return '';
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const renderTerminalStatusBadge = (status?: string) => {
    switch (status) {
      case 'LOST_TO_MIXER':
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]">
            TRAIL LOST IN MIXER
          </span>
        );
      case 'VASP_DEPOSIT':
      case 'RECOVERABLE_AT_VASP':
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#dcfce7] text-[#166534] border border-[#86efac]">
            ACTIONABLE AT VASP
          </span>
        );
      case 'DORMANT_HOLDING':
      case 'DORMANT_IN_BURNER':
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
            PARKED IN BURNER (UNSPENT)
          </span>
        );
      case 'CROSS_CHAIN_EXIT':
      case 'EXITED_CROSS_CHAIN':
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#ede9fe] text-[#6d28d9] border border-[#c4b5fd]">
            CROSS-CHAIN BRIDGE
          </span>
        );
      case 'BURNED':
      case 'PERMANENTLY_BURNED':
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]">
            PERMANENTLY BURNED
          </span>
        );
      case 'FUNDS_HELD_AT_ROOT':
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
            HELD AT ROOT
          </span>
        );
      case 'MULTI_BRANCH_DISPERSAL':
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#fce7f3] text-[#9d174d] border border-[#fbcfe8]">
            MULTI-BRANCH DISPERSAL
          </span>
        );
      default:
        return null;
    }
  };

  const getNodeFromLinkEndpoint = (endpoint: unknown): GraphNode | undefined => {
    let rawId = '';
    if (typeof endpoint === 'object' && endpoint !== null) {
      const obj = endpoint as { id?: string; address?: string };
      rawId = obj.id || obj.address || '';
    } else {
      rawId = String(endpoint ?? '');
    }
    return traceData.nodes.find(
      (n) => n.id === rawId || n.address.toLowerCase() === rawId.toLowerCase()
    );
  };

  const sourceNode = selectedLink ? getNodeFromLinkEndpoint(selectedLink.source) : undefined;
  const targetNode = selectedLink ? getNodeFromLinkEndpoint(selectedLink.target) : undefined;

  const renderWalletBadge = (node?: GraphNode) => {
    if (!node) {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#f1f5f9] text-[#334155] border border-[#cbd5e1]">
          UNCLASSIFIED
        </span>
      );
    }

    const isExchange = 
      node.type === 'EXCHANGE_HOT' ||
      node.type === 'EXCHANGE_DEPOSIT' ||
      /wazirx|coindcx|coinswitch|zebpay|mudrex|bitbns|giottus|unocoin|binance|kucoin|vasp/i.test(
        `${node.label} ${node.entity || ''} ${node.address} ${node.clusterId || ''}`
      );

    if (isExchange) {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#dcfce7] text-[#166534] border border-[#86efac]">
          {node.type === 'EXCHANGE_DEPOSIT' ? 'VASP DEPOSIT VAULT' : 'REGULATED VASP'}
        </span>
      );
    }

    if (node.type === 'SUSPECT_BURNER' || node.type === 'MIXER' || node.riskScore > 0.7) {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]">
          CRITICAL RISK
        </span>
      );
    }
    if (node.type === 'VERIFIED_ENTITY' || node.type === 'BENIGN_PUBLIC' || node.riskScore < 0.1) {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]">
          SAFE / VERIFIED
        </span>
      );
    }
    if (node.type === 'BRIDGE_LOCK' || node.type === 'BRIDGE_MINT') {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#ede9fe] text-[#6d28d9] border border-[#c4b5fd]">
          BRIDGE ROUTER
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
        SUSPICIOUS / HOP
      </span>
    );
  };

  const renderTxRiskBadge = (riskLevel?: string) => {
    const level = (riskLevel || 'CLEAN').toUpperCase();
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]">
            CRITICAL
          </span>
        );
      case 'SUSPICIOUS':
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
            SUSPICIOUS
          </span>
        );
      case 'BALANCED':
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#e0e7ff] text-[#3730a3] border border-[#c7d2fe]">
            BALANCED
          </span>
        );
      case 'SAFE':
      case 'CLEAN':
      default:
        return (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold bg-[#dcfce7] text-[#166534] border border-[#86efac]">
            SAFE
          </span>
        );
    }
  };

  const individualTxsList: FlowTransaction[] = selectedLink?.individualTxs && selectedLink.individualTxs.length > 0
    ? selectedLink.individualTxs
    : selectedLink
    ? [
        {
          hash: selectedLink.txHash,
          from: sourceNode?.address || String(selectedLink.source),
          to: targetNode?.address || String(selectedLink.target),
          valueStr: selectedLink.value,
          fee: selectedLink.fee,
          timestamp: selectedLink.timestamp,
          chain: selectedLink.chain,
          riskLevel: selectedLink.isBridge ? 'BALANCED' : 'CLEAN',
        },
      ]
    : [];

  const nodeTxs: FlowTransaction[] = (selectedNode?.transactions && selectedNode.transactions.length > 0)
    ? selectedNode.transactions
    : selectedNode
    ? traceData.links
        .filter((l) => {
          const s = getNodeFromLinkEndpoint(l.source);
          const t = getNodeFromLinkEndpoint(l.target);
          return (
            (s?.address && s.address.toLowerCase() === selectedNode.address.toLowerCase()) ||
            (t?.address && t.address.toLowerCase() === selectedNode.address.toLowerCase()) ||
            String(l.source).toLowerCase() === selectedNode.id.toLowerCase() ||
            String(l.target).toLowerCase() === selectedNode.id.toLowerCase()
          );
        })
        .flatMap((l) => l.individualTxs || [{
          hash: l.txHash,
          from: getNodeFromLinkEndpoint(l.source)?.address || String(l.source),
          to: getNodeFromLinkEndpoint(l.target)?.address || String(l.target),
          valueStr: l.value,
          fee: l.fee,
          timestamp: l.timestamp,
          chain: l.chain,
          riskLevel: l.isBridge ? 'BALANCED' : 'CLEAN',
        }])
    : [];

  const inboundNodeTxs = nodeTxs.filter((t) => (t.to || '').toLowerCase() === (selectedNode?.address || '').toLowerCase());
  const outboundNodeTxs = nodeTxs.filter((t) => (t.from || '').toLowerCase() === (selectedNode?.address || '').toLowerCase());

  const filteredNodeTxs = txFilter === 'IN'
    ? inboundNodeTxs
    : txFilter === 'OUT'
    ? outboundNodeTxs
    : nodeTxs;

  return (
    <div className="flex-1 flex overflow-hidden h-full relative">
      {/* LEFT: GRAPH CANVAS VIEWPORT */}
      <div className="flex-1 flex flex-col h-full bg-[#e8e3d8] overflow-hidden relative">
        {/* Top Floating Control Pill & Quick Switcher */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="bg-[#f3efe6]/95 backdrop-blur-sm border border-[#d6cfc2] rounded-lg px-4 py-2 shadow-xs flex items-center gap-3 text-xs font-mono pointer-events-auto">
            <div className="flex items-center gap-1.5 font-bold text-[#1b2a41]">
              <span className="material-symbols-outlined text-sm text-[#2c5e43]">schema</span>
              <span>TRACE: {traceData.traceId}</span>
            </div>
            <div className="h-3 w-px bg-[#d6cfc2]"></div>
            <div className="text-[#575249]">
              ROOT: <span className="text-[#21201d] font-bold">{traceData.rootAddress.slice(0, 10)}...</span>
            </div>
            <div className="h-3 w-px bg-[#d6cfc2]"></div>
            <div className="text-[#575249]">
              FLOW: <span className="text-[#1b2a41] font-bold">{traceData.totalValueStolen}</span>
            </div>
            <div className="h-3 w-px bg-[#d6cfc2]"></div>
            <div className="text-[#2c5e43] font-bold">
              {traceData.nodes.length} NODES ({traceData.links.length} CORRIDORS)
            </div>
          </div>

          {/* Quick Trace Presets & Search Input */}
          {onTraceWallet && (
            <div className="bg-[#f3efe6]/95 backdrop-blur-sm border border-[#d6cfc2] rounded-lg px-3 py-1.5 shadow-xs flex items-center gap-2 pointer-events-auto text-xs font-mono">
              <span className="text-[10px] text-[#797368] font-bold uppercase">PRESETS:</span>
              <button
                onClick={() => onTraceWallet('0x098b716b8aaf21512996dc57eb0615e2383e2f96')}
                className="px-2 py-0.5 rounded bg-[#fee2e2] hover:bg-[#fecaca] text-[#991b1b] border border-[#fca5a5] font-bold text-[10px] transition-colors"
                title="Lazarus Ronin $624M Heist"
              >
                Lazarus
              </button>
              <button
                onClick={() => onTraceWallet('0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc')}
                className="px-2 py-0.5 rounded bg-[#fee2e2] hover:bg-[#fecaca] text-[#9e2a2b] border border-[#fca5a5] text-[10px] transition-colors"
                title="Tornado Cash ZK Mixer"
              >
                Tornado
              </button>
              <button
                onClick={() => onTraceWallet('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')}
                className="px-2 py-0.5 rounded bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] border border-[#bae6fd] text-[10px] transition-colors"
                title="Vitalik Buterin (vitalik.eth)"
              >
                Vitalik
              </button>
              <button
                onClick={() => onTraceWallet('0x28C6c06298d514Db089934071355E5743bf21d60')}
                className="px-2 py-0.5 rounded bg-[#ece7dc] hover:bg-[#ded7c8] text-[#1b2a41] border border-[#d6cfc2] text-[10px] transition-colors"
                title="Binance Hot 14"
              >
                Binance
              </button>
              <div className="h-3 w-px bg-[#d6cfc2] mx-1"></div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (quickInput.trim()) {
                    onTraceWallet(quickInput.trim());
                    setQuickInput('');
                  }
                }}
                className="flex items-center gap-1"
              >
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Trace 0x... / bc1..."
                  className="bg-[#ece7dc] border border-[#d6cfc2] px-2 py-1 rounded text-[11px] font-mono text-[#21201d] w-40 placeholder:text-[#888173] focus:outline-none focus:border-[#1b2a41]"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-[#1b2a41] text-[#fff8f0] rounded text-[10px] font-bold hover:bg-[#111e30] transition-colors uppercase"
                >
                  Trace
                </button>
              </form>
            </div>
          )}
        </div>

        {/* D3 SVG Visualizer */}
        <D3GraphVisualizer
          data={traceData}
          selectedNode={selectedNode}
          onSelectNode={handleSelectNode}
          selectedLink={selectedLink}
          onSelectLink={handleSelectLink}
        />

        {/* Floating Aggregated Corridor Inspector overlay directly on canvas */}
        {selectedLink && (
          <div className="absolute bottom-4 left-4 z-20 w-96 max-w-[calc(100%-2rem)] bg-[#f3efe6]/95 backdrop-blur-md border border-[#d6cfc2] rounded-xl p-3.5 shadow-lg space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#d6cfc2] pb-2">
              <div className="flex items-center gap-1.5 font-bold font-mono text-xs text-[#1b2a41]">
                <span className="material-symbols-outlined text-sm text-[#0284c7]">hub</span>
                <span>CORRIDOR FLOW: {selectedLink.value}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#dbeafe] text-[#1e40af] font-bold">
                  {individualTxsList.length} TX{individualTxsList.length === 1 ? '' : 'S'}
                </span>
                <button
                  onClick={() => setSelectedLink(null)}
                  className="text-[#575249] hover:text-[#1b2a41] p-0.5 rounded hover:bg-[#dfd8cb] transition-colors"
                  title="Close overlay"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>

            {/* Endpoints */}
            <div className="flex items-center justify-between text-[11px] font-mono bg-[#ece7dc] p-2 rounded-lg border border-[#d6cfc2]">
              <div className="truncate max-w-[45%]">
                <span className="text-[9px] text-[#797368] font-bold block">SOURCE</span>
                <span className="font-bold text-[#1b2a41] truncate block">{sourceNode?.label || formatAddr(String(selectedLink.source))}</span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#575249]">arrow_forward</span>
              <div className="truncate max-w-[45%] text-right">
                <span className="text-[9px] text-[#797368] font-bold block">TARGET</span>
                <span className="font-bold text-[#1b2a41] truncate block">{targetNode?.label || formatAddr(String(selectedLink.target))}</span>
              </div>
            </div>

            {/* Direct transaction stream */}
            <div className="space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar pr-0.5">
              {individualTxsList.map((tx, idx) => (
                <div key={tx.hash || idx} className="p-2 rounded bg-[#fcfaf7] border border-[#d6cfc2] text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-[#1b2a41] text-[11px]">
                      <span className="text-[10px] text-[#797368]">#{idx + 1}</span>
                      <span>{tx.hash ? `${tx.hash.slice(0, 8)}...${tx.hash.slice(-6)}` : 'Tx'}</span>
                      {tx.hash && (
                        <button
                          onClick={() => handleCopy(tx.hash)}
                          className="text-[#575249] hover:text-[#0284c7] p-0.5"
                          title="Copy hash"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {copiedText === tx.hash ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      )}
                    </div>
                    {renderTxRiskBadge(tx.riskLevel)}
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#1b2a41]">{tx.valueStr || selectedLink.value}</span>
                    <span className="text-[10px] text-[#797368]">{tx.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: FORENSIC INSPECTOR PANEL */}
      <aside className="w-96 bg-[#f3efe6] border-l border-[#d6cfc2] h-full flex flex-col overflow-hidden z-30 shrink-0">
        {/* Pinned Header */}
        <div className="p-4 pb-3 border-b border-[#d6cfc2] shrink-0 bg-[#f3efe6]">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[#797368]">
            <span>FORENSIC TELEMETRY</span>
            {selectedLink ? (
              <span className={`px-2 py-0.5 rounded border font-bold ${
                selectedLink.isBridge
                  ? 'bg-[#ede9fe] text-[#6d28d9] border-[#c4b5fd]'
                  : (selectedLink.txCount || 1) > 1
                  ? 'bg-[#dbeafe] text-[#1e40af] border-[#93c5fd]'
                  : 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]'
              }`}>
                {selectedLink.isBridge ? 'CROSS-CHAIN BRIDGE' : (selectedLink.txCount || 1) > 1 ? `AGGREGATED (${selectedLink.txCount} TXS)` : 'DIRECT HOP'}
              </span>
            ) : traceData.riskScore >= 70 ? (
              <span className="px-2 py-0.5 rounded bg-[#f8e3e1] text-[#872021] border border-[#ebb6b4]">
                SEV: CRITICAL LAUNDERING
              </span>
            ) : traceData.riskScore >= 25 ? (
              <span className="px-2 py-0.5 rounded bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                SEV: ELEVATED RISK
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-[#dcfce7] text-[#166534] border border-[#86efac]">
                SEV: BENIGN / VERIFIED
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            <h2 className="text-lg font-bold font-serif text-[#1b2a41]">
              {selectedLink ? 'Aggregated Flow Inspector' : 'Node Attribution Inspector'}
            </h2>
            {selectedLink && (
              <button
                onClick={() => {
                  setSelectedLink(null);
                  setSelectedNode(traceData.nodes[1] || traceData.nodes[0]);
                }}
                className="text-[11px] font-mono text-[#0284c7] hover:underline flex items-center gap-0.5 font-bold"
              >
                <span className="material-symbols-outlined text-[13px]">arrow_back</span>
                <span>Node View</span>
              </button>
            )}
          </div>
          <p className="text-xs text-[#575249]">
            {selectedLink
              ? `Flow corridor: ${selectedLink.heuristic || 'Temporal on-chain transfer'}`
              : `Topological classification: ${traceData.typology}`}
          </p>
        </div>

        {/* Scrollable Inspector Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {/* Money Trail Diagnostic & Fund Disposition Card */}
          <div className="p-3.5 bg-[#ece7dc] border border-[#d6cfc2] rounded-lg space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold font-mono text-[#1b2a41] uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm text-[#2c5e43]">radar</span>
                <span>TRAIL DISPOSITION & VERDICT</span>
              </div>
              {renderTerminalStatusBadge(traceData.trailStatus)}
            </div>

            <p className="text-xs text-[#1b2a41] font-mono leading-relaxed bg-[#fcfaf7] p-2.5 rounded border border-[#dfd8cb]">
              {traceData.trailVerdict || (
                traceData.nodes.some(n => n.type === 'MIXER')
                  ? 'Trail Lost: Funds were routed into a Zero-Knowledge Mixer pool. Cryptographic trail is severed.'
                  : traceData.nodes.some(n => n.type === 'EXCHANGE_HOT')
                  ? 'Trail Resolved: Funds successfully traced into a Regulated Exchange Vault. Actionable for Sec 94 CrPC freeze.'
                  : 'Trail Active: Funds are mapped across multi-party counterparties on-chain.'
              )}
            </p>

            {/* Terminal Endpoints Quick View */}
            {traceData.nodes.filter(n => n.isTerminal && n.id !== traceData.nodes[0]?.id).length > 0 && (
              <div className="space-y-1.5 pt-1 border-t border-[#dfd8cb]">
                <div className="text-[10px] font-mono font-bold text-[#797368] uppercase">
                  TRAIL TERMINATION ENDPOINTS ({traceData.nodes.filter(n => n.isTerminal && n.id !== traceData.nodes[0]?.id).length})
                </div>
                <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                  {traceData.nodes
                    .filter(n => n.isTerminal && n.id !== traceData.nodes[0]?.id)
                    .map((tn) => (
                      <div
                        key={tn.id}
                        onClick={() => handleSelectNode(tn)}
                        className="p-2 rounded bg-[#f4ede4] hover:bg-[#e4dfd5] transition-colors border border-[#d6cfc2] cursor-pointer flex items-center justify-between text-[11px] font-mono"
                      >
                        <div className="space-y-0.5 truncate max-w-[60%]">
                          <div className="font-bold text-[#1b2a41] truncate">{tn.label}</div>
                          <div className="text-[10px] text-[#575249] truncate">{formatAddr(tn.address)}</div>
                        </div>
                        <div className="text-right shrink-0">
                          {renderTerminalStatusBadge(tn.terminalStatus)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Conditional Content: Selected Link vs Selected Node */}
          {selectedLink ? (
            <div className="space-y-4">
              {/* Source & Target Corridor Card */}
              <div className="p-3.5 bg-[#ece7dc] border border-[#d6cfc2] rounded-lg space-y-3 shadow-xs">
                <div className="text-[10px] font-mono font-bold text-[#797368] uppercase tracking-wider">
                  FLOW CORRIDOR ENDPOINTS
                </div>

                {/* Source Wallet Box */}
                <div className="p-2.5 rounded bg-[#f4ede4] border border-[#d6cfc2] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#797368]">FROM (SOURCE)</span>
                    {renderWalletBadge(sourceNode)}
                  </div>
                  <div className="text-xs font-bold text-[#1b2a41]">{sourceNode?.label || 'Source Wallet'}</div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#575249]">
                    <span className="break-all">{formatAddr(sourceNode?.address || String(selectedLink.source))}</span>
                    <button
                      onClick={() => handleCopy(sourceNode?.address || String(selectedLink.source))}
                      className="text-[#1b2a41] hover:text-[#0284c7] ml-1 p-0.5 transition-colors"
                      title="Copy address"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedText === (sourceNode?.address || String(selectedLink.source)) ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                  {sourceNode && (
                    <button
                      onClick={() => handleSelectNode(sourceNode)}
                      className="text-[10px] font-mono text-[#0284c7] hover:underline flex items-center gap-0.5 pt-1 font-semibold"
                    >
                      <span>Inspect this node</span>
                      <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </button>
                  )}
                </div>

                {/* Direction & Volume Divider */}
                <div className="flex items-center justify-center gap-2 py-0.5 text-xs font-mono font-bold text-[#1b2a41]">
                  <span className="material-symbols-outlined text-sm text-[#9e2a2b]">arrow_downward</span>
                  <span className="bg-[#dfd8cb] px-2.5 py-1 rounded text-[11px] font-bold border border-[#d6cfc2]">
                    {selectedLink.value}
                  </span>
                </div>

                {/* Target Wallet Box */}
                <div className="p-2.5 rounded bg-[#f4ede4] border border-[#d6cfc2] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#797368]">TO (DESTINATION)</span>
                    {renderWalletBadge(targetNode)}
                  </div>
                  <div className="text-xs font-bold text-[#1b2a41]">{targetNode?.label || 'Destination Wallet'}</div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#575249]">
                    <span className="break-all">{formatAddr(targetNode?.address || String(selectedLink.target))}</span>
                    <button
                      onClick={() => handleCopy(targetNode?.address || String(selectedLink.target))}
                      className="text-[#1b2a41] hover:text-[#0284c7] ml-1 p-0.5 transition-colors"
                      title="Copy address"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedText === (targetNode?.address || String(selectedLink.target)) ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                  {targetNode && (
                    <button
                      onClick={() => handleSelectNode(targetNode)}
                      className="text-[10px] font-mono text-[#0284c7] hover:underline flex items-center gap-0.5 pt-1 font-semibold"
                    >
                      <span>Inspect this node</span>
                      <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Flow Overview Stats */}
              <div className="p-3 bg-[#f4ede4] border border-[#d6cfc2] rounded-lg grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#797368]">AGGREGATED FLOW</span>
                  <div className="font-bold text-[#1b2a41]">{selectedLink.value}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#797368]">CORRIDOR TX COUNT</span>
                  <div className="font-bold text-[#1b2a41]">
                    {selectedLink.txCount || selectedLink.individualTxs?.length || 1} transactions
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#797368]">NETWORK GAS FEE</span>
                  <div className="font-bold text-[#575249]">{selectedLink.fee}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#797368]">BLOCKCHAIN</span>
                  <div className="font-bold text-[#2c5e43]">{selectedLink.chain.toUpperCase()}</div>
                </div>
              </div>

              {/* Aggregated Individual Transactions List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#1b2a41] uppercase tracking-wider font-mono">
                  <span>AGGREGATED TRANSACTIONS</span>
                  <span className="text-[10px] text-[#797368] font-normal">
                    {individualTxsList.length} RECORD{individualTxsList.length === 1 ? '' : 'S'}
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-0.5">
                  {individualTxsList.map((tx, idx) => (
                    <div
                      key={tx.hash || idx}
                      className="p-2.5 rounded bg-[#ece7dc] border border-[#d6cfc2] space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#1b2a41]">
                          <span className="text-[10px] text-[#797368]">#{idx + 1}</span>
                          <span>{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</span>
                          <button
                            onClick={() => handleCopy(tx.hash)}
                            className="text-[#575249] hover:text-[#0284c7] p-0.5 transition-colors"
                            title="Copy full transaction hash"
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {copiedText === tx.hash ? 'check' : 'content_copy'}
                            </span>
                          </button>
                        </div>
                        {renderTxRiskBadge(tx.riskLevel)}
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-[#1b2a41]">{tx.valueStr || selectedLink.value}</span>
                        <span className="text-[10px] text-[#797368]">{tx.timestamp}</span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#575249] pt-1 border-t border-[#dfd8cb]">
                        <span>Fee: {tx.fee || selectedLink.fee}</span>
                        <span className="text-[#2c5e43] uppercase">{tx.chain || selectedLink.chain}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedNode ? (
            <div className="p-3.5 bg-[#ece7dc] border border-[#d6cfc2] rounded-lg space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    selectedNode.type === 'VERIFIED_ENTITY' || selectedNode.type === 'BENIGN_PUBLIC'
                      ? 'bg-[#e0f2fe] text-[#0369a1]'
                      : selectedNode.type === 'SMART_CONTRACT'
                      ? 'bg-[#ede9fe] text-[#6d28d9]'
                      : selectedNode.type === 'SUSPECT_BURNER'
                      ? 'bg-[#fee2e2] text-[#991b1b]'
                      : 'bg-[#dfd8cb] text-[#1b2a41]'
                  }`}>
                    NODE TYPE: {selectedNode.type}
                  </span>
                  {selectedNode.terminalStatus && renderTerminalStatusBadge(selectedNode.terminalStatus)}
                </div>
                <span className="text-[11px] font-mono font-bold text-[#2c5e43]">
                  CHAIN: {selectedNode.chain.toUpperCase()}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-[#1b2a41] flex items-center gap-1">
                  {(selectedNode.type === 'VERIFIED_ENTITY' || selectedNode.type === 'BENIGN_PUBLIC') && (
                    <span className="material-symbols-outlined text-sm text-[#0284c7]">verified</span>
                  )}
                  <span>{selectedNode.label}</span>
                </div>
                <div className="text-[11px] font-mono text-[#575249] break-all select-all mt-0.5">
                  {selectedNode.address}
                </div>
                {selectedNode.entity && (
                  <div className="text-[10px] text-[#2c5e43] font-mono mt-1 font-semibold">
                    ENTITY: {selectedNode.entity}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#d6cfc2] text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#797368]">LIVE BALANCE</span>
                  <div className="font-bold text-[#1b2a41]">{selectedNode.balance}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#797368]">TX COUNT</span>
                  <div className="font-bold text-[#1b2a41]">{selectedNode.txCount.toLocaleString()}</div>
                </div>
              </div>

              {/* Complete Wallet Transaction Ledger */}
              <div className="space-y-2 pt-3 border-t border-[#d6cfc2]">
                <div className="flex items-center justify-between font-mono">
                  <div className="text-[11px] font-bold text-[#1b2a41] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#2c5e43]">receipt_long</span>
                    <span>LEDGER ({nodeTxs.length})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      onClick={() => setTxFilter('ALL')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                        txFilter === 'ALL'
                          ? 'bg-[#1b2a41] text-[#fff8f0]'
                          : 'bg-[#dfd8cb] text-[#575249] hover:bg-[#d6cfc2]'
                      }`}
                    >
                      ALL ({nodeTxs.length})
                    </button>
                    <button
                      onClick={() => setTxFilter('IN')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                        txFilter === 'IN'
                          ? 'bg-[#166534] text-[#fff8f0]'
                          : 'bg-[#dfd8cb] text-[#575249] hover:bg-[#d6cfc2]'
                      }`}
                    >
                      IN ({inboundNodeTxs.length})
                    </button>
                    <button
                      onClick={() => setTxFilter('OUT')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                        txFilter === 'OUT'
                          ? 'bg-[#991b1b] text-[#fff8f0]'
                          : 'bg-[#dfd8cb] text-[#575249] hover:bg-[#d6cfc2]'
                      }`}
                    >
                      OUT ({outboundNodeTxs.length})
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-[#797368] leading-tight font-mono">
                  Chronological on-chain transactions for this address. Multiple transactions between the same pair of addresses are bundled into single corridor arrows on the graph for clarity.
                </p>

                {filteredNodeTxs.length > 0 ? (
                  <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-0.5">
                    {filteredNodeTxs.map((tx, idx) => {
                      const isOut = (tx.from || '').toLowerCase() === selectedNode.address.toLowerCase();
                      const cpAddr = isOut ? (tx.to || '') : (tx.from || '');
                      return (
                        <div
                          key={tx.hash || idx}
                          className="p-2.5 rounded bg-[#f4ede4] border border-[#d6cfc2] space-y-1.5 shadow-2xs text-xs font-mono"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                  isOut ? 'bg-[#fee2e2] text-[#991b1b]' : 'bg-[#dcfce7] text-[#166534]'
                                }`}
                              >
                                {isOut ? 'OUT' : 'IN'}
                              </span>
                              <span className="font-bold text-[#1b2a41] text-[11px]">
                                {tx.hash ? `${tx.hash.slice(0, 8)}...${tx.hash.slice(-6)}` : `Tx #${idx + 1}`}
                              </span>
                              {tx.hash && (
                                <button
                                  onClick={() => handleCopy(tx.hash)}
                                  className="text-[#575249] hover:text-[#0284c7] p-0.5 transition-colors"
                                  title="Copy transaction hash"
                                >
                                  <span className="material-symbols-outlined text-[13px]">
                                    {copiedText === tx.hash ? 'check' : 'content_copy'}
                                  </span>
                                </button>
                              )}
                            </div>
                            {renderTxRiskBadge(tx.riskLevel)}
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1 text-[#575249] truncate max-w-[60%]">
                              <span>{isOut ? 'To:' : 'From:'}</span>
                              <span className="font-bold text-[#1b2a41] truncate">{formatAddr(cpAddr)}</span>
                              {cpAddr && (
                                <button
                                  onClick={() => handleCopy(cpAddr)}
                                  className="text-[#797368] hover:text-[#0284c7] p-0.5"
                                  title="Copy address"
                                >
                                  <span className="material-symbols-outlined text-[12px]">
                                    {copiedText === cpAddr ? 'check' : 'content_copy'}
                                  </span>
                                </button>
                              )}
                            </div>
                            <span className="font-bold text-[#1b2a41]">{tx.valueStr}</span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-[#797368] pt-1 border-t border-[#dfd8cb]">
                            <span>{tx.timestamp}</span>
                            <span>Fee: {tx.fee}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 bg-[#f4ede4] border border-[#d6cfc2] rounded text-center text-xs text-[#797368]">
                    No transactions matching filter criteria.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#ece7dc] border border-[#d6cfc2] rounded-lg text-center text-xs text-[#797368]">
              Click on any node or connection arrow in the graph to inspect forensic telemetry.
            </div>
          )}

          {/* Interactive Graph Navigation Tip */}
          <div className="p-2.5 rounded bg-[#f4ede4] border border-[#d6cfc2] text-[11px] text-[#575249] space-y-1">
            <div className="font-bold text-[#1b2a41] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#2c5e43]">insights</span>
              <span>Interactive Forensic Telemetry</span>
            </div>
            <p className="leading-relaxed">
              Click on any <span className="font-bold text-[#1b2a41]">flow arrow / amount pill</span> to expand the individual aggregated transactions and inspect counterparties. Click any <span className="font-bold text-[#1b2a41]">node circle</span> to view balance and contract attribution.
            </p>
          </div>

          {/* Risk Score Percentile Gauge */}
          <div className="p-4 bg-[#f4ede4] border border-[#d6cfc2] rounded-lg space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#1b2a41]">GNN COMPOSITE RISK SCORE</span>
              <span className={`font-mono text-sm ${traceData.riskScore < 25 ? 'text-[#16a34a]' : 'text-[#9e2a2b]'}`}>
                {traceData.riskScore} / 100
              </span>
            </div>
            <div className="w-full bg-[#dfd8cb] h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                  traceData.riskScore < 25 ? 'bg-[#16a34a]' : traceData.riskScore < 70 ? 'bg-[#f59e0b]' : 'bg-[#9e2a2b]'
                }`}
                style={{ width: `${Math.max(traceData.riskScore, 3)}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#797368] font-mono flex justify-between">
              <span>0 (CLEAN/VERIFIED)</span>
              <span>100 (HIGH RISK LAUNDERING)</span>
            </div>
          </div>

          {/* Dynamic Heuristics Badges */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#1b2a41] uppercase tracking-wider font-mono flex items-center justify-between">
              <span>EVALUATED FORENSIC HEURISTICS</span>
              <span className="text-[10px] text-[#797368]">
                {traceData.heuristics ? `${traceData.heuristics.filter(h => h.isTriggered).length} / ${traceData.heuristics.length} TRIGGERED` : 'ACTIVE'}
              </span>
            </div>

            {traceData.heuristics && traceData.heuristics.length > 0 ? (
              traceData.heuristics.map((h) => (
                <div key={h.code} className="p-2.5 rounded bg-[#f4ede4] border border-[#d6cfc2] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#1b2a41]">
                    <span>{h.code}: {h.name}</span>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      h.isTriggered
                        ? 'bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]'
                        : h.status === 'ATTRIBUTED' || h.status === 'VERIFIED'
                        ? 'bg-[#e0f2fe] text-[#0369a1] border border-[#bae6fd]'
                        : 'bg-[#dcfce7] text-[#166534] border border-[#86efac]'
                    }`}>
                      {h.status}: {h.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#575249] leading-relaxed">
                    {h.summary}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-3 bg-[#ece7dc] border border-[#d6cfc2] rounded text-xs text-[#797368] text-center">
                Heuristic telemetry evaluated for current trace topology.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Panel Actions */}
        <div className="p-4 border-t border-[#d6cfc2] space-y-2 bg-[#ece7dc] shrink-0">
          <button
            onClick={onGenerateDossier}
            className="w-full bg-[#1b2a41] hover:bg-[#111e30] active:translate-y-px text-[#fff8f0] font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-xs uppercase tracking-wider font-mono"
          >
            <span className="material-symbols-outlined text-base">gavel</span>
            <span>Generate Court Evidence Dossier</span>
          </button>

          <button
            onClick={handleQuickExportPdf}
            disabled={isExportingPdf}
            className="w-full bg-[#f4ede4] hover:bg-[#e4dfd5] active:translate-y-px border border-[#d6cfc2] text-[#1b2a41] font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs font-mono disabled:opacity-50"
            title="Download official Section 63 BSA certified PDF"
          >
            <span className="material-symbols-outlined text-[15px] text-[#2c5e43]">
              {isExportingPdf ? 'hourglass_top' : 'download'}
            </span>
            <span>{isExportingPdf ? 'Compiling Sealed PDF...' : 'Quick Export PDF (Sec 63 BSA)'}</span>
          </button>

        </div>
      </aside>
    </div>
  );
};
