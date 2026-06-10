import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Cpu, HardDrive, Database, Settings, ShieldAlert, CheckCircle, Activity, HelpCircle } from 'lucide-react';
import type { AppNodeData } from '../api/mockApi';
import { useStore } from '../store/useStore';

export default function CustomNode({ id, data, selected }: NodeProps) {
  const { setSelectedNodeId, setIsMobilePanelOpen } = useStore();
  const nodeData = data as any as AppNodeData;

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(id);
    setIsMobilePanelOpen(true);
  };

  const getStatusColor = () => {
    switch (nodeData.status) {
      case 'healthy':
        return {
          border: 'border-emerald-500/30',
          glow: 'shadow-emerald-500/5',
          pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: <CheckCircle size={10} className="text-emerald-400" />,
        };
      case 'degraded':
        return {
          border: 'border-amber-500/30',
          glow: 'shadow-amber-500/5',
          pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: <Activity size={10} className="text-amber-400 animate-pulse" />,
        };
      case 'down':
        return {
          border: 'border-rose-500/30',
          glow: 'shadow-rose-500/5',
          pill: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          icon: <ShieldAlert size={10} className="text-rose-400" />,
        };
      default:
        return {
          border: 'border-slate-800',
          glow: 'shadow-transparent',
          pill: 'bg-slate-800 text-slate-400 border-slate-700',
          icon: <HelpCircle size={10} />,
        };
    }
  };

  const statusStyle = getStatusColor();

  return (
    <div
      onClick={handleSelect}
      className={`w-[260px] rounded-xl bg-slate-900/90 backdrop-blur-md border text-slate-300 font-sans transition-all cursor-pointer ${
        statusStyle.border
      } ${statusStyle.glow} ${
        selected
          ? 'ring-2 ring-indigo-500/80 border-indigo-400/50 shadow-indigo-500/10'
          : 'hover:border-slate-700'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-700 hover:!bg-indigo-500 !border-2 !border-slate-900 !rounded-full -left-1.5 transition-colors"
      />

      {/* Node Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {nodeData.type === 'database' ? (
            <Database size={14} className="text-purple-400" />
          ) : (
            <Cpu size={14} className="text-indigo-400" />
          )}
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            {nodeData.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono bg-slate-800/80 px-1.5 py-0.5 rounded text-indigo-300 border border-slate-700/50">
            ${nodeData.cost.toFixed(2)}/HR
          </span>
          <button className="text-slate-500 hover:text-slate-300 cursor-pointer">
            <Settings size={12} />
          </button>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-3.5 flex flex-col gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 truncate">{nodeData.label}</h4>
          <p className="text-[10px] text-slate-400/90 line-clamp-1 mt-0.5">{nodeData.description}</p>
        </div>

        {/* Resources Metrics (Synced Display) */}
        <div className="flex flex-col gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/30">
          {/* CPU Metric */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Cpu size={10} className="text-slate-500" /> CPU
              </span>
              <span className="font-semibold text-slate-300">{nodeData.cpu}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${nodeData.cpu}%` }}
              />
            </div>
          </div>

          {/* Memory Metric */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Activity size={10} className="text-slate-500" /> MEM
              </span>
              <span className="font-semibold text-slate-300">{nodeData.memory}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${nodeData.memory}%` }}
              />
            </div>
          </div>

          {/* Storage Metric */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <HardDrive size={10} className="text-slate-500" /> DISK
              </span>
              <span className="font-semibold text-slate-300">{nodeData.storage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${nodeData.storage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Spec details */}
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
          <span>REGION:</span>
          <span className="text-slate-300 font-semibold">{nodeData.region.toUpperCase()}</span>
        </div>
      </div>

      {/* Node Footer */}
      <div className="p-3 bg-slate-950/60 rounded-b-xl border-t border-slate-800/60 flex items-center justify-between">
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-mono uppercase font-bold tracking-wider ${statusStyle.pill}`}
        >
          {statusStyle.icon}
          <span>{nodeData.status}</span>
        </div>

        <div className="flex items-center gap-1">
          {nodeData.provider === 'aws' ? (
            <span className="text-[9px] font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
              AWS
            </span>
          ) : (
            <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-1.5 py-0.5 rounded">
              GCP
            </span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-700 hover:!bg-indigo-500 !border-2 !border-slate-900 !rounded-full -right-1.5 transition-colors"
      />
    </div>
  );
}
