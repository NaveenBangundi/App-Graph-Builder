import { useStore } from '../store/useStore';
import { Network, Database, Settings, Sliders, Activity, Layers } from 'lucide-react';

export default function LeftRail() {
  const { activeLeftRailTab, setActiveLeftRailTab } = useStore();

  const getBtnClass = (tab: 'topology' | 'metrics' | 'databases' | 'config' | 'settings') => {
    const base = "relative p-2.5 rounded-xl transition-all cursor-pointer group";
    if (activeLeftRailTab === tab) {
      return `${base} text-indigo-400 bg-indigo-500/10 border border-indigo-500/20`;
    }
    return `${base} text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent`;
  };

  return (
    <aside className="w-16 h-full flex flex-col items-center justify-between py-6 border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-md text-slate-400 select-none flex-shrink-0 z-10">
      {/* Brand Logo */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Network size={20} className="animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 bg-emerald-500" />
        </div>
        <span className="text-[9px] font-mono text-indigo-400/80 mt-1 uppercase tracking-widest font-semibold">
          AINYX
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-6">
        <button
          onClick={() => setActiveLeftRailTab('topology')}
          className={getBtnClass('topology')}
          title="Topology Graph"
        >
          <Layers size={20} />
          <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all origin-left bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50">
            Topology Graph
          </div>
        </button>
        
        <button
          onClick={() => setActiveLeftRailTab('metrics')}
          className={getBtnClass('metrics')}
          title="Realtime Metrics"
        >
          <Activity size={20} />
          <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all origin-left bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50">
            Realtime Metrics
          </div>
        </button>
        
        <button
          onClick={() => setActiveLeftRailTab('databases')}
          className={getBtnClass('databases')}
          title="Database Engines"
        >
          <Database size={20} />
          <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all origin-left bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50">
            Database Engines
          </div>
        </button>

        <button
          onClick={() => setActiveLeftRailTab('config')}
          className={getBtnClass('config')}
          title="Global Config"
        >
          <Sliders size={20} />
          <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all origin-left bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50">
            Global Config
          </div>
        </button>

        <button
          onClick={() => setActiveLeftRailTab('settings')}
          className={getBtnClass('settings')}
          title="Settings"
        >
          <Settings size={20} />
          <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all origin-left bg-slate-900 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap z-50">
            Settings
          </div>
        </button>
      </nav>

      {/* Footer / GitHub Link */}
      <div>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl hover:text-slate-200 hover:bg-slate-800/50 transition-all flex items-center justify-center cursor-pointer" 
          title="GitHub Repo"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
