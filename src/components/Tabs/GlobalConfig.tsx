import { useState } from 'react';
import { Sliders, Plus, Trash2, ShieldCheck, KeyRound } from 'lucide-react';

interface ConfigItem {
  id: string;
  key: string;
  value: string;
  isSystem: boolean;
}

const DEFAULT_CONFIGS: ConfigItem[] = [
  { id: 'c-1', key: 'NODE_ENV', value: 'production', isSystem: true },
  { id: 'c-2', key: 'SERVER_PORT', value: '8080', isSystem: true },
  { id: 'c-3', key: 'AUTO_REFETCH_INTERVAL_MS', value: '10000', isSystem: false },
  { id: 'c-4', key: 'API_VERSION_TARGET', value: 'v1.4.2', isSystem: false },
  { id: 'c-5', key: 'LOG_LEVEL', value: 'debug', isSystem: false }
];

export default function GlobalConfig() {
  const [configs, setConfigs] = useState<ConfigItem[]>(DEFAULT_CONFIGS);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    // Force uppercase alphanumeric key
    const formattedKey = newKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');

    // Prevent duplicates
    if (configs.some((c) => c.key === formattedKey)) {
      alert(`Configuration key "${formattedKey}" already exists.`);
      return;
    }

    const newItem: ConfigItem = {
      id: `c-${Date.now()}`,
      key: formattedKey,
      value: newValue.trim(),
      isSystem: false
    };

    setConfigs([...configs, newItem]);
    setNewKey('');
    setNewValue('');
  };

  const handleDelete = (id: string) => {
    setConfigs(configs.filter((c) => c.id !== id));
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-950 p-6 flex flex-col gap-6 select-text">
      {/* Tab Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Sliders className="text-indigo-405 text-indigo-400" size={20} />
          Global Config Registry
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure environment flags, variables, API paths, and global thresholds shared across nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Add configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit flex flex-col gap-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <Plus size={14} className="text-indigo-400" /> Add New Parameter
          </h3>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                Parameter Key
              </label>
              <input
                type="text"
                placeholder="e.g. TIMEOUT_LIMIT_MS"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-700 transition-all font-mono"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                Value Assignment
              </label>
              <input
                type="text"
                placeholder="e.g. 5000"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-700 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all uppercase cursor-pointer"
            >
              Append Variable
            </button>
          </form>
        </div>

        {/* Right column: Config list */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <h3 className="text-sm font-semibold text-slate-200">Registered Variables</h3>
            <span className="text-[10px] font-mono text-slate-500">{configs.length} active mappings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs select-text">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500 font-mono uppercase tracking-wider text-[9px] font-bold bg-slate-950/20">
                  <th className="px-5 py-3">Variable Key</th>
                  <th className="px-5 py-3">Assigned Value</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {configs.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-850/25 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-semibold text-slate-200 flex items-center gap-2">
                      <KeyRound size={12} className="text-slate-500" />
                      {c.key}
                      {c.isSystem && (
                        <span className="text-[8px] font-mono font-bold tracking-wider text-slate-500 bg-slate-800 border border-slate-750 px-1 py-0.2 rounded uppercase">
                          System
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-300 select-text font-bold">
                      {c.value}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {c.isSystem ? (
                        <span className="text-slate-600 text-[10px] font-mono">Protected</span>
                      ) : (
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 rounded-lg bg-red-950/20 border border-red-900/25 text-slate-500 hover:text-red-400 hover:border-red-900/40 cursor-pointer transition-all"
                          title="Delete Variable"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck size={16} />
        </span>
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="font-semibold text-slate-300">Protected Configurations Sync</span>
          <span className="text-slate-400">System variables are encrypted and synced to host providers at runtime automatically.</span>
        </div>
      </div>
    </div>
  );
}
