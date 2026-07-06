// @ts-nocheck
import { DEMO } from './config';

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

// ── Instagram (Facebook Login for Business) ───────────────────────────────────
export async function fetchInstagramStatus() {
  if (DEMO) return { connected: false, page_name: null, expires_at: null, days_until_expiry: null };
  return request('/auth/facebook/status');
}

export async function connectInstagram() {
  if (DEMO) return { authorize_url: '#' };
  return request('/auth/facebook/connect');
}

export async function fetchInstagramPageOptions(selectionToken) {
  if (DEMO) return [];
  return request(`/auth/facebook/select-options?selection_token=${encodeURIComponent(selectionToken)}`);
}

export async function selectInstagramPage(selectionToken, pageId) {
  if (DEMO) return { connected: true, page_name: 'Ótica Di Lorenzo (demo)' };
  return request('/auth/facebook/select', {
    method: 'POST',
    body: JSON.stringify({ selection_token: selectionToken, page_id: pageId }),
  });
}

export async function testInstagramPost() {
  if (DEMO) return { status: 'ok', media_id: 'demo', permalink: '#' };
  return request('/auth/facebook/test-post', { method: 'POST' });
}

// ── Produtos (catálogo) ───────────────────────────────────────────────────────
const DEMO_PRODUCTS = [
  { id: 'd1', tenant_id: 'demo', name: 'Aurora Tortoise', category: 'Solar', description: 'Armação de acetato italiano premium.', price_brl: 890, image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=85', tags: [], features: ['Proteção UV 400', 'Polarizado', 'Leve e resistente'], position: 0, is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'd2', tenant_id: 'demo', name: 'Lumen Acetato', category: 'Grau', description: 'Armação clássica em acetato alemão.', price_brl: 1140, image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=85', tags: [], features: ['Titanium ultralight', 'Dobradiças flexíveis', 'Hipoalergênico'], position: 1, is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'd3', tenant_id: 'demo', name: 'Câmara Gold', category: 'Premium', description: 'Coleção premium com acabamento dourado.', price_brl: 2380, image_url: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=600&q=85', tags: [], features: ['Edição limitada', 'Banho a ouro 24k', 'Estojo premium incluso'], position: 2, is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'd4', tenant_id: 'demo', name: 'Vesper Titânio', category: 'Premium', description: 'Ultra-leve em titânio aeroespacial.', price_brl: 2940, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=85', tags: [], features: ['Titânio grau aeroespacial', '15g de peso total', 'Memória de forma'], position: 3, is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'd5', tenant_id: 'demo', name: 'Haytek Go!', category: 'Lentes', description: 'Entrada de linha progressiva Freeform.', price_brl: null, image_url: null, tags: [], features: ['Conforto e Nitidez', 'Preço Acessível', 'Fácil Adaptação'], position: 4, is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'd6', tenant_id: 'demo', name: 'Haytek Smart', category: 'Lentes', description: 'Distribuição balanceada Freeform.', price_brl: null, image_url: null, tags: [], features: ['Distribuição Balanceada', 'Melhor Custo-Benefício', 'Menor Distorção Periférica', 'Efeito de Flutuação Reduzido'], position: 5, is_active: true, created_at: '2025-01-01T00:00:00Z' },
  { id: 'd7', tenant_id: 'demo', name: 'Haytek Pro ID', category: 'Lentes', description: 'Tecnologia de ponta com personalização máxima.', price_brl: null, image_url: null, tags: [], features: ['Tecnologia de Ponta', 'Máxima Personalização', 'Foco em Todas as Direções', 'Visão Clara e Precisa', 'Qualidade Inigualável'], position: 6, is_active: true, created_at: '2025-01-01T00:00:00Z' },
];

export async function listProducts({ includeInactive = false } = {}) {
  if (DEMO) { await new Promise((r) => setTimeout(r, 200)); return DEMO_PRODUCTS; }
  return request(`/api/products${qs({ include_inactive: includeInactive || undefined })}`);
}

export async function createProduct(payload) {
  if (DEMO) return { id: 'demo-' + Date.now(), tenant_id: 'demo', ...payload, image_url: null, created_at: new Date().toISOString() };
  return request('/api/products', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateProduct(id, patch) {
  if (DEMO) return { id, ...patch };
  return request(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
}

export async function deleteProduct(id) {
  if (DEMO) return {};
  return request(`/api/products/${id}`, { method: 'DELETE' });
}

export async function uploadProductImage(productId, file) {
  if (DEMO) return null;
  const form = new FormData();
  form.append('file', file);
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}/api/products/${productId}/image`, { method: 'POST', body: form, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) { const err = new Error((data && data.detail) || `HTTP ${res.status}`); err.status = res.status; throw err; }
  return data;
}

export async function fetchMonthlyReport(year, month) {
  if (DEMO) return null;
  return request(`/api/reports/monthly?year=${year}&month=${month}`);
}

export async function generateReportInsights(year, month) {
  if (DEMO) return null;
  return request(`/api/reports/monthly/${year}/${month}/insights`, { method: 'POST' });
}

export async function generateReel(payload) {
  if (DEMO) return null;
  return request('/api/reels/generate', { method: 'POST', body: JSON.stringify(payload) });
}

export async function listReels() {
  if (DEMO) return [];
  return request('/api/reels');
}

export async function deleteReel(id) {
  if (DEMO) return;
  return request(`/api/reels/${id}`, { method: 'DELETE' });
}

export function imageUrlFor(post) {
  if (!post || !post.image_url) return null;
  if (post.image_url.startsWith('http')) return post.image_url;
  return `${BASE}${post.image_url}`;
}
