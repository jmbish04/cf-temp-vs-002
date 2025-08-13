import { describe, it, expect } from 'vitest';
import { SELF } from 'cloudflare:test';

describe('API routes', () => {
  it('responds to /api/health', async () => {
    const res = await SELF.fetch('http://localhost/api/health');
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });
});
