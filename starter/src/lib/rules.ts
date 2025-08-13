import type { Env } from '../bindings.d';
import { qAll, qOne, run, id } from './db';

export async function createProject(env: Env, name: string, github_repo?: string) {
  const pid = id();
  await run(env, `INSERT INTO projects (id,name,github_repo) VALUES (?,?,?)`, pid, name, github_repo ?? null);
  return await qOne<any>(env, `SELECT * FROM projects WHERE id=?`, pid);
}
export const listProjects = (env: Env) => qAll(env, `SELECT * FROM projects ORDER BY created_at DESC`);
export const getProject = (env: Env, pid: string) => qOne<any>(env, `SELECT * FROM projects WHERE id=?`, pid);

export async function upsertAgent(env: Env, pid: string, name: string, model?: string, kind?: string) {
  const a = await qOne<any>(env, `SELECT * FROM agents WHERE project_id=? AND name=?`, pid, name);
  if (a) { await run(env, `UPDATE agents SET model=?, kind=? WHERE id=?`, model ?? null, kind ?? null, a.id); return await qOne(env, `SELECT * FROM agents WHERE id=?`, a.id); }
  const aid = id();
  await run(env, `INSERT INTO agents (id,project_id,name,model,kind) VALUES (?,?,?,?,?)`, aid, pid, name, model ?? null, kind ?? null);
  return await qOne<any>(env, `SELECT * FROM agents WHERE id=?`, aid);
}
export const listAgents = (env: Env, pid: string) => qAll(env, `SELECT * FROM agents WHERE project_id=?`, pid);

export async function writeRule(env: Env, pid: string, path: string, content: string, agent_id?: string|null) {
  const existing = await qOne<any>(env, `SELECT * FROM code_rules WHERE project_id=? AND path=? AND ifnull(agent_id,'') = ifnull(?, '')`, pid, path, agent_id ?? null);
  if (existing) { await run(env, `UPDATE code_rules SET content=?, version=version+1, updated_at=datetime('now') WHERE id=?`, content, existing.id); return await qOne(env, `SELECT * FROM code_rules WHERE id=?`, existing.id); }
  const rid = id();
  await run(env, `INSERT INTO code_rules (id,project_id,agent_id,path,content) VALUES (?,?,?,?,?)`, rid, pid, agent_id ?? null, path, content);
  return await qOne<any>(env, `SELECT * FROM code_rules WHERE id=?`, rid);
}
export const listRules = (env: Env, pid: string, agent_id?: string|null) =>
  agent_id ? qAll(env, `SELECT * FROM code_rules WHERE project_id=? AND agent_id=?`, pid, agent_id)
           : qAll(env, `SELECT * FROM code_rules WHERE project_id=?`, pid);
