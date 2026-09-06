'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphNode, TraceGraphData } from '../../lib/types/forensics';

interface D3GraphVisualizerProps {
  data: TraceGraphData;
  selectedNode: GraphNode | null;
  onSelectNode: (node: GraphNode) => void;
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
}

export const D3GraphVisualizer: React.FC<D3GraphVisualizerProps> = ({
  data,
  selectedNode,
  onSelectNode,
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

    // Simulation setup
    const simulation = d3
      .forceSimulation<D3Node>(nodes)
      .force(
        'link',
        d3
          .forceLink<D3Node, D3Link>(links)
          .id((d) => d.id)
          .distance(160)
      )
      .force('charge', d3.forceManyBody().strength(-450))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(45));

    // Draw Links
    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => (d.isBridge ? '#9e2a2b' : '#c8c0b1'))
      .attr('stroke-width', (d) => (d.isBridge ? 2.5 : 2))
      .attr('stroke-dasharray', (d) => (d.isBridge ? '6,4' : 'none'))
      .attr('marker-end', (d) => (d.isBridge ? 'url(#arrow-bridge)' : 'url(#arrow)'));

    // Draw Link Labels (Values)
    const linkLabels = g
      .append('g')
      .attr('class', 'link-labels')
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', '#575249')
      .attr('text-anchor', 'middle')
      .text((d) => `${d.value} (${d.fee})`);

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
        if (d.id === selectedNode?.id) return '#1b2a41';
        if (d.riskScore > 85) return '#9e2a2b';
        if (d.type === 'EXCHANGE_HOT') return '#2c5e43';
        return '#d6cfc2';
      })
      .attr('stroke-width', (d) => (d.id === selectedNode?.id ? 3 : 1.5))
      .attr('stroke-dasharray', (d) => (d.type === 'BRIDGE_LOCK' ? '4,3' : 'none'));

    // Node main circle
    node
      .append('circle')
      .attr('r', 18)
      .attr('fill', (d) => {
        switch (d.type) {
          case 'VICTIM':
            return '#2c5e43';
          case 'SUSPECT_BURNER':
            return '#9e2a2b';
          case 'INTERMEDIARY':
            return '#7d4a13';
          case 'BRIDGE_LOCK':
            return '#1b2a41';
          case 'BRIDGE_MINT':
            return '#b58500';
          case 'EXCHANGE_HOT':
            return '#1e4430';
          default:
            return '#575249';
        }
      })
      .attr('stroke', '#fff8f0')
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
      .attr('font-family', 'Source Sans 3, sans-serif')
      .attr('font-weight', 'bold')
      .attr('fill', '#21201d')
      .text((d) => d.label);

    // Address sub-text
    node
      .append('text')
      .attr('y', 46)
      .attr('text-anchor', 'middle')
      .attr('font-size', '9px')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', '#575249')
      .text((d) => `${d.address.slice(0, 6)}...${d.address.slice(-4)}`);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as D3Node).x!)
        .attr('y1', (d) => (d.source as D3Node).y!)
        .attr('x2', (d) => (d.target as D3Node).x!)
        .attr('y2', (d) => (d.target as D3Node).y!);

      linkLabels
        .attr('x', (d) => ((d.source as D3Node).x! + (d.target as D3Node).x!) / 2)
        .attr('y', (d) => ((d.source as D3Node).y! + (d.target as D3Node).y!) / 2 - 8);

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
  }, [data, selectedNode, onSelectNode]);

  return (
    <div className="w-full h-full relative bg-[#e8e3d8] overflow-hidden">
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Visual Canvas Legends */}
      <div className="absolute bottom-4 left-4 bg-[#f3efe6]/90 backdrop-blur-sm border border-[#d6cfc2] p-2.5 rounded-lg shadow-xs flex items-center gap-4 text-xs font-mono text-[#575249]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#2c5e43]"></span>
          <span>Victim (#0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#9e2a2b]"></span>
          <span>Suspect / Burner</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#1b2a41]"></span>
          <span>Cross-Chain Bridge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#1e4430]"></span>
          <span>Exchange Hot Vault</span>
        </div>
      </div>
    </div>
  );
};
