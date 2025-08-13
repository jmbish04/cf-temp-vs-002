import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import api from './routes/api';
import type { Env } from './bindings.d';

const app = new Hono<{ Bindings: Env }>();

// 1) API
app.route('/api', api);

// 2) Static (the [assets] block in wrangler serves /ui/dist automatically)
//    We just make SPA fallback to index.html.
app.get('*', serveStatic({ root: './' }));
app.get('*', serveStatic({ path: './index.html' }));


// (Optional) Durable Object class if you want:
export class StateDO {
  state: DurableObjectState;
  env: Env;
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }
  async fetch(req: Request) {
    return new Response('ok');
  }
}

export default app;
