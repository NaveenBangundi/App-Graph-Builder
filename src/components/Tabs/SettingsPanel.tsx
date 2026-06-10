import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '../../store/useStore';
import { mockApiSettings, MOCK_GRAPHS } from '../../api/mockApi';
import { Settings, Database, HardDrive, Wifi } from 'lucide-react';

export default function SettingsPanel() {
  const { selectedAppId, setNodes, setEdges } = useStore();
  const queryClient = useQueryClient();

  const [latency, setLatency] = useState(mockApiSettings.getLatency());

  const handleLatencyChange = (val: string) => {
    const ms = parseInt(val, 10);
    if (!isNaN(ms)) {
      setLatency(ms);
      mockApiSettings.setLatency(ms);
    }
  };

  const handleFlushCache = () => {
    queryClient.clear();
    alert('TanStack query cache has been successfully flushed and invalidated!');
  };

  const handleResetTemplates = () => {
    if (!selectedAppId) return;
    const confirm = window.confirm(
      'Are you sure you want to reset the application topology graphs to their default templates? All your local additions and node parameter edits will be overwritten.'
    );
    if (confirm) {
      const originalGraph = MOCK_GRAPHS[selectedAppId];
      if (originalGraph) {
        setNodes(JSON.parse(JSON.stringify(originalGraph.nodes)));
        setEdges(JSON.parse(JSON.stringify(originalGraph.edges)));
        alert('Application graph templates have been reset to default structures.');
      }
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950 p-6 flex flex-col gap-6 select-text">
      {/* Tab Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="text-indigo-400" size={20} />
          Developer Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Tune simulator settings, control artificial network latency limits, and administer active memory stores.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Latency Control */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <Wifi size={14} className="text-indigo-400" /> Network Simulation
          </h3>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Simulated API Delay</span>
              <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {latency} ms
              </span>
            </div>
            
            <input
              type="range"
              min="0"
              max="3000"
              step="100"
              value={latency}
              onChange={(e) => handleLatencyChange(e.target.value)}
              className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            
            <div className="flex justify-between text-[9px] font-mono text-slate-500">
              <span>0ms (Instant)</span>
              <span>1500ms (Slow 3G)</span>
              <span>3000ms (High Latency)</span>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-500 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-850">
            Applying latency introduces artificial server-response delays (`setTimeout` wrappers) when shifting applications, testing query load animation states.
          </p>
        </div>

        {/* Right Column: Database / Cache Administration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <Database size={14} className="text-purple-400" /> Administrative Routines
          </h3>

          <div className="flex flex-col gap-3">
            {/* Flush Cache */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-all">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-slate-200">Invalidate Query Cache</span>
                <span className="text-[10px] text-slate-500">Flush all active cached server queries.</span>
              </div>
              <button
                onClick={handleFlushCache}
                className="py-1.5 px-3 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-200 text-[10px] uppercase font-bold tracking-wider font-semibold transition-all cursor-pointer"
              >
                Flush Cache
              </button>
            </div>

            {/* Reset Templates */}
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-slate-950/40 border border-slate-850 hover:border-slate-800 transition-all">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-slate-200">Reset Graph Templates</span>
                <span className="text-[10px] text-slate-500">Restore all application nodes to defaults.</span>
              </div>
              <button
                onClick={handleResetTemplates}
                className="py-1.5 px-3 rounded-lg bg-red-950/20 hover:bg-red-900/10 border border-red-900/25 text-red-400 text-[10px] uppercase font-bold tracking-wider font-semibold transition-all cursor-pointer"
              >
                Reset Graphs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator stats info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <HardDrive size={16} />
        </span>
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="font-semibold text-slate-300">Simulator Sandbox Status</span>
          <span className="text-slate-400">Environment runs completely client-side. Refreshing the browser page resets the entire store back to default parameters.</span>
        </div>
      </div>
    </div>
  );
}
