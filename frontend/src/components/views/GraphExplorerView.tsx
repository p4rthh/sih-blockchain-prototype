'use client';

import React, { useState } from 'react';
import { FlowTransaction, GraphLink, GraphNode, TraceGraphData } from '../../lib/types/forensics';
import { D3GraphVisualizer } from '../graph/D3GraphVisualizer';
import { apiClient } from '../../lib/api/client';

interface GraphExplorerViewProps {
  traceData: TraceGraphData;
  onGenerateDossier: () => void;
  onTraceWallet?: (address: string) => void;
  isDark?: boolean;
}

export const GraphExplorerView: React.FC<GraphExplorerViewProps> = ({
  traceData,
  onGenerateDossier,
  onTraceWallet,
  isDark = false,
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
    <div className="flex-1 flex overflow-hidden h-full relative transition-colors duration-200">
      {/* LEFT: GRAPH CANVAS VIEWPORT */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-200 ${isDark ? 'bg-[#090d14]' : 'bg-[#e8e3d8]'}`}>
        {/* Top Floating Control Pill & Quick Switcher */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="bg-[#f3efe6]/85 dark:bg-[#131926]/85 backdrop-blur-md border border-[#d6cfc2]/80 dark:border-white/10 rounded-lg px-4 py-2 shadow-xs flex items-center gap-3 text-xs font-mono pointer-events-auto">
            <div className="flex items-center gap-1.5 font-bold text-[#B40039] dark:text-[#ff4d79]">
              <span className="material-symbols-outlined text-sm text-[#2c5e43] dark:text-[#4ade80]">schema</span>
              <span>TRACE: {traceData.traceId}</span>
            </div>
            <div className="h-3 w-px bg-[#d6cfc2]/80 dark:bg-white/10"></div>
            <div className="text-[#575249] dark:text-[#94a3b8]">
              ROOT: <span className="text-[#21201d] dark:text-[#f1f5f9] font-bold">{traceData.rootAddress.slice(0, 10)}...</span>
            </div>
            <div className="h-3 w-px bg-[#d6cfc2]/80 dark:bg-white/10"></div>
            <div className="text-[#575249] dark:text-[#94a3b8]">
              FLOW: <span className="text-[#B40039] dark:text-[#ff4d79] font-bold">{traceData.totalValueStolen}</span>
            </div>
            <div className="h-3 w-px bg-[#d6cfc2]/80 dark:bg-white/10"></div>
            <div className="text-[#2c5e43] dark:text-[#4ade80] font-bold">
              {traceData.nodes.length} NODES ({traceData.links.length} CORRIDORS)
            </div>
          </div>

          {/* Quick Trace Presets & Search Input */}
          {onTraceWallet && (
            <div className="bg-[#f3efe6]/85 dark:bg-[#131926]/85 backdrop-blur-md border border-[#d6cfc2]/80 dark:border-white/10 rounded-lg px-3 py-1.5 shadow-xs flex items-center gap-2 pointer-events-auto text-xs font-mono">
              <span className="text-[10px] text-[#797368] dark:text-[#8896ab] font-bold uppercase">PRESETS:</span>
              <button
                onClick={() => onTraceWallet('0x098b716b8aaf21512996dc57eb0615e2383e2f96')}
                className="px-2 py-0.5 rounded bg-[#fee2e2] dark:bg-[#3b1219] hover:bg-[#fecaca] dark:hover:bg-[#4c1822] text-[#991b1b] dark:text-[#fca5a5] border border-[#fca5a5] dark:border-[#7f1d1d] font-bold text-[10px] transition-colors"
                title="Lazarus Ronin $624M Heist"
              >
                Lazarus
              </button>
              <button
                onClick={() => onTraceWallet('0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc')}
                className="px-2 py-0.5 rounded bg-[#fee2e2] dark:bg-[#3b1219] hover:bg-[#ded7c8] dark:hover:bg-[#4c1822] text-[#9e2a2b] dark:text-[#fca5a5] border border-[#fca5a5] dark:border-[#7f1d1d] text-[10px] transition-colors"
                title="Tornado Cash ZK Mixer"
              >
                Tornado
              </button>
              <button
                onClick={() => onTraceWallet('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')}
                className="px-2 py-0.5 rounded bg-[#e0f2fe] dark:bg-[#0c2438] hover:bg-[#bae6fd] dark:hover:bg-[#113350] text-[#0369a1] dark:text-[#7dd3fc] border border-[#bae6fd] dark:border-[#0369a1] text-[10px] transition-colors"
                title="Vitalik Buterin (vitalik.eth)"
              >
                Vitalik
              </button>
              <button
                onClick={() => onTraceWallet('0x28C6c06298d514Db089934071355E5743bf21d60')}
                className="px-2 py-0.5 rounded bg-[#ece7dc]/80 dark:bg-[#1a2234]/80 hover:bg-[#ded7c8] dark:hover:bg-[#253048] text-[#B40039] dark:text-[#ff4d79] border border-[#d6cfc2]/80 dark:border-[#2a3449] text-[10px] transition-colors"
                title="Binance Hot 14"
              >
                Binance
              </button>
              <div className="h-3 w-px bg-[#d6cfc2]/80 dark:bg-white/10 mx-1"></div>
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
                  className="bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 border border-[#d6cfc2]/80 dark:border-[#2a3449] px-2 py-1 rounded text-[11px] font-mono text-[#21201d] dark:text-[#f1f5f9] w-40 placeholder:text-[#888173] dark:placeholder:text-[#64748b] focus:outline-none focus:border-[#B40039] dark:focus:border-[#ff4d79]"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-[#B40039] hover:bg-[#8e002c] text-[#fff8f0] rounded text-[10px] font-bold transition-colors uppercase"
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
          isDark={isDark}
        />

        {/* Floating Aggregated Corridor Inspector overlay directly on canvas */}
        {selectedLink && (
          <div className="absolute bottom-4 left-4 z-20 w-96 max-w-[calc(100%-2rem)] bg-[#f3efe6]/90 dark:bg-[#131926]/90 backdrop-blur-md border border-[#d6cfc2]/80 dark:border-white/10 rounded-xl p-3.5 shadow-lg space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#d6cfc2]/80 dark:border-white/10 pb-2">
              <div className="flex items-center gap-1.5 font-bold font-mono text-xs text-[#B40039] dark:text-[#ff4d79]">
                <span className="material-symbols-outlined text-sm text-[#0284c7]">hub</span>
                <span>CORRIDOR FLOW: {selectedLink.value}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#dbeafe] dark:bg-[#172554] text-[#1e40af] dark:text-[#93c5fd] font-bold">
                  {individualTxsList.length} TX{individualTxsList.length === 1 ? '' : 'S'}
                </span>
                <button
                  onClick={() => setSelectedLink(null)}
                  className="text-[#575249] dark:text-[#94a3b8] hover:text-[#B40039] dark:hover:text-[#ff4d79] p-0.5 rounded hover:bg-[#dfd8cb] dark:hover:bg-[#1e273a] transition-colors"
                  title="Close overlay"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            </div>

            {/* Endpoints */}
            <div className="flex items-center justify-between text-[11px] font-mono bg-[#ece7dc]/80 dark:bg-[#0f1420]/80 p-2 rounded-lg border border-[#d6cfc2]/80 dark:border-[#2a3449]">
              <div className="truncate max-w-[45%]">
                <span className="text-[9px] text-[#797368] dark:text-[#8896ab] font-bold block">SOURCE</span>
                <span className="font-bold text-[#B40039] dark:text-[#ff4d79] truncate block">{sourceNode?.label || formatAddr(String(selectedLink.source))}</span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#575249] dark:text-[#8896ab]">arrow_forward</span>
              <div className="truncate max-w-[45%] text-right">
                <span className="text-[9px] text-[#797368] dark:text-[#8896ab] font-bold block">TARGET</span>
                <span className="font-bold text-[#B40039] dark:text-[#ff4d79] truncate block">{targetNode?.label || formatAddr(String(selectedLink.target))}</span>
              </div>
            </div>

            {/* Direct transaction stream */}
            <div className="space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar pr-0.5">
              {individualTxsList.map((tx, idx) => (
                <div key={tx.hash || idx} className="p-2 rounded bg-[#fcfaf7]/80 dark:bg-[#161d2c]/80 border border-[#d6cfc2]/80 dark:border-[#2a3449] text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-[#B40039] dark:text-[#ff4d79] text-[11px]">
                      <span className="text-[10px] text-[#797368] dark:text-[#8896ab]">#{idx + 1}</span>
                      <span>{tx.hash ? `${tx.hash.slice(0, 8)}...${tx.hash.slice(-6)}` : 'Tx'}</span>
                      {tx.hash && (
                        <button
                          onClick={() => handleCopy(tx.hash)}
                          className="text-[#575249] dark:text-[#8896ab] hover:text-[#0284c7] p-0.5"
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
                    <span className="font-bold text-[#B40039] dark:text-[#ff4d79]">{tx.valueStr || selectedLink.value}</span>
                    <span className="text-[10px] text-[#797368] dark:text-[#8896ab]">{tx.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: FORENSIC INSPECTOR PANEL */}
      <aside className="w-96 bg-[#f3efe6]/85 dark:bg-[#0e131e]/85 backdrop-blur-md border-l border-[#d6cfc2]/80 dark:border-white/10 h-full flex flex-col overflow-hidden z-30 shrink-0">
        {/* Pinned Header */}
        <div className="p-4 pb-3 border-b border-[#d6cfc2]/80 dark:border-white/10 shrink-0 bg-[#f3efe6]/85 dark:bg-[#0e131e]/85">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[#797368] dark:text-[#8896ab]">
            <span>FORENSIC TELEMETRY</span>
            {selectedLink ? (
              <span className={`px-2 py-0.5 rounded border font-bold ${
                selectedLink.isBridge
                  ? 'bg-[#ede9fe] dark:bg-[#2e1065] text-[#6d28d9] dark:text-[#c4b5fd] border-[#c4b5fd] dark:border-[#581c87]'
                  : (selectedLink.txCount || 1) > 1
                  ? 'bg-[#dbeafe] dark:bg-[#172554] text-[#1e40af] dark:text-[#93c5fd] border-[#93c5fd] dark:border-[#1e3a8a]'
                  : 'bg-[#e0f2fe] dark:bg-[#082f49] text-[#0369a1] dark:text-[#7dd3fc] border-[#bae6fd] dark:border-[#0369a1]'
              }`}>
                {selectedLink.isBridge ? 'CROSS-CHAIN BRIDGE' : (selectedLink.txCount || 1) > 1 ? `AGGREGATED (${selectedLink.txCount} TXS)` : 'DIRECT HOP'}
              </span>
            ) : traceData.riskScore >= 70 ? (
              <span className="px-2 py-0.5 rounded bg-[#f8e3e1] dark:bg-[#3b1219] text-[#872021] dark:text-[#fca5a5] border border-[#ebb6b4] dark:border-[#7f1d1d]">
                SEV: CRITICAL LAUNDERING
              </span>
            ) : traceData.riskScore >= 25 ? (
              <span className="px-2 py-0.5 rounded bg-[#fef3c7] dark:bg-[#342410] text-[#92400e] dark:text-[#fde047] border border-[#fde68a] dark:border-[#5a3e1c]">
                SEV: ELEVATED RISK
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-[#dcfce7] dark:bg-[#142e20] text-[#166534] dark:text-[#86efac] border border-[#86efac] dark:border-[#235338]">
                SEV: BENIGN / VERIFIED
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            <h2 className="text-lg font-bold font-serif text-[#B40039] dark:text-[#ff4d79]">
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
          <p className="text-xs text-[#575249] dark:text-[#94a3b8]">
            {selectedLink
              ? `Flow corridor: ${selectedLink.heuristic || 'Temporal on-chain transfer'}`
              : `Topological classification: ${traceData.typology}`}
          </p>
        </div>

        {/* Scrollable Inspector Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {/* Money Trail Diagnostic & Fund Disposition Card */}
          <div className="p-3.5 bg-[#ece7dc]/80 dark:bg-[#151b28]/80 backdrop-blur-md border border-[#d6cfc2]/80 dark:border-white/10 rounded-lg space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold font-mono text-[#B40039] dark:text-[#ff4d79] uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm text-[#2c5e43] dark:text-[#4ade80]">radar</span>
                <span>TRAIL DISPOSITION &amp; VERDICT</span>
              </div>
              {renderTerminalStatusBadge(traceData.trailStatus)}
            </div>

            <p className="text-xs text-[#21201d] dark:text-[#f1f5f9] font-mono leading-relaxed bg-[#fcfaf7]/80 dark:bg-[#0f1420]/80 p-2.5 rounded border border-[#dfd8cb] dark:border-[#253046]">
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
              <div className="space-y-1.5 pt-1 border-t border-[#dfd8cb] dark:border-white/10">
                <div className="text-[10px] font-mono font-bold text-[#797368] dark:text-[#8896ab] uppercase">
                  TRAIL TERMINATION ENDPOINTS ({traceData.nodes.filter(n => n.isTerminal && n.id !== traceData.nodes[0]?.id).length})
                </div>
                <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar">
                  {traceData.nodes
                    .filter(n => n.isTerminal && n.id !== traceData.nodes[0]?.id)
                    .map((tn) => (
                      <div
                        key={tn.id}
                        onClick={() => handleSelectNode(tn)}
                        className="p-2 rounded bg-[#f4ede4]/80 dark:bg-[#1a2234]/80 hover:bg-[#e4dfd5] dark:hover:bg-[#253048] transition-colors border border-[#d6cfc2]/80 dark:border-[#2a3449] cursor-pointer flex items-center justify-between text-[11px] font-mono"
                      >
                        <div className="space-y-0.5 truncate max-w-[60%]">
                          <div className="font-bold text-[#B40039] dark:text-[#ff4d79] truncate">{tn.label}</div>
                          <div className="text-[10px] text-[#575249] dark:text-[#94a3b8] truncate">{formatAddr(tn.address)}</div>
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
              <div className="p-3.5 bg-[#ece7dc]/80 dark:bg-[#151b28]/80 backdrop-blur-md border border-[#d6cfc2]/80 dark:border-white/10 rounded-lg space-y-3 shadow-xs">
                <div className="text-[10px] font-mono font-bold text-[#797368] dark:text-[#8896ab] uppercase tracking-wider">
                  FLOW CORRIDOR ENDPOINTS
                </div>

                {/* Source Wallet Box */}
                <div className="p-2.5 rounded bg-[#f4ede4]/80 dark:bg-[#1a2234]/80 border border-[#d6cfc2]/80 dark:border-[#2a3449] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#797368] dark:text-[#8896ab]">FROM (SOURCE)</span>
                    {renderWalletBadge(sourceNode)}
                  </div>
                  <div className="text-xs font-bold text-[#B40039] dark:text-[#ff4d79]">{sourceNode?.label || 'Source Wallet'}</div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#575249] dark:text-[#94a3b8]">
                    <span className="break-all">{formatAddr(sourceNode?.address || String(selectedLink.source))}</span>
                    <button
                      onClick={() => handleCopy(sourceNode?.address || String(selectedLink.source))}
                      className="text-[#B40039] dark:text-[#ff4d79] hover:text-[#0284c7] ml-1 p-0.5 transition-colors"
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
                      className="text-[10px] font-mono text-[#0284c7] dark:text-[#38bdf8] hover:underline flex items-center gap-0.5 pt-1 font-semibold"
                    >
                      <span>Inspect this node</span>
                      <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </button>
                  )}
                </div>

                {/* Direction & Volume Divider */}
                <div className="flex items-center justify-center gap-2 py-0.5 text-xs font-mono font-bold text-[#B40039] dark:text-[#ff4d79]">
                  <span className="material-symbols-outlined text-sm text-[#9e2a2b] dark:text-[#f87171]">arrow_downward</span>
                  <span className="bg-[#dfd8cb] dark:bg-[#1f283c] px-2.5 py-1 rounded text-[11px] font-bold border border-[#d6cfc2]/80 dark:border-[#2a3449]">
                    {selectedLink.value}
                  </span>
                </div>

                {/* Target Wallet Box */}
                <div className="p-2.5 rounded bg-[#f4ede4]/80 dark:bg-[#1a2234]/80 border border-[#d6cfc2]/80 dark:border-[#2a3449] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#797368] dark:text-[#8896ab]">TO (DESTINATION)</span>
                    {renderWalletBadge(targetNode)}
                  </div>
                  <div className="text-xs font-bold text-[#B40039] dark:text-[#ff4d79]">{targetNode?.label || 'Destination Wallet'}</div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#575249] dark:text-[#94a3b8]">
                    <span className="break-all">{formatAddr(targetNode?.address || String(selectedLink.target))}</span>
                    <button
                      onClick={() => handleCopy(targetNode?.address || String(selectedLink.target))}
                      className="text-[#B40039] dark:text-[#ff4d79] hover:text-[#0284c7] ml-1 p-0.5 transition-colors"
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
                      className="text-[10px] font-mono text-[#0284c7] dark:text-[#38bdf8] hover:underline flex items-center gap-0.5 pt-1 font-semibold"
                    >
                      <span>Inspect this node</span>
                      <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Flow Overview Stats */}
              <div className="p-3 bg-[#f4ede4]/80 dark:bg-[#151b28]/80 border border-[#d6cfc2]/80 dark:border-white/10 rounded-lg grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#797368] dark:text-[#8896ab]">AGGREGATED FLOW</span>
                  <div className="font-bold text-[#B40039] dark:text-[#ff4d79]">{selectedLink.value}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#797368] dark:text-[#8896ab]">CORRIDOR TX COUNT</span>
                  <div className="font-bold text-[#B40039] dark:text-[#ff4d79]">
                    {selectedLink.txCount || selectedLink.individualTxs?.length || 1} transactions
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#797368] dark:text-[#8896ab]">NETWORK GAS FEE</span>
                  <div className="font-bold text-[#575249] dark:text-[#94a3b8]">{selectedLink.fee}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#797368] dark:text-[#8896ab]">BLOCKCHAIN</span>
                  <div className="font-bold text-[#2c5e43] dark:text-[#4ade80]">{selectedLink.chain.toUpperCase()}</div>
                </div>
              </div>

              {/* Aggregated Individual Transactions List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#B40039] dark:text-[#ff4d79] uppercase tracking-wider font-mono">
                  <span>AGGREGATED TRANSACTIONS</span>
                  <span className="text-[10px] text-[#797368] dark:text-[#8896ab] font-normal">
                    {individualTxsList.length} RECORD{individualTxsList.length === 1 ? '' : 'S'}
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-0.5">
                  {individualTxsList.map((tx, idx) => (
                    <div
                      key={tx.hash || idx}
                      className="p-2.5 rounded bg-[#ece7dc]/80 dark:bg-[#1a2234]/80 border border-[#d6cfc2]/80 dark:border-[#2a3449] space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#B40039] dark:text-[#ff4d79]">
                          <span className="text-[10px] text-[#797368] dark:text-[#8896ab]">#{idx + 1}</span>
                          <span>{tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}</span>
                          <button
                            onClick={() => handleCopy(tx.hash)}
                            className="text-[#575249] dark:text-[#8896ab] hover:text-[#0284c7] p-0.5 transition-colors"
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
                        <span className="font-bold text-[#B40039] dark:text-[#ff4d79]">{tx.valueStr || selectedLink.value}</span>
                        <span className="text-[10px] text-[#797368] dark:text-[#8896ab]">{tx.timestamp}</span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-[#575249] dark:text-[#94a3b8] pt-1 border-t border-[#dfd8cb] dark:border-[#2a3449]">
                        <span>Fee: {tx.fee || selectedLink.fee}</span>
                        <span className="text-[#2c5e43] dark:text-[#4ade80] uppercase">{tx.chain || selectedLink.chain}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedNode ? (
            <div className="p-3.5 bg-[#ece7dc]/80 dark:bg-[#151b28]/80 backdrop-blur-md border border-[#d6cfc2]/80 dark:border-white/10 rounded-lg space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    selectedNode.type === 'VERIFIED_ENTITY' || selectedNode.type === 'BENIGN_PUBLIC'
                      ? 'bg-[#e0f2fe] dark:bg-[#082f49] text-[#0369a1] dark:text-[#7dd3fc]'
                      : selectedNode.type === 'SMART_CONTRACT'
                      ? 'bg-[#ede9fe] dark:bg-[#2e1065] text-[#6d28d9] dark:text-[#c4b5fd]'
                      : selectedNode.type === 'SUSPECT_BURNER'
                      ? 'bg-[#fee2e2] dark:bg-[#3b1219] text-[#991b1b] dark:text-[#fca5a5]'
                      : 'bg-[#dfd8cb] dark:bg-[#1f283c] text-[#B40039] dark:text-[#ff4d79]'
                  }`}>
                    NODE TYPE: {selectedNode.type}
                  </span>
                  {selectedNode.terminalStatus && renderTerminalStatusBadge(selectedNode.terminalStatus)}
                </div>
                <span className="text-[11px] font-mono font-bold text-[#2c5e43] dark:text-[#4ade80]">
                  CHAIN: {selectedNode.chain.toUpperCase()}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-[#B40039] dark:text-[#ff4d79] flex items-center gap-1">
                  {(selectedNode.type === 'VERIFIED_ENTITY' || selectedNode.type === 'BENIGN_PUBLIC') && (
                    <span className="material-symbols-outlined text-sm text-[#0284c7]">verified</span>
                  )}
                  <span>{selectedNode.label}</span>
                </div>
                <div className="text-[11px] font-mono text-[#575249] dark:text-[#94a3b8] break-all select-all mt-0.5">
                  {selectedNode.address}
                </div>
                {selectedNode.entity && (
                  <div className="text-[10px] text-[#2c5e43] dark:text-[#4ade80] font-mono mt-1 font-semibold">
                    ENTITY: {selectedNode.entity}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#d6cfc2] dark:border-white/10 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#797368] dark:text-[#8896ab]">LIVE BALANCE</span>
                  <div className="font-bold text-[#B40039] dark:text-[#ff4d79]">{selectedNode.balance}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#797368] dark:text-[#8896ab]">TX COUNT</span>
                  <div className="font-bold text-[#B40039] dark:text-[#ff4d79]">{selectedNode.txCount.toLocaleString()}</div>
                </div>
              </div>

              {/* Complete Wallet Transaction Ledger */}
              <div className="space-y-2 pt-3 border-t border-[#d6cfc2] dark:border-white/10">
                <div className="flex items-center justify-between font-mono">
                  <div className="text-[11px] font-bold text-[#B40039] dark:text-[#ff4d79] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#2c5e43] dark:text-[#4ade80]">receipt_long</span>
                    <span>LEDGER ({nodeTxs.length})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      onClick={() => setTxFilter('ALL')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                        txFilter === 'ALL'
                          ? 'bg-[#B40039] text-[#fff8f0]'
                          : 'bg-[#dfd8cb] dark:bg-[#1a2234] text-[#575249] dark:text-[#94a3b8] hover:bg-[#d6cfc2] dark:hover:bg-[#253048]'
                      }`}
                    >
                      ALL ({nodeTxs.length})
                    </button>
                    <button
                      onClick={() => setTxFilter('IN')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                        txFilter === 'IN'
                          ? 'bg-[#166534] dark:bg-[#15803d] text-[#fff8f0]'
                          : 'bg-[#dfd8cb] dark:bg-[#1a2234] text-[#575249] dark:text-[#94a3b8] hover:bg-[#d6cfc2] dark:hover:bg-[#253048]'
                      }`}
                    >
                      IN ({inboundNodeTxs.length})
                    </button>
                    <button
                      onClick={() => setTxFilter('OUT')}
                      className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                        txFilter === 'OUT'
                          ? 'bg-[#991b1b] dark:bg-[#b91c1c] text-[#fff8f0]'
                          : 'bg-[#dfd8cb] dark:bg-[#1a2234] text-[#575249] dark:text-[#94a3b8] hover:bg-[#d6cfc2] dark:hover:bg-[#253048]'
                      }`}
                    >
                      OUT ({outboundNodeTxs.length})
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-[#797368] dark:text-[#8896ab] leading-tight font-mono">
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
                          className="p-2.5 rounded bg-[#f4ede4]/80 dark:bg-[#1a2234]/80 border border-[#d6cfc2]/80 dark:border-[#2a3449] space-y-1.5 shadow-2xs text-xs font-mono"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                  isOut ? 'bg-[#fee2e2] dark:bg-[#3b1219] text-[#991b1b] dark:text-[#fca5a5]' : 'bg-[#dcfce7] dark:bg-[#142e20] text-[#166534] dark:text-[#86efac]'
                                }`}
                              >
                                {isOut ? 'OUT' : 'IN'}
                              </span>
                              <span className="font-bold text-[#B40039] dark:text-[#ff4d79] text-[11px]">
                                {tx.hash ? `${tx.hash.slice(0, 8)}...${tx.hash.slice(-6)}` : `Tx #${idx + 1}`}
                              </span>
                              {tx.hash && (
                                <button
                                  onClick={() => handleCopy(tx.hash)}
                                  className="text-[#575249] dark:text-[#8896ab] hover:text-[#0284c7] p-0.5 transition-colors"
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
                            <div className="flex items-center gap-1 text-[#575249] dark:text-[#94a3b8] truncate max-w-[60%]">
                              <span>{isOut ? 'To:' : 'From:'}</span>
                              <span className="font-bold text-[#B40039] dark:text-[#ff4d79] truncate">{formatAddr(cpAddr)}</span>
                              {cpAddr && (
                                <button
                                  onClick={() => handleCopy(cpAddr)}
                                  className="text-[#797368] dark:text-[#8896ab] hover:text-[#0284c7] p-0.5"
                                  title="Copy address"
                                >
                                  <span className="material-symbols-outlined text-[12px]">
                                    {copiedText === cpAddr ? 'check' : 'content_copy'}
                                  </span>
                                </button>
                              )}
                            </div>
                            <span className="font-bold text-[#B40039] dark:text-[#ff4d79]">{tx.valueStr}</span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-[#797368] dark:text-[#8896ab] pt-1 border-t border-[#dfd8cb] dark:border-[#2a3449]">
                            <span>{tx.timestamp}</span>
                            <span>Fee: {tx.fee}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-3 bg-[#f4ede4]/80 dark:bg-[#1a2234]/80 border border-[#d6cfc2]/80 dark:border-[#2a3449] rounded text-center text-xs text-[#797368] dark:text-[#8896ab]">
                    No transactions matching filter criteria.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#ece7dc]/80 dark:bg-[#151b28]/80 border border-[#d6cfc2]/80 dark:border-white/10 rounded-lg text-center text-xs text-[#797368] dark:text-[#8896ab]">
              Click on any node or connection arrow in the graph to inspect forensic telemetry.
            </div>
          )}

          {/* Interactive Graph Navigation Tip */}
          <div className="p-2.5 rounded bg-[#f4ede4]/80 dark:bg-[#151b28]/80 border border-[#d6cfc2]/80 dark:border-white/10 text-[11px] text-[#575249] dark:text-[#94a3b8] space-y-1">
            <div className="font-bold text-[#B40039] dark:text-[#ff4d79] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#2c5e43] dark:text-[#4ade80]">insights</span>
              <span>Interactive Forensic Telemetry</span>
            </div>
            <p className="leading-relaxed">
              Click on any <span className="font-bold text-[#B40039] dark:text-[#ff4d79]">flow arrow / amount pill</span> to expand the individual aggregated transactions and inspect counterparties. Click any <span className="font-bold text-[#B40039] dark:text-[#ff4d79]">node circle</span> to view balance and contract attribution.
            </p>
          </div>

          {/* Risk Score Percentile Gauge */}
          <div className="p-4 bg-[#f4ede4]/80 dark:bg-[#151b28]/80 backdrop-blur-md border border-[#d6cfc2]/80 dark:border-white/10 rounded-lg space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#B40039] dark:text-[#ff4d79]">GNN COMPOSITE RISK SCORE</span>
              <span className={`font-mono text-sm ${traceData.riskScore < 25 ? 'text-[#16a34a] dark:text-[#4ade80]' : 'text-[#9e2a2b] dark:text-[#f87171]'}`}>
                {traceData.riskScore} / 100
              </span>
            </div>
            <div className="w-full bg-[#dfd8cb] dark:bg-[#242e42] h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                  traceData.riskScore < 25 ? 'bg-[#16a34a]' : traceData.riskScore < 70 ? 'bg-[#f59e0b]' : 'bg-[#9e2a2b]'
                }`}
                style={{ width: `${Math.max(traceData.riskScore, 3)}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#797368] dark:text-[#8896ab] font-mono flex justify-between">
              <span>0 (CLEAN/VERIFIED)</span>
              <span>100 (HIGH RISK LAUNDERING)</span>
            </div>
          </div>

          {/* Dynamic Heuristics Badges */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#B40039] dark:text-[#ff4d79] uppercase tracking-wider font-mono flex items-center justify-between">
              <span>EVALUATED FORENSIC HEURISTICS</span>
              <span className="text-[10px] text-[#797368] dark:text-[#8896ab]">
                {traceData.heuristics ? `${traceData.heuristics.filter(h => h.isTriggered).length} / ${traceData.heuristics.length} TRIGGERED` : 'ACTIVE'}
              </span>
            </div>

            {traceData.heuristics && traceData.heuristics.length > 0 ? (
              traceData.heuristics.map((h) => (
                <div key={h.code} className="p-2.5 rounded bg-[#f4ede4]/80 dark:bg-[#151b28]/80 border border-[#d6cfc2]/80 dark:border-white/10 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#B40039] dark:text-[#ff4d79]">
                    <span>{h.code}: {h.name}</span>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      h.isTriggered
                        ? 'bg-[#fee2e2] dark:bg-[#3b1219] text-[#991b1b] dark:text-[#fca5a5] border border-[#fca5a5] dark:border-[#7f1d1d]'
                        : h.status === 'ATTRIBUTED' || h.status === 'VERIFIED'
                        ? 'bg-[#e0f2fe] dark:bg-[#082f49] text-[#0369a1] dark:text-[#7dd3fc] border border-[#bae6fd] dark:border-[#0369a1]'
                        : 'bg-[#dcfce7] dark:bg-[#142e20] text-[#166534] dark:text-[#86efac] border border-[#86efac] dark:border-[#235338]'
                    }`}>
                      {h.status}: {h.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#575249] dark:text-[#94a3b8] leading-relaxed">
                    {h.summary}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-3 bg-[#ece7dc]/80 dark:bg-[#151b28]/80 border border-[#d6cfc2]/80 dark:border-white/10 rounded text-xs text-[#797368] dark:text-[#8896ab] text-center">
                Heuristic telemetry evaluated for current trace topology.
              </div>
            )}
          </div>
        </div>

        {/* Bottom Panel Actions */}
        <div className="p-4 border-t border-[#d6cfc2]/80 dark:border-white/10 space-y-2 bg-[#ece7dc]/85 dark:bg-[#0e131e]/85 backdrop-blur-md shrink-0">
          <button
            onClick={onGenerateDossier}
            className="w-full bg-[#B40039] hover:bg-[#8e002c] active:translate-y-px text-[#fff8f0] font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-xs uppercase tracking-wider font-mono"
          >
            <span className="material-symbols-outlined text-base">gavel</span>
            <span>Generate Court Evidence Dossier</span>
          </button>

          <button
            onClick={handleQuickExportPdf}
            disabled={isExportingPdf}
            className="w-full bg-[#f4ede4]/80 dark:bg-[#1a2234]/80 hover:bg-[#e4dfd5] dark:hover:bg-[#253048] active:translate-y-px border border-[#d6cfc2]/80 dark:border-white/10 text-[#B40039] dark:text-[#ff4d79] font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs font-mono disabled:opacity-50"
            title="Download official Section 63 BSA certified PDF"
          >
            <span className="material-symbols-outlined text-[15px] text-[#2c5e43] dark:text-[#4ade80]">
              {isExportingPdf ? 'hourglass_top' : 'download'}
            </span>
            <span>{isExportingPdf ? 'Compiling Sealed PDF...' : 'Quick Export PDF (Sec 63 BSA)'}</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
