import { Hono } from 'hono';
import type { Env } from '../bindings.d';
import { createProject, listProjects, getProject, upsertAgent, listAgents, writeRule, listRules } from '../lib/rules';
import { projectRules, agentRules } from '../lib/templates';

const api = new Hono<{ Bindings: Env }>();

api.get('/health', c => c.json({ ok: true }));

api.get('/projects', async c => c.json(await listProjects(c.env)));
api.post('/projects', async c => {
  const { name, github_repo } = await c.req.json();
  if (!name) return c.json({ error: 'name required' }, 400);
  const p = await createProject(c.env, name, github_repo);
  await writeRule(c.env, p!.id, `${c.env.REPO_RULES_DIR}/PROJECT_RULES.md`, projectRules(name), null);
  return c.json(p, 201);
});
api.get('/projects/:id', async c => {
  const p = await getProject(c.env, c.req.param('id'));
  return p ? c.json(p) : c.json({ error: 'not found' }, 404);
});
api.post('/projects/:id/agents', async c => {
  const { name, model, kind } = await c.req.json();
  if (!name) return c.json({ error: 'name required' }, 400);
  const a = await upsertAgent(c.env, c.req.param('id'), name, model, kind);
  await writeRule(c.env, a!.project_id, `${c.env.REPO_RULES_DIR}/AGENT_RULES.${a!.name}.json`, agentRules(a!.name, kind ?? 'generic'), a!.id);
  return c.json(a, 201);
});
api.get('/projects/:id/agents', async c => c.json(await listAgents(c.env, c.req.param('id'))));
api.get('/projects/:id/rules', async c => {
  const pid = c.req.param('id'); const agent = c.req.query('agent_id');
  return c.json(await listRules(c.env, pid, agent ?? null));
});

export default api;
