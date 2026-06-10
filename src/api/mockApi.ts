export interface AppInfo {
  id: string;
  name: string;
  description: string;
  nodeCount: number;
}

export interface AppNodeData extends Record<string, unknown> {
  label: string;
  description: string;
  type: 'service' | 'database';
  status: 'healthy' | 'degraded' | 'down';
  cost: number;
  cpu: number;
  memory: number;
  storage: number;
  region: string;
  provider: 'aws' | 'gcp';
}

export interface AppEdge {
  id: string;
  source: string;
  target: string;
}

export interface AppGraph {
  nodes: {
    id: string;
    type: 'custom';
    position: { x: number; y: number };
    data: AppNodeData;
  }[];
  edges: AppEdge[];
}

export const MOCK_APPS: AppInfo[] = [
  {
    id: 'app-1',
    name: 'E-commerce Gateway',
    description: 'Production pipeline handling user auth, gateway routing, order orchestration, and DB transactions.',
    nodeCount: 5
  },
  {
    id: 'app-2',
    name: 'Logistics Tracking Network',
    description: 'High-throughput stream processing pipeline mapping carrier coordinates to tracking tables.',
    nodeCount: 3
  },
  {
    id: 'app-3',
    name: 'AI Recommendation Engine',
    description: 'Deep learning inference backend querying multi-dimensional vector database embeddings.',
    nodeCount: 2
  }
];

export const MOCK_GRAPHS: Record<string, AppGraph> = {
  'app-1': {
    nodes: [
      {
        id: 'node-1',
        type: 'custom',
        position: { x: 250, y: 50 },
        data: {
          label: 'API Gateway',
          description: 'Entry gateway managing client sessions, reverse proxying, and global load balancing.',
          type: 'service',
          status: 'healthy',
          cost: 0.04,
          cpu: 40,
          memory: 55,
          storage: 20,
          region: 'us-east-1',
          provider: 'aws'
        }
      },
      {
        id: 'node-2',
        type: 'custom',
        position: { x: 50, y: 220 },
        data: {
          label: 'Auth Service',
          description: 'Microservice validating tokens, roles, session expirations, and user credentials.',
          type: 'service',
          status: 'healthy',
          cost: 0.02,
          cpu: 15,
          memory: 30,
          storage: 10,
          region: 'us-east-1',
          provider: 'aws'
        }
      },
      {
        id: 'node-3',
        type: 'custom',
        position: { x: 450, y: 220 },
        data: {
          label: 'Order Manager',
          description: 'Orchestrates checkout shopping carts, invoices, and triggers shipping notifications.',
          type: 'service',
          status: 'degraded',
          cost: 0.05,
          cpu: 80,
          memory: 85,
          storage: 50,
          region: 'us-east-1',
          provider: 'gcp'
        }
      },
      {
        id: 'node-4',
        type: 'custom',
        position: { x: 450, y: 400 },
        data: {
          label: 'Inventory DB',
          description: 'Primary relational PostgreSQL database storing stock status, warehouses, and catalogs.',
          type: 'database',
          status: 'healthy',
          cost: 0.08,
          cpu: 30,
          memory: 65,
          storage: 75,
          region: 'us-east-1',
          provider: 'gcp'
        }
      },
      {
        id: 'node-5',
        type: 'custom',
        position: { x: 50, y: 400 },
        data: {
          label: 'Users RDS',
          description: 'Active-passive cluster storing user profiles, hashes, and audit histories.',
          type: 'database',
          status: 'down',
          cost: 0.06,
          cpu: 0,
          memory: 0,
          storage: 90,
          region: 'us-east-1',
          provider: 'aws'
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e1-3', source: 'node-1', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' },
      { id: 'e2-5', source: 'node-2', target: 'node-5' }
    ]
  },
  'app-2': {
    nodes: [
      {
        id: 'node-201',
        type: 'custom',
        position: { x: 250, y: 50 },
        data: {
          label: 'Data Ingestor',
          description: 'High-concurrency webhook server receiving carrier telemetry packages.',
          type: 'service',
          status: 'healthy',
          cost: 0.03,
          cpu: 50,
          memory: 45,
          storage: 15,
          region: 'eu-west-1',
          provider: 'aws'
        }
      },
      {
        id: 'node-202',
        type: 'custom',
        position: { x: 250, y: 220 },
        data: {
          label: 'Stream Processor',
          description: 'Apache Flink streaming pipelines correcting telemetry drift and adding routing logs.',
          type: 'service',
          status: 'healthy',
          cost: 0.06,
          cpu: 60,
          memory: 70,
          storage: 40,
          region: 'eu-west-1',
          provider: 'aws'
        }
      },
      {
        id: 'node-203',
        type: 'custom',
        position: { x: 250, y: 400 },
        data: {
          label: 'Timescale DB',
          description: 'Multi-node timeseries database logging location records and route durations.',
          type: 'database',
          status: 'healthy',
          cost: 0.12,
          cpu: 45,
          memory: 80,
          storage: 60,
          region: 'eu-west-1',
          provider: 'gcp'
        }
      }
    ],
    edges: [
      { id: 'e201-202', source: 'node-201', target: 'node-202' },
      { id: 'e202-203', source: 'node-202', target: 'node-203' }
    ]
  },
  'app-3': {
    nodes: [
      {
        id: 'node-301',
        type: 'custom',
        position: { x: 250, y: 80 },
        data: {
          label: 'Inference API',
          description: 'GPU-backed PyTorch endpoint responding to real-time embedding queries.',
          type: 'service',
          status: 'healthy',
          cost: 0.25,
          cpu: 95,
          memory: 90,
          storage: 30,
          region: 'us-west-2',
          provider: 'gcp'
        }
      },
      {
        id: 'node-302',
        type: 'custom',
        position: { x: 250, y: 300 },
        data: {
          label: 'Vector Store',
          description: 'Pinecone indices for quick similarity searches on catalog representations.',
          type: 'database',
          status: 'degraded',
          cost: 0.18,
          cpu: 75,
          memory: 85,
          storage: 45,
          region: 'us-west-2',
          provider: 'aws'
        }
      }
    ],
    edges: [
      { id: 'e301-302', source: 'node-301', target: 'node-302' }
    ]
  }
};

let errorSimulated = false;
let apiLatency = 800;

export const mockApiSettings = {
  isErrorSimulated: () => errorSimulated,
  setErrorSimulated: (state: boolean) => {
    errorSimulated = state;
  },
  getLatency: () => apiLatency,
  setLatency: (ms: number) => {
    apiLatency = ms;
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchApps(): Promise<AppInfo[]> {
  await delay(apiLatency);
  if (errorSimulated) {
    throw new Error('Simulated API Failure: Failed to retrieve app listing.');
  }
  return MOCK_APPS;
}

export async function fetchAppGraph(appId: string): Promise<AppGraph> {
  await delay(apiLatency);
  if (errorSimulated) {
    throw new Error(`Simulated API Failure: Failed to load topology graph for "${appId}".`);
  }
  const graph = MOCK_GRAPHS[appId];
  if (!graph) {
    throw new Error(`Application graph not found: ${appId}`);
  }
  return JSON.parse(JSON.stringify(graph));
}
