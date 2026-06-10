import { useStore } from '../../store/useStore';
import { Cpu, HardDrive, Activity, AlertTriangle, ShieldAlert, CheckCircle, Server } from 'lucide-react';
import type { AppNodeData } from '../../api/mockApi';

export default function MetricsDashboard() {
  const { nodes, updateNodeDetails } = useStore();

  const serviceNodes = nodes.filter((n) => n.data.type === 'service');

  // Compute stats
  const totalNodes = nodes.length;
  const healthyCount = nodes.filter((n) => n.data.status === 'healthy').length;
  const issueCount = nodes.filter((n) => n.data.status !== 'healthy').length;

  const avgCpu = totalNodes > 0
    ? Math.round(nodes.reduce((acc, curr) => acc + (curr.data.cpu || 0), 0) / totalNodes)
    : 0;

  const handleCpuChange = (nodeId: string, value: string) => {
    let val = parseInt(value, 10);
    if (isNaN(val)) val = 0;
    updateNodeDetails(nodeId, { cpu: val });
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950 p-6 flex flex-col gap-6 select-text">
      {/* Tab Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Activity className="text-indigo-400" size={20} />
          Realtime Systems Metrics
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Active system-wide hardware telemetry, processing performance, and health status indicators.
        </p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total nodes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Total Nodes</span>
            <span className="text-2xl font-bold text-slate-100 font-mono">{totalNodes}</span>
          </div>
          <span className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Server size={20} />
          </span>
        </div>

        {/* Avg CPU */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Avg CPU Load</span>
            <span className="text-2xl font-bold text-slate-100 font-mono">{avgCpu}%</span>
          </div>
          <span className="p-3 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Cpu size={20} />
          </span>
        </div>

        {/* Healthy nodes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Healthy Systems</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">{healthyCount}</span>
          </div>
          <span className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle size={20} />
          </span>
        </div>

        {/* Outage count */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Nodes with Alert</span>
            <span className={`text-2xl font-bold font-mono ${issueCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {issueCount}
            </span>
          </div>
          <span className={`p-3 rounded-lg border ${
            issueCount > 0 
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' 
              : 'bg-slate-900 text-slate-500 border-slate-800'
          }`}>
            <AlertTriangle size={20} />
          </span>
        </div>
      </div>

      {/* Services Table List */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h3 className="text-sm font-semibold text-slate-200">Microservice Node Allocations</h3>
          <span className="text-[10px] font-mono text-slate-500">{serviceNodes.length} active service components</span>
        </div>

        <div className="flex-1 overflow-x-auto">
          {serviceNodes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 select-none">
              <Cpu size={32} className="text-slate-700 mb-2" />
              <p className="text-xs">No microservice nodes currently in the selected app topology graph.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs select-text">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase tracking-wider text-[9px] font-bold bg-slate-950/20">
                  <th className="px-5 py-3">Service Name</th>
                  <th className="px-5 py-3">Region / Host</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">RAM</th>
                  <th className="px-5 py-3 w-40">CPU Utilization</th>
                  <th className="px-5 py-3 w-48 text-right">Cost Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {serviceNodes.map((node) => {
                  const nodeData = node.data as AppNodeData;
                  let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                  let statusIcon = <CheckCircle size={10} />;
                  if (nodeData.status === 'degraded') {
                    statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                    statusIcon = <Activity size={10} className="animate-pulse" />;
                  } else if (nodeData.status === 'down') {
                    statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                    statusIcon = <ShieldAlert size={10} />;
                  }

                  return (
                    <tr key={node.id} className="hover:bg-slate-850/35 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-slate-200">
                        {nodeData.label}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 font-mono uppercase">
                        <span className="text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-300 mr-2">
                          {nodeData.provider.toUpperCase()}
                        </span>
                        {nodeData.region}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-mono uppercase font-bold tracking-wider ${statusColor}`}>
                          {statusIcon}
                          {nodeData.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300 font-mono">
                        <div className="flex items-center gap-1.5">
                          <HardDrive size={12} className="text-slate-500" />
                          {nodeData.memory}%
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>{nodeData.cpu}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={nodeData.cpu}
                            onChange={(e) => handleCpuChange(node.id, e.target.value)}
                            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-indigo-400">
                        ${nodeData.cost.toFixed(2)}/HR
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
