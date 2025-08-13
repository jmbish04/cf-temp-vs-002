import { Ai } from '@cloudflare/ai';

export type Env = {
  DB: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
  AI: Ai;
  VEC: VectorizeIndex;
  HD: Hyperdrive;
  AE: AnalyticsEngineDataset;
  JOBS_OUT: Queue;
  STATE_DO: DurableObjectNamespace;
  ASSETS: { fetch: (req: Request) => Promise<Response> };

  REPO_RULES_DIR: string;
  RULE_FILENAMES: string;
  DEFAULT_MODEL: string;
  GITHUB_TOKEN?: string;
};
