import { DEMO } from './config.js';

const BASE = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'dl_token';

// Carteira fictícia pro modo demonstração (sem backend).
const DEMO_CLIENTS = [
  { id: 'd1', name: 'Margareth Alencar', phone: '31998765432', email: null, last_exam_date: '2024-02-12', status: 'active', created_at: '2024-02-12T12:00:00Z' },
  { id: 'd2', name: 'João Pedro Vasconcelos', phone: '31991234567', email: 'joao@email.com', last_exam_date: '2025-11-03', status: 'active', created_at: '2025-11-03T12:00:00Z' },
  { id: 'd3', name: 'Luiza Mendonça', phone: '31981231122', email: null, last_exam_date: '2023-09-22', status: 'active', created_at: '2023-09-22T12:00:00Z' },
  { id: 'd4', name: 'Renato Cardoso', phone: '31998007777', email: null, last_exam_date: '2024-01-08', status: 'active', created_at: '2024-01-08T12:00:00Z' },
  { id: 'd5', name: 'Beatriz Mello', phone: '31995001234', email: null, last_exam_date: '2025-12-01', status: 'opted_out', created_at: '2025-12-01T12:00:00Z' },
  { id: 'd6', name: 'Antônio Faria', phone: '31987003322', email: null, last_exam_date: null, status: 'converted', created_at: new Date().toISOString() },
];

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

const DEMO_POST = {
  post_id: '00000000-0000-0000-0000-000000000001',
  tenant_id: '00000000-0000-0000-0000-000000000aaa',
  tenant_slug: 'dilorenzo',
  tenant_business_name: 'Ótica Di Lorenzo',
  scheduled_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
  status: 'pending_approval',
  image_url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1080&q=85',
  caption:
    'Já reparou que cada formato de rosto pede uma armação diferente? ✨\n\n' +
    'Na Di Lorenzo, a gente avalia seu estilo, sua rotina e o que combina com você antes de mostrar opções. ' +
    'Isso é o que separa um óculos bonito de um óculos que parece feito sob medida.\n\n' +
    'Vem fazer um teste com a gente — sem compromisso, café por nossa conta. ☕',
  hashtags: ['oticadilorenzo', 'oculosdesol', 'oculosdegrau', 'estilopessoal', 'belohorizonte'],
  cta: 'Agende seu horário pelo WhatsApp e venha experimentar.',
  theme: 'dica_estilo',
  mood: 'sofisticado',
  holiday_name: null,
  approval_feedback: null,
  regenerate_count: 0,
  approved_at: null,
  rejection_reason: null,
};

function isDemoToken(token) {
  return token === 'demo';
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = { detail: text }; }
  }
  if (!res.ok) {
    const err = new Error((data && data.detail) || `HTTP ${res.status}`);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

function qs(params = {}) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}

// ── Auth ─────────────────────────────────────────────────────────────
export async function login(identifier, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
  setToken(data.access_token);
  return data.user;
}

export async function fetchMe() {
  return request('/api/auth/me');
}

export async function forgotPassword(email) {
  return request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function resetPassword(token, password) {
  return request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
}

export function logout() {
  setToken(null);
}

// ── Aprovação de post (tela do email) ────────────────────────────────
export async function fetchPost(token) {
  if (isDemoToken(token)) {
    await new Promise((r) => setTimeout(r, 400));
    return { ...DEMO_POST };
  }
  return request(`/api/posts/${encodeURIComponent(token)}`);
}

export async function sendAction(token, action, feedback) {
  if (isDemoToken(token)) {
    await new Promise((r) => setTimeout(r, 600));
    const nextStatus =
      action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'draft';
    return {
      action,
      post: {
        ...DEMO_POST,
        status: nextStatus,
        approval_feedback: feedback || null,
        rejection_reason: action === 'reject' ? feedback : null,
        approved_at: action === 'approve' ? new Date().toISOString() : null,
        regenerate_count: action === 'regenerate' ? DEMO_POST.regenerate_count + 1 : DEMO_POST.regenerate_count,
      },
    };
  }
  const body = { action };
  if (feedback) body.feedback = feedback;
  return request(`/api/posts/${encodeURIComponent(token)}/action`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// ── Clientes (tenant vem do token de sessão) ─────────────────────────
export async function listClients({ status = 'all', search } = {}) {
  if (DEMO) {
    await new Promise((r) => setTimeout(r, 250));
    return DEMO_CLIENTS;
  }
  const data = await request(`/api/clients${qs({ status, search, limit: 500 })}`);
  return data.items || [];
}

export async function createClient(payload) {
  if (DEMO) return { id: 'demo', ...payload };
  return request('/api/clients', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateClient(id, patch) {
  if (DEMO) return { id, ...patch };
  return request(`/api/clients/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
}

export async function deleteClient(id) {
  if (DEMO) return {};
  return request(`/api/clients/${id}`, { method: 'DELETE' });
}

export async function markContacted(id) {
  if (DEMO) return { id };
  return request(`/api/clients/${id}/contacted`, { method: 'POST' });
}

export async function importClientsCsv(file) {
  if (DEMO) return { inserted: 0, skipped_duplicates: 0, failed: [] };
  const form = new FormData();
  form.append('file', file);
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}/api/clients/import`, { method: 'POST', body: form, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error((data && data.detail) || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function downloadClientsCsv() {
  if (DEMO) return;
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}/api/clients/export.csv`, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'clientes.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ── Settings (tenant + perfil) ────────────────────────────────────────
export async function fetchSettings() {
  if (DEMO) return {
    send_hour: 6, publish_hour: 12,
    active_weekdays: [1, 2, 3, 4, 5, 6],
    extra_instructions: null,
    whatsapp_faq: 'Garantia de 12 meses na armação. Entrega de óculos em até 7 dias úteis.',
    owner_email: 'marcelo@oticadilorenzo.com.br',
    timezone: 'America/Sao_Paulo',
  };
  return request('/api/settings');
}

export async function updateSettings(patch) {
  if (DEMO) return patch;
  return request('/api/settings', { method: 'PATCH', body: JSON.stringify(patch) });
}

export async function updateProfile(patch) {
  if (DEMO) return patch;
  return request('/api/auth/me', { method: 'PATCH', body: JSON.stringify(patch) });
}

export function imageUrlFor(post) {
  if (!post || !post.image_url) return null;
  if (post.image_url.startsWith('http')) return post.image_url;
  return `${BASE}${post.image_url}`;
}
