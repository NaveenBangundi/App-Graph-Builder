import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactFlowProvider } from '@xyflow/react';
import { useStore } from './store/useStore';
import { fetchApps, fetchAppGraph } from './api/mockApi';
import AppLayout from './components/AppLayout';
import FlowCanvas from './components/FlowCanvas';
import NodeInspector from './components/NodeInspector';
import MetricsDashboard from './components/Tabs/MetricsDashboard';
import DatabaseConsole from './components/Tabs/DatabaseConsole';
import GlobalConfig from './components/Tabs/GlobalConfig';
import SettingsPanel from './components/Tabs/SettingsPanel';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import '@xyflow/react/dist/style.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function DashboardContent() {
  const {
    selectedAppId,
    setNodes,
    setEdges,
    isErrorSimulated,
    activeLeftRailTab,
  } = useStore();

  const lastSyncedAppId = useRef<string | null>(null);

  // Fetch all apps list
  const {
    data: appsData,
    isLoading: isLoadingApps,
    error: appsError,
    refetch: refetchApps,
  } = useQuery({
    queryKey: ['apps'],
    queryFn: fetchApps,
  });

  // Fetch graph details for the selected app
  const {
    data: graphData,
    isLoading: isLoadingGraph,
    error: graphError,
    refetch: refetchGraph,
  } = useQuery({
    queryKey: ['graph', selectedAppId],
    queryFn: () => fetchAppGraph(selectedAppId!),
    enabled: !!selectedAppId,
  });

  // Sync loaded graph data into Zustand store
  useEffect(() => {
    if (graphData && selectedAppId !== lastSyncedAppId.current) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
      lastSyncedAppId.current = selectedAppId;
    }
  }, [graphData, selectedAppId, setNodes, setEdges]);

  // Proactive refetch if user switches off error simulator
  useEffect(() => {
    if (!isErrorSimulated && (appsError || graphError)) {
      refetchApps();
      if (selectedAppId) refetchGraph();
    }
  }, [isErrorSimulated, appsError, graphError, refetchApps, refetchGraph, selectedAppId]);

  const handleRetry = () => {
    refetchApps();
    if (selectedAppId) refetchGraph();
  };

  const isLoading = isLoadingApps || (isLoadingGraph && lastSyncedAppId.current !== selectedAppId);
  const isError = !!appsError || !!graphError;
  const errorMessage = appsError?.message || graphError?.message || 'An unexpected system query error occurred.';

  // Outage fallback screen
  if (isError) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200 p-6 select-none font-sans">
        <div className="relative p-8 rounded-2xl bg-rose-950/15 border border-rose-500/20 max-w-md w-full flex flex-col items-center text-center shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 animate-bounce">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-100 mb-2">Simulated Outage Alert</h2>
          <p className="text-xs text-rose-300/80 mb-6 leading-relaxed bg-rose-950/20 p-3 rounded-lg border border-rose-900/30">
            {errorMessage}
          </p>
          <button
            onClick={handleRetry}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            Retry API Connection
          </button>
          
          <div className="text-[10px] text-slate-500 mt-4 font-mono">
            Toggle "Simulate Success" at the top right to disable artificial latency failures.
          </div>
        </div>
      </div>
    );
  }

  // Initial load screening
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400 select-none font-sans">
        <Loader2 size={32} className="text-indigo-500 animate-spin mb-3" />
        <span className="text-sm font-semibold tracking-wider text-slate-300">Retrieving system topology...</span>
        <span className="text-[10px] text-slate-600 font-mono mt-1">Simulating 800ms network handshake</span>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (activeLeftRailTab) {
      case 'topology':
        return (
          <>
            <FlowCanvas />
            <NodeInspector />
          </>
        );
      case 'metrics':
        return <MetricsDashboard />;
      case 'databases':
        return <DatabaseConsole />;
      case 'config':
        return <GlobalConfig />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return (
          <>
            <FlowCanvas />
            <NodeInspector />
          </>
        );
    }
  };

  return (
    <AppLayout apps={appsData || []} isLoadingApps={isLoadingApps}>
      {renderMainContent()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <DashboardContent />
      </ReactFlowProvider>
    </QueryClientProvider>
  );
}
