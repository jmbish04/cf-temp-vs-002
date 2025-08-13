import type { Env } from '../bindings.d';
export const qAll = async <T>(env: Env, sql: string, ...args: any[]) =>
  (await env.DB.prepare(sql).bind(...args).all<T>()).results as T[];
export const qOne = async <T>(env: Env, sql: string, ...args: any[]) =>
  (await qAll<T>(env, sql, ...args))[0] ?? null;
export const run = async (env: Env, sql: string, ...args: any[]) =>
  await env.DB.prepare(sql).bind(...args).run();
export const id = () => crypto.randomUUID();
