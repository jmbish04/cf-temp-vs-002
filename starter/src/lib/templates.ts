export const projectRules = (name: string) => `# Project Rules\nProject: ${name}\n- Single source of truth.\n`;
export const agentRules = (agent: string, kind: string) =>
  JSON.stringify({ agent, kind, lint:true, tests:true }, null, 2);
