import axios from 'axios';
const base = '/api';
export const listProjects = () => axios.get(`${base}/projects`).then(r=>r.data);
export const createProject = (name: string, github_repo?: string) =>
  axios.post(`${base}/projects`, { name, github_repo }).then(r=>r.data);
export const listAgents = (pid: string) => axios.get(`${base}/projects/${pid}/agents`).then(r=>r.data);
export const createAgent = (pid: string, payload: any) =>
  axios.post(`${base}/projects/${pid}/agents`, payload).then(r=>r.data);
export const listRules = (pid: string, agent_id?: string) => axios.get(`${base}/projects/${pid}/rules`, { params: { agent_id } }).then(r=>r.data);
