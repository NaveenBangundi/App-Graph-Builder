import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import { useStore } from '../store/useStore';
import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

export default function FlowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
    setIsMobilePanelOpen,
    searchQuery,
  } = useStore();

  // Apply visual opacity filtering to highlight matching nodes
  const filteredNodes = nodes.map((node) => {
    if (!searchQuery) return node;
    const matches =
      node.data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.data.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return {
      ...node,
      style: {
        ...node.style,
        opacity: matches ? 1 : 0.2,
        transition: 'opacity 0.2s ease-in-out',
      },
    };
  });

  const onPaneClick = () => {
    setSelectedNodeId(null);
    setIsMobilePanelOpen(false);
  };

  return (
    <div className="flex-1 h-full w-full relative">
      <ReactFlow
        nodes={filteredNodes as any}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onPaneClick={onPaneClick}
        fitView
        className="bg-slate-950"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#334155" />
        <Controls position="bottom-left" showInteractive={false} />
        <MiniMap
          position="bottom-right"
          bgColor="#0f172a"
          nodeColor={(node) => {
            const status = node.data?.status;
            if (status === 'healthy') return '#10b981';
            if (status === 'degraded') return '#f59e0b';
            if (status === 'down') return '#ef4444';
            return '#334155';
          }}
          maskColor="rgba(11, 15, 25, 0.7)"
          className="border border-slate-800/80 !rounded-xl overflow-hidden !bg-slate-950/80"
          style={{ width: 100, height: 75 }}
        />
        
        {/* Simple instructions guide overlay panel */}
        <Panel
          position="top-left"
          className="bg-slate-900/90 backdrop-blur border border-slate-800 text-[10px] text-slate-400 font-mono p-2.5 rounded-lg select-none pointer-events-none max-w-xs flex flex-col gap-1 shadow-lg"
        >
          <div className="text-slate-300 font-bold uppercase tracking-wider">Canvas Guides</div>
          <div>• Drag nodes to arrange topology</div>
          <div>• Click node to edit in inspector</div>
          <div>• Drag between handles to connect</div>
          <div>• Select node + Backspace/Delete to remove</div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
