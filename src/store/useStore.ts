import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from '@xyflow/react';
import type { AppNodeData } from '../api/mockApi';
import { mockApiSettings } from '../api/mockApi';

interface GraphState {
  selectedAppId: string | null;
  nodes: Node<AppNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  activeInspectorTab: 'config' | 'runtime';
  isMobilePanelOpen: boolean;
  isErrorSimulated: boolean;
  searchQuery: string;
  activeLeftRailTab: 'topology' | 'metrics' | 'databases' | 'config' | 'settings';
  
  setSelectedAppId: (appId: string | null) => void;
  setNodes: (nodes: Node<AppNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setActiveInspectorTab: (tab: 'config' | 'runtime') => void;
  setIsMobilePanelOpen: (open: boolean) => void;
  setErrorSimulated: (simulated: boolean) => void;
  setSearchQuery: (query: string) => void;
  updateNodeDetails: (nodeId: string, updates: Partial<AppNodeData>) => void;
  addNode: (type: 'service' | 'database') => void;
  deleteNode: (nodeId: string) => void;
  clearCanvas: () => void;
  setActiveLeftRailTab: (tab: 'topology' | 'metrics' | 'databases' | 'config' | 'settings') => void;
}

export const useStore = create<GraphState>((set, get) => ({
  selectedAppId: 'app-1',
  nodes: [],
  edges: [],
  selectedNodeId: null,
  activeInspectorTab: 'config',
  isMobilePanelOpen: false,
  isErrorSimulated: false,
  searchQuery: '',
  activeLeftRailTab: 'topology',

  setSelectedAppId: (appId) => {
    set({ selectedAppId: appId, selectedNodeId: null, isMobilePanelOpen: false });
  },

  setActiveLeftRailTab: (tab) => set({ activeLeftRailTab: tab }),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes as any) as any,
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: '#4b5563' },
        },
        get().edges
      ),
    });
  },

  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),

  setIsMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),

  setErrorSimulated: (simulated) => {
    mockApiSettings.setErrorSimulated(simulated);
    set({ isErrorSimulated: simulated });
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  updateNodeDetails: (nodeId, updates) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            },
          };
        }
        return node;
      }),
    });
  },

  addNode: (type) => {
    const id = `node-${Date.now()}`;
    const nodeCount = get().nodes.length + 1;
    const provider = Math.random() > 0.5 ? 'aws' : 'gcp';
    const region = get().nodes[0]?.data.region || (provider === 'aws' ? 'us-east-1' : 'us-west-2');

    const newNode: Node<AppNodeData> = {
      id,
      type: 'custom',
      position: {
        x: 150 + Math.random() * 100,
        y: 150 + Math.random() * 100,
      },
      data: {
        label: `${type === 'service' ? 'Service' : 'Database'} ${nodeCount}`,
        description: `Custom dynamic ${type === 'service' ? 'microservice' : 'relational DB cluster'} active in region ${region}.`,
        type,
        status: 'healthy',
        cost: type === 'service' ? 0.03 : 0.08,
        cpu: 25,
        memory: 40,
        storage: 20,
        region,
        provider,
      },
    };

    set({
      nodes: [...get().nodes, newNode],
      selectedNodeId: id,
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  clearCanvas: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
    });
  },
}));
