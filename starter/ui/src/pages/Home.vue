<template>
  <div class="max-w-4xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-semibold">Projects</h1>
    <form @submit.prevent="submit" class="flex gap-2">
      <input v-model="name" placeholder="Project name" class="border px-3 py-2 rounded w-1/3" required />
      <input v-model="repo" placeholder="owner/repo (optional)" class="border px-3 py-2 rounded w-1/2" />
      <UiButton type="submit">Create</UiButton>
    </form>

    <div class="space-y-2">
      <div v-for="p in projects" :key="p.id" class="p-3 border rounded flex justify-between items-center">
        <div>
          <div class="font-medium">{{ p.name }}</div>
          <div class="text-xs text-gray-500">{{ p.github_repo || '—' }}</div>
        </div>
        <UiButton @click="open(p)">Open</UiButton>
      </div>
    </div>

    <div v-if="current" class="mt-6 space-y-4">
      <h2 class="text-xl font-semibold">{{ current.name }}</h2>

      <div>
        <h3 class="font-medium mb-2">Agents</h3>
        <form @submit.prevent="addAgent" class="flex gap-2">
          <input v-model="agentName" placeholder="Agent name" class="border px-3 py-2 rounded" required />
          <input v-model="agentKind" placeholder="cloudflare-worker|python|appsscript|generic" class="border px-3 py-2 rounded" />
          <input v-model="agentModel" placeholder="model (optional)" class="border px-3 py-2 rounded" />
          <UiButton type="submit">Add</UiButton>
        </form>
        <ul class="list-disc pl-6 mt-2">
          <li v-for="a in agents" :key="a.id">{{ a.name }} ({{ a.kind || 'generic' }})</li>
        </ul>
      </div>

      <div>
        <h3 class="font-medium mb-2">Rules</h3>
        <details v-for="r in rules" :key="r.id" class="border rounded mb-2">
          <summary class="px-3 py-2">{{ r.path }} · v{{ r.version }}</summary>
          <pre class="p-3 bg-muted rounded-b-md overflow-auto text-sm">{{ r.content }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { listProjects, createProject, listAgents, createAgent, listRules } from '../lib/api';
import UiButton from '../components/ui/button/Button.vue';

const projects = ref<any[]>([]);
const name = ref(''); const repo = ref('');
const current = ref<any>(null);
const agents = ref<any[]>([]);
const rules = ref<any[]>([]);
const agentName = ref(''); const agentKind = ref(''); const agentModel = ref('');

async function refresh() { projects.value = await listProjects(); }
async function submit() {
  await createProject(name.value, repo.value || undefined);
  name.value = ''; repo.value = ''; await refresh();
}
async function open(p:any){ current.value = p; agents.value = await listAgents(p.id); rules.value = await listRules(p.id); }
async function addAgent(){
  await createAgent(current.value.id, { name: agentName.value, kind: agentKind.value, model: agentModel.value });
  agentName.value=''; agentKind.value=''; agentModel.value='';
  agents.value = await listAgents(current.value.id); rules.value = await listRules(current.value.id);
}
onMounted(refresh);
</script>
