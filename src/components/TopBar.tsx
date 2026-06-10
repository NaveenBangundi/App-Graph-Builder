import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { AppInfo } from '../api/mockApi';
import { ChevronDown, AlertTriangle, Trash2, Maximize2, Server, Database, Search } from 'lucide-react';
import { useReactFlow } from '@xyflow/react';

interface TopBarProps {
  apps: AppInfo[];
  isLoadingApps: boolean;
}

export default function TopBar({ apps, isLoadingApps }: TopBarProps) {
  const {
    selectedAppId,
    setSelectedAppId,
    addNode,
    clearCanvas,
    isErrorSimulated,
    setErrorSimulated,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();

  const currentApp = apps.find((app) => app.id === selectedAppId);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between text-slate-200 select-none z-20 flex-shrink-0">
      {/* Left side: Breadcrumb & App Selector */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <span>Console</span>
          <span>/</span>
          <span className="text-slate-300 font-medium">Topology</span>
        </div>
        
        {/* Searchable Dropdown Selector */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-medium transition-all cursor-pointer focus:outline-none min-w-[200px] justify-between"
          >
            <span className="truncate">
              {isLoadingApps ? 'Loading apps...' : currentApp?.name || 'Select App'}
            </span>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isOpen && (
            <div className="absolute top-11 left-0 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    setSelectedAppId(app.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer flex flex-col gap-0.5 ${
                    selectedAppId === app.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="font-medium">{app.name}</span>
                  <span
                    className={`text-[10px] truncate ${
                      selectedAppId === app.id ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {app.description}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Canvas Node Search */}
      <div className="hidden md:flex items-center relative w-64 max-w-xs">
        <Search size={16} className="absolute left-3 text-slate-400" />
        <input
          type="text"
          placeholder="Filter nodes in canvas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-700 focus:ring-1 focus:ring-slate-700 transition-all"
        />
      </div>

      {/* Right side: Controls & Simulator Toggle */}
      <div className="flex items-center gap-3">
        {/* Graph control Actions */}
        <div className="flex items-center gap-1 border-r border-slate-800/85 pr-3 mr-3">
          <button
            onClick={() => addNode('service')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-all"
            title="Add Service Node"
          >
            <Server size={14} className="text-indigo-400" />
            <span>+ Service</span>
          </button>
          
          <button
            onClick={() => addNode('database')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-all"
            title="Add Database Node"
          >
            <Database size={14} className="text-purple-400" />
            <span>+ DB</span>
          </button>

          <button
            onClick={() => fitView({ duration: 400 })}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer transition-all"
            title="Fit View"
          >
            <Maximize2 size={14} />
          </button>

          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-950 hover:bg-red-950/20 text-slate-400 hover:text-red-400 cursor-pointer transition-all"
            title="Clear Canvas"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Error Simulation Switch */}
        <button
          onClick={() => setErrorSimulated(!isErrorSimulated)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
            isErrorSimulated
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
          }`}
        >
          <AlertTriangle size={14} className={isErrorSimulated ? 'animate-bounce' : ''} />
          <span>{isErrorSimulated ? 'Simulating Error' : 'Simulate Error'}</span>
        </button>
      </div>
    </header>
  );
}
