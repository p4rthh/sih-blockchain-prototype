'use client';

import React, { useState } from 'react';
import { GraphNode, TraceGraphData } from '../../lib/types/forensics';
import { D3GraphVisualizer } from '../graph/D3GraphVisualizer';

interface GraphExplorerViewProps {
  traceData: TraceGraphData;
  onGenerateDossier: () => void;
  onEmergencyFreeze: () => void;
}

export const GraphExplorerView: React.FC<GraphExplorerViewProps> = ({
  traceData,
  onGenerateDossier,
  onEmergencyFreeze,
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(traceData.nodes[1] || null);

  return (
    <div className="flex-1 flex overflow-hidden h-full relative">
      {/* LEFT: GRAPH CANVAS VIEWPORT */}
      <div className="flex-1 flex flex-col h-full bg-[#e8e3d8] overflow-hidden relative">
        {/* Top Floating Control Pill */}
        <div className="absolute top-4 left-4 z-20 bg-[#f3efe6]/95 backdrop-blur-sm border border-[#d6cfc2] rounded-lg px-4 py-2 shadow-xs flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 font-bold text-[#1b2a41]">
            <span className="material-symbols-outlined text-sm text-[#2c5e43]">schema</span>
            <span>TRACE ID: {traceData.traceId}</span>
          </div>
          <div className="h-3 w-px bg-[#d6cfc2]"></div>
          <div className="text-[#575249]">
            ROOT: <span className="text-[#21201d] font-bold">{traceData.rootAddress.slice(0, 8)}...</span>
          </div>
          <div className="h-3 w-px bg-[#d6cfc2]"></div>
          <div className="text-[#2c5e43] font-bold">
            CONFIDENCE: {traceData.confidence}% DETERMINISTIC
          </div>
        </div>

        {/* D3 SVG Visualizer */}
        <D3GraphVisualizer
          data={traceData}
          selectedNode={selectedNode}
          onSelectNode={(node) => setSelectedNode(node)}
        />
      </div>

      {/* RIGHT: FORENSIC INSPECTOR PANEL */}
      <aside className="w-96 bg-[#f3efe6] border-l border-[#d6cfc2] h-full flex flex-col justify-between overflow-y-auto custom-scrollbar z-30 shrink-0">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="border-b border-[#d6cfc2] pb-3">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-[#797368]">
              <span>FORENSIC TELEMETRY</span>
              <span className="px-2 py-0.5 rounded bg-[#f8e3e1] text-[#872021] border border-[#ebb6b4]">
                SEV: CRITICAL
              </span>
            </div>
            <h2 className="text-lg font-bold font-serif text-[#1b2a41] mt-1">Node Attribution Inspector</h2>
            <p className="text-xs text-[#575249]">Deep topological analysis &amp; multi-vector heuristic breakdown</p>
          </div>

          {/* Selected Node Card */}
          {selectedNode ? (
            <div className="p-3.5 bg-[#ece7dc] border border-[#d6cfc2] rounded-lg space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#dfd8cb] text-[#1b2a41] font-bold uppercase">
                  NODE TYPE: {selectedNode.type}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#2c5e43]">
                  CHAIN: {selectedNode.chain.toUpperCase()}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-[#1b2a41]">{selectedNode.label}</div>
                <div className="text-[11px] font-mono text-[#575249] break-all select-all mt-0.5">
                  {selectedNode.address}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#d6cfc2] text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#797368]">BALANCE</span>
                  <div className="font-bold text-[#1b2a41]">{selectedNode.balance}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#797368]">TX COUNT</span>
                  <div className="font-bold text-[#1b2a41]">{selectedNode.txCount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#ece7dc] border border-[#d6cfc2] rounded-lg text-center text-xs text-[#797368]">
              Click on any node in the graph to inspect forensic telemetry.
            </div>
          )}

          {/* Risk Score Percentile Gauge */}
          <div className="p-4 bg-[#f4ede4] border border-[#d6cfc2] rounded-lg space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#1b2a41]">GNN COMPOSITE RISK SCORE</span>
              <span className="text-[#9e2a2b] font-mono text-sm">{traceData.riskScore} / 100</span>
            </div>
            <div className="w-full bg-[#dfd8cb] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#9e2a2b] h-full rounded-full transition-all duration-700"
                style={{ width: `${traceData.riskScore}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#797368] font-mono flex justify-between">
              <span>0 (CLEAN/VERIFIED)</span>
              <span>100 (HIGH RISK LAUNDERING)</span>
            </div>
          </div>

          {/* 4 Heuristic Badges */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-[#1b2a41] uppercase tracking-wider font-mono">
              TRIGGERED FORENSIC HEURISTICS
            </div>

            <div className="p-2.5 rounded bg-[#f4ede4] border border-[#d6cfc2] text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-[#1b2a41]">
                <span>H1: Deposit Address Reuse</span>
                <span className="text-[#2c5e43] font-mono text-[10px]">MATCH (in:38, out:2)</span>
              </div>
              <p className="text-[11px] text-[#575249]">
                Funnel ratio confirms user deposit mailbox pattern converging into exchange vault.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#f4ede4] border border-[#d6cfc2] text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-[#1b2a41]">
                <span>H2: Temporal Consolidation</span>
                <span className="text-[#2c5e43] font-mono text-[10px]">Δt ≤ 10 BLOCKS</span>
              </div>
              <p className="text-[11px] text-[#575249]">
                Batch sweeping detected with centralized gas fee subsidizer bot link.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#f4ede4] border border-[#d6cfc2] text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-[#1b2a41]">
                <span>H3: Contract Fingerprinting</span>
                <span className="text-[#2c5e43] font-mono text-[10px]">JACCARD: 0.87</span>
              </div>
              <p className="text-[11px] text-[#575249]">
                Overlap with WazirX Zanmai Labs custody &amp; rebalancing smart contracts.
              </p>
            </div>

            <div className="p-2.5 rounded bg-[#f4ede4] border border-[#d6cfc2] text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-[#1b2a41]">
                <span>H4: GraphSAGE GNN</span>
                <span className="text-[#2c5e43] font-mono text-[10px]">P = 0.914</span>
              </div>
              <p className="text-[11px] text-[#575249]">
                Inductive node embedding classifies destination as <span className="font-mono font-bold text-[#9e2a2b]">EXCHANGE_DEPOSIT</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Panel Actions */}
        <div className="p-4 border-t border-[#d6cfc2] space-y-2 bg-[#ece7dc]">
          <button
            onClick={onGenerateDossier}
            className="w-full bg-[#1b2a41] hover:bg-[#111e30] text-[#fff8f0] font-semibold text-xs py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-xs uppercase tracking-wider font-mono"
          >
            <span className="material-symbols-outlined text-base">gavel</span>
            <span>Generate Court Evidence Dossier</span>
          </button>

          <button
            onClick={onEmergencyFreeze}
            className="w-full bg-[#9e2a2b] hover:bg-[#832122] text-[#fff8f0] font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-xs uppercase tracking-wide font-mono"
          >
            <span className="material-symbols-outlined text-[15px]">lock_reset</span>
            <span>Issue Sec 94 Freezing Notice</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
