import { useStore } from '../store/useStore';
import type { AppNodeData } from '../api/mockApi';
import { X, Trash2, Cpu, HardDrive, Shield, Server, Database, Globe, Layers, Activity } from 'lucide-react';

export default function NodeInspector() {
  const {
    selectedNodeId,
    nodes,
    setSelectedNodeId,
    updateNodeDetails,
    deleteNode,
    activeInspectorTab,
    setActiveInspectorTab,
    isMobilePanelOpen,
    setIsMobilePanelOpen,
  } = useStore();

  const node = nodes.find((n) => n.id === selectedNodeId);

  // Close inspector
  const handleClose = () => {
    setSelectedNodeId(null);
    setIsMobilePanelOpen(false);
  };

  // Delete node
  const handleDelete = () => {
    if (node) {
      deleteNode(node.id);
      handleClose();
    }
  };

  // Fallback empty state
  if (!node) {
    return (
      <aside className="hidden lg:flex w-80 border-l border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex-col items-center justify-center p-6 text-center text-slate-500 select-none flex-shrink-0 z-10">
        <Layers size={36} className="text-slate-700 mb-3 animate-pulse" />
        <h4 className="text-sm font-semibold text-slate-400 mb-1">No Node Selected</h4>
        <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
          Select a microservice or database node on the canvas to configure settings, status, and allocate resources.
        </p>
      </aside>
    );
  }

  const nodeData = node.data as AppNodeData;

  const handleTextChange = (field: keyof AppNodeData, val: string) => {
    updateNodeDetails(node.id, { [field]: val });
  };

  const handleNumChange = (field: keyof AppNodeData, val: string) => {
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > 100) num = 100;
    updateNodeDetails(node.id, { [field]: num });
  };

  // Mobile drawer overlay classes
  const containerClasses = isMobilePanelOpen
    ? 'fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl z-40 flex flex-col border-t border-slate-800 bg-slate-950 p-5 shadow-2xl transition-all duration-300 transform translate-y-0 lg:relative lg:inset-auto lg:translate-y-0 lg:w-80 lg:h-full lg:max-h-none lg:rounded-none lg:border-t-0 lg:border-l lg:p-0'
    : 'hidden lg:flex w-80 h-full border-l border-slate-800/80 bg-slate-950/90 backdrop-blur-md flex-col flex-shrink-0 z-10 transition-all';

  return (
    <>
      {/* Mobile background backdrop overlay */}
      {isMobilePanelOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside className={containerClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-850 lg:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400">
              {nodeData.type === 'database' ? <Database size={16} /> : <Cpu size={16} />}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Inspect Node</h3>
              <span className="text-[10px] font-mono text-slate-500">ID: {node.id.substring(0, 10)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all cursor-pointer"
              title="Delete Node"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Close Panel"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-850 lg:border-slate-800/80 px-2 pt-2">
          <button
            onClick={() => setActiveInspectorTab('config')}
            className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeInspectorTab === 'config'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveInspectorTab('runtime')}
            className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeInspectorTab === 'runtime'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Resources
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 select-text">
          {activeInspectorTab === 'config' ? (
            /* CONFIG SETTINGS TAB */
            <div className="flex flex-col gap-4">
              {/* Name Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Node Label
                </label>
                <input
                  type="text"
                  value={nodeData.label}
                  onChange={(e) => handleTextChange('label', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700 transition-all"
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Description
                </label>
                <textarea
                  value={nodeData.description}
                  onChange={(e) => handleTextChange('description', e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700 resize-none transition-all leading-relaxed"
                />
              </div>

              {/* Status Pill Toggles */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  System Health
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['healthy', 'degraded', 'down'] as const).map((status) => {
                    const isActive = nodeData.status === status;
                    let activeClass = '';
                    if (isActive) {
                      if (status === 'healthy') activeClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-400';
                      if (status === 'degraded') activeClass = 'bg-amber-500/10 border-amber-500 text-amber-400';
                      if (status === 'down') activeClass = 'bg-rose-500/10 border-rose-500 text-rose-400';
                    } else {
                      activeClass = 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300';
                    }

                    return (
                      <button
                        key={status}
                        onClick={() => handleTextChange('status', status)}
                        className={`py-1.5 border rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider cursor-pointer transition-all ${activeClass}`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cloud Provider Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                  <Server size={10} /> Cloud Provider
                </label>
                <select
                  value={nodeData.provider}
                  onChange={(e) => handleTextChange('provider', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700 transition-all cursor-pointer"
                >
                  <option value="aws">Amazon Web Services (AWS)</option>
                  <option value="gcp">Google Cloud Platform (GCP)</option>
                </select>
              </div>

              {/* Region Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
                  <Globe size={10} /> Provider Region
                </label>
                <select
                  value={nodeData.region}
                  onChange={(e) => handleTextChange('region', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-700 transition-all cursor-pointer"
                >
                  <option value="us-east-1">us-east-1 (N. Virginia)</option>
                  <option value="us-west-2">us-west-2 (Oregon)</option>
                  <option value="eu-west-1">eu-west-1 (Ireland)</option>
                  <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                </select>
              </div>

              {/* Hourly pricing */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Cost Specification
                </label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-400">
                  <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    ${nodeData.cost.toFixed(2)}/HR
                  </span>
                  <span>Estimated average run cost</span>
                </div>
              </div>
            </div>
          ) : (
            /* RESOURCES TAB (Synced Sliders) */
            <div className="flex flex-col gap-5">
              {/* CPU Synced Control */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Cpu size={14} className="text-slate-400" /> CPU Allocation
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nodeData.cpu}
                      onChange={(e) => handleNumChange('cpu', e.target.value)}
                      className="w-12 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-center text-xs font-mono font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-slate-500 text-xs font-mono">%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={nodeData.cpu}
                    onChange={(e) => handleNumChange('cpu', e.target.value)}
                    className="flex-1 accent-indigo-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                  />
                </div>
              </div>

              {/* MEMORY Synced Control */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Activity size={14} className="text-slate-400" /> Memory Capacity
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nodeData.memory}
                      onChange={(e) => handleNumChange('memory', e.target.value)}
                      className="w-12 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-center text-xs font-mono font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-slate-500 text-xs font-mono">%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={nodeData.memory}
                    onChange={(e) => handleNumChange('memory', e.target.value)}
                    className="flex-1 accent-purple-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                  />
                </div>
              </div>

              {/* STORAGE Synced Control */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <HardDrive size={14} className="text-slate-400" /> Storage Capacity
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={nodeData.storage}
                      onChange={(e) => handleNumChange('storage', e.target.value)}
                      className="w-12 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-center text-xs font-mono font-bold text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <span className="text-slate-500 text-xs font-mono">%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={nodeData.storage}
                    onChange={(e) => handleNumChange('storage', e.target.value)}
                    className="flex-1 accent-amber-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
                  />
                </div>
              </div>

              {/* Performance Indicator Card */}
              <div className="bg-slate-900/60 border border-slate-850 p-3.5 rounded-xl flex flex-col gap-1.5 select-none">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                  Runtime Assessment
                </div>
                <div className="flex items-center gap-2">
                  <Shield
                    size={16}
                    className={nodeData.cpu > 85 ? 'text-amber-400' : 'text-emerald-400'}
                  />
                  <span className="text-xs text-slate-300 leading-relaxed font-semibold">
                    {nodeData.cpu > 85
                      ? 'High performance constraint active.'
                      : 'Resource metrics inside operational nominal targets.'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
