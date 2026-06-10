import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Database, HardDrive, ShieldAlert, CheckCircle, Activity, RefreshCw } from 'lucide-react';
import type { AppNodeData } from '../../api/mockApi';

export default function DatabaseConsole() {
  const { nodes, updateNodeDetails } = useStore();
  const [backingUpId, setBackingUpId] = useState<string | null>(null);
  const [backupStatus, setBackupStatus] = useState<string>('');

  const dbNodes = nodes.filter((n) => n.data.type === 'database');

  const handleBackup = (nodeId: string, label: string) => {
    setBackingUpId(nodeId);
    setBackupStatus(`Initializing backup cluster snapshot for "${label}"...`);
    
    setTimeout(() => {
      setBackupStatus(`Uploading encrypted snapshot database files to secure S3 storage...`);
    }, 1200);

    setTimeout(() => {
      setBackingUpId(null);
      alert(`Database backup complete!\nSuccessfully archived point-in-time snapshot for "${label}".`);
    }, 2500);
  };

  const handleDiskChange = (nodeId: string, value: string) => {
    let val = parseInt(value, 10);
    if (isNaN(val)) val = 0;
    updateNodeDetails(nodeId, { storage: val });
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950 p-6 flex flex-col gap-6 select-text">
      {/* Tab Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Database className="text-purple-400" size={20} />
          Database Console
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitor transactional databases, memory buffers, read replicas, and trigger manual snapshot archives.
        </p>
      </div>

      {/* Backup Notification Banner */}
      {backingUpId && (
        <div className="bg-indigo-950/20 border border-indigo-500/30 p-3.5 rounded-xl flex items-center gap-3 animate-pulse">
          <RefreshCw size={16} className="text-indigo-400 animate-spin" />
          <span className="text-xs text-indigo-300 font-semibold">{backupStatus}</span>
        </div>
      )}

      {/* Database Engines Grid */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 bg-slate-950/10">
          <h3 className="text-sm font-semibold text-slate-200">Active Database Deployments</h3>
          <span className="text-[10px] font-mono text-slate-500">{dbNodes.length} active instances</span>
        </div>

        <div className="flex-1 overflow-x-auto">
          {dbNodes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 select-none">
              <Database size={32} className="text-slate-700 mb-2" />
              <p className="text-xs">No database engine nodes currently in the selected app topology graph.</p>
            </div>
          ) : (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              {dbNodes.map((node) => {
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
                  <div
                    key={node.id}
                    className="rounded-xl border border-slate-800/80 bg-slate-950/40 hover:border-slate-700 transition-all p-4 flex flex-col gap-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <Database size={16} />
                        </span>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-200">{nodeData.label}</h4>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                            {nodeData.provider.toUpperCase()} • {nodeData.region}
                          </span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-mono uppercase font-bold tracking-wider ${statusColor}`}>
                        {statusIcon}
                        {nodeData.status}
                      </span>
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/30 font-mono text-[10px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-500">ENGINE TYPE</span>
                        <span className="text-slate-300 font-bold">Postgres Relational</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-500">HOURLY RUN COST</span>
                        <span className="text-indigo-400 font-bold">${nodeData.cost.toFixed(2)}/HR</span>
                      </div>
                    </div>

                    {/* Storage progress slider */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1"><HardDrive size={10} className="text-slate-500" /> Storage Capacity</span>
                        <span>{nodeData.storage}% utilized</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={nodeData.storage}
                        onChange={(e) => handleDiskChange(node.id, e.target.value)}
                        className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Action Items */}
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleBackup(node.id, nodeData.label)}
                        disabled={!!backingUpId}
                        className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[10px] tracking-wider uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Snapshot Backup
                      </button>
                      <button
                        onClick={() => alert(`Connection pool initialized!\nPurged 0 zombie database client pools for ${nodeData.label}.`)}
                        className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-300 text-[10px] tracking-wider uppercase font-semibold cursor-pointer transition-all"
                      >
                        Purge Pools
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
