'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FlowTransaction, GraphLink, GraphNode, TraceGraphData } from '../../lib/types/forensics';

interface D3GraphVisualizerProps {
  data: TraceGraphData;
  selectedNode: GraphNode | null;
  onSelectNode: (node: GraphNode) => void;
  selectedLink?: GraphLink | null;
  onSelectLink?: (link: GraphLink) => void;
  isDark?: boolean;
}

interface D3Node extends d3.SimulationNodeDatum, GraphNode {}
interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  value: string;
  currency: string;
  txHash: string;
  timestamp: string;
  fee: string;
  isBridge?: boolean;
  heuristic?: string;
  txCount?: number;
  individualTxs?: FlowTransaction[];
}

export const D3GraphVisualizer: React.FC<D3GraphVisualizerProps> = ({
  data,
  selectedNode,
  onSelectNode,
  selectedLink,
  onSelectLink,
  isDark = false,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = svgRef.current.clientWidth || 900;
    const height = svgRef.current.clientHeight || 650;

    // Clear previous elements
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', '100%')
      .attr('height', '100%');

    // Add Definitions for Arrow markers and filters
    const defs = svg.append('defs');

    // Standard arrow marker
    defs
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#8b8579');

    // Bridge arrow marker
    defs
      .append('marker')
      .attr('id', 'arrow-bridge')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#9e2a2b');

    // Selected arrow marker
    defs
      .append('marker')
      .attr('id', 'arrow-selected')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#B40039');

    // Zoom container
    const g = svg.append('g').attr('class', 'graph-viewport');

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Deep copy nodes and links for D3 simulation
    const nodes: D3Node[] = data.nodes.map((d, i) => ({
      ...d,
      // Give initial horizontal layout hint based on order
      x: 100 + i * ((width - 200) / (data.nodes.length - 1 || 1)),
      y: height / 2 + (i % 2 === 0 ? -40 : 40),
    }));

    const links: D3Link[] = data.links.map((d) => ({
      ...d,
      source: d.source,
      target: d.target,
    }));

    const getEntityId = (item: unknown): string => {
      if (typeof item === 'object' && item !== null) {
        const obj = item as { id?: string; address?: string };
        return obj.id || obj.address || '';
      }
      return String(item ?? '');
    };

    const isLinkSelected = (d: D3Link): boolean => {
      if (!selectedLink) return false;
      if (selectedLink.txHash && d.txHash && selectedLink.txHash === d.txHash) return true;
      const selSrc = getEntityId(selectedLink.source);
      const selTgt = getEntityId(selectedLink.target);
      const dSrc = getEntityId(d.source);
      const dTgt = getEntityId(d.target);
      return selSrc === dSrc && selTgt === dTgt;
    };

    // Simulation setup
    const simulation = d3
      .forceSimulation<D3Node>(nodes)
      .force(
        'link',
        d3
          .forceLink<D3Node, D3Link>(links)
          .id((d) => d.id)
          .distance(190)
      )
      .force('charge', d3.forceManyBody().strength(-550))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Draw Links
    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('cursor', 'pointer')
      .attr('stroke', (d) => {
        if (isLinkSelected(d)) return '#B40039';
        return d.isBridge ? '#9e2a2b' : (isDark ? '#3d4b63' : '#c8c0b1');
      })
      .attr('stroke-width', (d) => {
        if (isLinkSelected(d)) return 3.5;
        return d.isBridge ? 2.5 : 2;
      })
      .attr('stroke-dasharray', (d) => (d.isBridge ? '6,4' : 'none'))
      .attr('marker-end', (d) => {
        if (isLinkSelected(d)) return 'url(#arrow-selected)';
        return d.isBridge ? 'url(#arrow-bridge)' : 'url(#arrow)';
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onSelectLink) {
          const original = data.links.find(
            (l) => l.txHash === d.txHash || (getEntityId(l.source) === getEntityId(d.source) && getEntityId(l.target) === getEntityId(d.target))
          ) || (d as unknown as GraphLink);
          onSelectLink(original);
        }
      });

    // Draw Link Labels (Values) with clean background pill
    const linkLabels = g
      .append('g')
      .attr('class', 'link-labels')
      .selectAll('g')
      .data(links)
      .join('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onSelectLink) {
          const original = data.links.find(
            (l) => l.txHash === d.txHash || (getEntityId(l.source) === getEntityId(d.source) && getEntityId(l.target) === getEntityId(d.target))
          ) || (d as unknown as GraphLink);
          onSelectLink(original);
        }
      });

    linkLabels
      .append('rect')
      .attr('fill', (d) => (isLinkSelected(d) ? '#B40039' : (isDark ? '#141a27' : '#f3efe6')))
      .attr('stroke', (d) => (isLinkSelected(d) ? '#8e002c' : (isDark ? '#2a3449' : '#d6cfc2')))
      .attr('stroke-width', (d) => (isLinkSelected(d) ? 1.5 : 0.75))
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('x', (d) => {
        const textLen = (d.txCount && d.txCount > 1 && !d.value.includes('txs') ? `${d.value} (${d.txCount} txs)` : d.value).length;
        const w = Math.max(72, textLen * 7 + 16);
        return -w / 2;
      })
      .attr('y', -8)
      .attr('width', (d) => {
        const textLen = (d.txCount && d.txCount > 1 && !d.value.includes('txs') ? `${d.value} (${d.txCount} txs)` : d.value).length;
        return Math.max(72, textLen * 7 + 16);
      })
      .attr('height', 16);

    linkLabels
      .append('text')
      .attr('font-size', '9px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-weight', 'bold')
      .attr('fill', (d) => (isLinkSelected(d) ? '#fff8f0' : (isDark ? '#e2e8f0' : '#B40039')))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((d) => (d.txCount && d.txCount > 1 && !d.value.includes('txs') ? `${d.value} (${d.txCount} txs)` : d.value));

    const drag = d3
      .drag<SVGGElement, D3Node>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);

    // Draw Nodes Group
    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, D3Node>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .call(drag as any)
      .on('click', (event, d) => {
        event.stopPropagation();
        onSelectNode(d);
      });

    // Node outer rings for selected or high-risk nodes
    node
      .append('circle')
      .attr('r', (d) => (d.id === selectedNode?.id ? 26 : 22))
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        if (d.id === selectedNode?.id) return '#B40039';
        if (d.type === 'VERIFIED_ENTITY' || d.type === 'BENIGN_PUBLIC') return '#0284c7';
        if (d.type === 'SMART_CONTRACT') return '#818cf8';
        if (d.riskScore > 85) return '#9e2a2b';
        if (d.type === 'EXCHANGE_HOT') return '#2c5e43';
        return isDark ? '#2e384d' : '#d6cfc2';
      })
      .attr('stroke-width', (d) => (d.id === selectedNode?.id ? 3 : 1.5))
      .attr('stroke-dasharray', (d) => (d.type === 'BRIDGE_LOCK' ? '4,3' : 'none'));

    // Helper to identify exchange / VASP nodes
    const isExchangeNode = (d: GraphNode): boolean => {
      if (d.type === 'EXCHANGE_HOT' || d.type === 'EXCHANGE_DEPOSIT') return true;
      const text = `${d.label || ''} ${d.entity || ''} ${d.address || ''} ${d.clusterId || ''}`.toLowerCase();
      return (
        text.includes('wazirx') ||
        text.includes('coindcx') ||
        text.includes('coinswitch') ||
        text.includes('zebpay') ||
        text.includes('mudrex') ||
        text.includes('bitbns') ||
        text.includes('giottus') ||
        text.includes('unocoin') ||
        text.includes('binance') ||
        text.includes('kucoin') ||
        text.includes('vasp') ||
        text.includes('deposit vault') ||
        text.includes('hot vault') ||
        text.includes('hot wallet')
      );
    };

    // Node main circle
    node
      .append('circle')
      .attr('r', 18)
      .attr('fill', (d) => {
        // Guarantee exchange hot wallets and deposit vaults are never shaded brown
        if (isExchangeNode(d)) {
          return d.type === 'EXCHANGE_DEPOSIT' ? '#15803d' : '#1e4430';
        }
        switch (d.type) {
          case 'VERIFIED_ENTITY':
          case 'BENIGN_PUBLIC':
            return '#0284c7';
          case 'SMART_CONTRACT':
            return '#6366f1';
          case 'MIXER':
            return '#9e2a2b';
          case 'VICTIM':
            return '#2c5e43';
          case 'SUSPECT_BURNER':
            return '#b91c1c';
          case 'INTERMEDIARY':
            return '#7d4a13';
          case 'BRIDGE_LOCK':
            return '#B40039';
          case 'BRIDGE_MINT':
            return '#b58500';
          case 'EXCHANGE_DEPOSIT':
            return '#15803d';
          case 'EXCHANGE_HOT':
            return '#1e4430';
          default:
            return isDark ? '#64748b' : '#575249';
        }
      })
      .attr('stroke', isDark ? '#1a2234' : '#fff8f0')
      .attr('stroke-width', 2);

    // Node icon / symbol
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#fff8f0')
      .attr('font-size', '11px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-weight', 'bold')
      .text((d, i) => `#${i}`);

    // Node text label below
    node
      .append('text')
      .attr('y', 34)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('font-weight', 'bold')
      .attr('fill', isDark ? '#f1f5f9' : '#21201d')
      .text((d) => d.label);

    // Address sub-text
    node
      .append('text')
      .attr('y', 46)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', isDark ? '#94a3b8' : '#575249')
      .text((d) => `${d.address.slice(0, 6)}...${d.address.slice(-4)}`);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as D3Node).x!)
        .attr('y1', (d) => (d.source as D3Node).y!)
        .attr('x2', (d) => (d.target as D3Node).x!)
        .attr('y2', (d) => (d.target as D3Node).y!);

      linkLabels.attr('transform', (d) => {
        const sx = (d.source as D3Node).x || 0;
        const sy = (d.source as D3Node).y || 0;
        const tx = (d.target as D3Node).x || 0;
        const ty = (d.target as D3Node).y || 0;
        return `translate(${(sx + tx) / 2}, ${(sy + ty) / 2})`;
      });

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, selectedNode, onSelectNode, selectedLink, onSelectLink, isDark]);

  return (
    <div className={`w-full h-full relative overflow-hidden transition-colors duration-200 ${isDark ? 'bg-[#090d14]' : 'bg-[#e8e3d8]'}`}>
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Visual Canvas Legends */}
      <div className="absolute bottom-4 left-4 bg-[#f3efe6]/85 dark:bg-[#131926]/85 backdrop-blur-md border border-[#d6cfc2]/80 dark:border-white/10 p-2.5 rounded-lg shadow-xs flex items-center gap-4 text-xs font-mono text-[#575249] dark:text-[#94a3b8]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#0284c7]"></span>
          <span>Verified/Clean</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#2c5e43]"></span>
          <span>Victim (#0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#9e2a2b]"></span>
          <span>Suspect / Mixer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#B40039]"></span>
          <span>Cross-Chain Bridge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#15803d]"></span>
          <span>Deposit Vault</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#1e4430]"></span>
          <span>Exchange Hot Vault</span>
        </div>
      </div>
    </div>
  );
};
