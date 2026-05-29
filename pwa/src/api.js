const BASE = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'dl_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

// ── Mock Storage Helper ──────────────────────────────────────────────
const MOCK_STORAGE = {
  get(key, initial) {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(val);
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
};

// ── Mock Data Inicial ───────────────────────────────────────────────
const INITIAL_CLIENTS = [
  { id: "c1", name: "Mariana Souza", phone: "31998881234", email: "mariana@gmail.com", last_exam_date: "2025-04-15", status: "active", created_at: "2025-05-15T10:00:00Z", observations: "Prefere armações leves e finas. Usa lentes Zeiss Single Vision." },
  { id: "c2", name: "Carlos Eduardo Silva", phone: "31997775678", email: "carlos.edu@hotmail.com", last_exam_date: "2024-05-10", status: "active", created_at: "2025-05-10T14:30:00Z", observations: "Usa multifocal Varilux Comfort. Alérgico a níquel." },
  { id: "c3", name: "Patrícia Lima", phone: "31996669012", email: "patricia.lima@outlook.com", last_exam_date: "2025-11-20", status: "active", created_at: "2025-05-20T09:15:00Z", observations: "Comprou solar Carolina Herrera recentemente." },
  { id: "c4", name: "Fernando Rocha", phone: "31995553456", email: "fernando.rocha@gmail.com", last_exam_date: "2023-01-15", status: "active", created_at: "2025-05-12T11:00:00Z", observations: "Esportista. Usa óculos com lentes polarizadas." },
  { id: "c5", name: "Juliana Mendes", phone: "31994447890", email: null, last_exam_date: "2026-05-10", status: "opted_out", created_at: "2026-05-10T16:45:00Z", observations: "Pediu opt-out do recall." }
];

const INITIAL_SETTINGS = {
  send_hour: "06:00",
  publish_hour: "12:00",
  active_weekdays: [1, 2, 3, 4, 5, 6],
  extra_instructions: "Evitar postagens de tom agressivo, focar no requinte e na sofisticação da Di Lorenzo. Promover o design exclusivo das armações importadas.",
  whatsapp_faq: "Funcionamos de segunda a sábado das 9h às 19h.\nExames de vista às terças e quintas com Dr. André.\nAceitamos planos Unimed, Bradesco e Amil."
};

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Aurora Tortoise', category: 'Solar', price_brl: 890, image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=85', description: 'Armação clássica tartaruga com lentes polarizadas escuras.', position: 1, is_active: true },
  { id: 2, name: 'Lumen Acetato',   category: 'Grau',    price_brl: 1140, image_url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=85', description: 'Acetato transparente moderno, leve e altamente durável.', position: 2, is_active: true },
  { id: 3, name: 'Câmara Gold',     category: 'Premium', price_brl: 2380, image_url: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=600&q=85', description: 'Titânio com banho gold, design minimalista de luxo.', position: 3, is_active: true },
  { id: 4, name: 'Linho Mate',      category: 'Grau',    price_brl: 980, image_url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=85', description: 'Estilo clássico em material fosco de alta resistência.', position: 4, is_active: true },
  { id: 5, name: 'Bossa Round',     category: 'Solar',   price_brl: 1260, image_url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=85', description: 'Lentes redondas vintage para um estilo autêntico.', position: 5, is_active: true },
  { id: 6, name: 'Vesper Titânio',  category: 'Premium', price_brl: 2940, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=85', description: 'Sofisticação extrema em titânio ultra leve.', position: 6, is_active: true },
  { id: 7, name: 'Florença Cat',    category: 'Solar',   price_brl: 1080, image_url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=85', description: 'Design gatinho luxuoso para destacar sua personalidade.', position: 7, is_active: true },
  { id: 8, name: 'Sereno Slim',     category: 'Grau',    price_brl: 870, image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=85', description: 'Armação slim moderna para uso diário confortável.', position: 8, is_active: true },
];

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
  return token === 'demo' || token === 'mock_token_marcelo';
}

// ── Mock API Engine ──────────────────────────────────────────────────
function mockRequest(path, options) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;

  // 1. Auth Mock
  if (path === '/api/auth/login') {
    if (body.email === 'erro@email.com') {
      const err = new Error('E-mail ou senha incorretos.');
      err.status = 401;
      throw err;
    }
    setToken('mock_token_marcelo');
    return {
      access_token: 'mock_token_marcelo',
      token_type: 'bearer',
      user: { id: 'u1', name: 'Marcelo', email: body.email || 'marcelo@dilorenzo.com.br', business: 'Ótica Di Lorenzo', role: 'Proprietário' }
    };
  }

  if (path === '/api/auth/me') {
    return { id: 'u1', name: 'Marcelo', email: 'marcelo@dilorenzo.com.br', business: 'Ótica Di Lorenzo', role: 'Proprietário' };
  }

  if (path === '/api/auth/forgot-password') {
    return { status: 'ok', message: 'E-mail enviado com sucesso.' };
  }

  if (path === '/api/auth/reset-password') {
    return { status: 'ok' };
  }

  // 2. Settings Mock
  if (path === '/api/settings') {
    let settings = MOCK_STORAGE.get('dl_mock_settings', INITIAL_SETTINGS);
    if (method === 'PATCH') {
      settings = { ...settings, ...body };
      MOCK_STORAGE.set('dl_mock_settings', settings);
    }
    return settings;
  }

  // 3. Clientes Mock
  if (path.startsWith('/api/clients')) {
    let clients = MOCK_STORAGE.get('dl_mock_clients', INITIAL_CLIENTS);

    if (path === '/api/clients' || path.startsWith('/api/clients?')) {
      if (method === 'GET') {
        const urlParams = new URLSearchParams(path.split('?')[1] || '');
        const search = (urlParams.get('search') || '').toLowerCase();
        const status = urlParams.get('status');

        let filtered = [...clients];
        if (status && status !== 'all') {
          filtered = filtered.filter(c => {
            if (status === 'ativos') return c.status === 'active';
            if (status === 'opt_out') return c.status === 'opted_out';
            if (status === 'novos') {
              return Date.now() - new Date(c.created_at).getTime() < 7 * 24 * 60 * 60 * 1000;
            }
            if (status === 'recall') {
              const m = Math.round((Date.now() - new Date(c.last_exam_date).getTime()) / (1000 * 60 * 60 * 24 * 30));
              return c.status === 'active' && m >= 12;
            }
            return true;
          });
        }
        if (search) {
          filtered = filtered.filter(c =>
            c.name.toLowerCase().includes(search) || c.phone.includes(search.replace(/\D/g, ''))
          );
        }
        return { items: filtered };
      }

      if (method === 'POST') {
        if (clients.some(c => c.phone.replace(/\D/g, '') === body.phone.replace(/\D/g, ''))) {
          const err = new Error('Conflito');
          err.status = 409;
          throw err;
        }
        const newClient = {
          id: 'c_' + Math.random().toString(36).slice(2, 9),
          ...body,
          status: 'active',
          created_at: new Date().toISOString()
        };
        clients.push(newClient);
        MOCK_STORAGE.set('dl_mock_clients', clients);
        return newClient;
      }
    }

    const matchClient = path.match(/\/api\/clients\/([a-zA-Z0-9_-]+)/);
    if (matchClient) {
      const id = matchClient[1];
      const idx = clients.findIndex(c => c.id === id);
      if (idx === -1) {
        const err = new Error('Cliente não encontrado');
        err.status = 404;
        throw err;
      }

      if (method === 'DELETE') {
        clients.splice(idx, 1);
        MOCK_STORAGE.set('dl_mock_clients', clients);
        return { status: 'ok' };
      }

      if (method === 'PATCH') {
        clients[idx] = { ...clients[idx], ...body };
        MOCK_STORAGE.set('dl_mock_clients', clients);
        return clients[idx];
      }

      if (method === 'POST' && path.endsWith('/contacted')) {
        clients[idx].last_contacted_at = new Date().toISOString();
        MOCK_STORAGE.set('dl_mock_clients', clients);
        return clients[idx];
      }
    }
  }

  // 4. Products Mock
  if (path.startsWith('/api/products')) {
    let products = MOCK_STORAGE.get('dl_mock_products', INITIAL_PRODUCTS);

    if (path === '/api/products' || path.startsWith('/api/products?')) {
      if (method === 'GET') {
        return products;
      }

      if (method === 'POST') {
        const newProduct = {
          id: Math.max(0, ...products.map(p => p.id)) + 1,
          ...body,
          image_url: body.image_url || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=85',
          position: products.length + 1,
          is_active: true
        };
        products.push(newProduct);
        MOCK_STORAGE.set('dl_mock_products', products);
        return newProduct;
      }
    }

    const matchProd = path.match(/\/api\/products\/(\d+)/);
    if (matchProd) {
      const id = parseInt(matchProd[1], 10);
      const idx = products.findIndex(p => p.id === id);
      if (idx === -1) {
        const err = new Error('Produto não encontrado');
        err.status = 404;
        throw err;
      }

      if (method === 'DELETE') {
        products.splice(idx, 1);
        MOCK_STORAGE.set('dl_mock_products', products);
        return { status: 'ok' };
      }

      if (method === 'PATCH') {
        products[idx] = { ...products[idx], ...body };
        MOCK_STORAGE.set('dl_mock_products', products);
        return products[idx];
      }
    }
  }

  // 5. Posts Mock (tela do email)
  const matchPost = path.match(/\/api\/posts\/([a-zA-Z0-9_-]+)/);
  if (matchPost) {
    const token = matchPost[1];
    let mockPost = MOCK_STORAGE.get('dl_mock_demo_post', DEMO_POST);

    if (path.endsWith('/action') && method === 'POST') {
      const nextStatus = body.action === 'approve' ? 'approved' : body.action === 'reject' ? 'rejected' : 'draft';
      mockPost = {
        ...mockPost,
        status: nextStatus,
        approval_feedback: body.feedback || null,
        rejection_reason: body.action === 'reject' ? body.feedback : null,
        approved_at: body.action === 'approve' ? new Date().toISOString() : null,
        regenerate_count: body.action === 'regenerate' ? mockPost.regenerate_count + 1 : mockPost.regenerate_count,
      };
      MOCK_STORAGE.set('dl_mock_demo_post', mockPost);
      return { action: body.action, post: mockPost };
    }

    return mockPost;
  }

  throw new Error(`Rota mock desconhecida: ${path}`);
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const isMock = window.location.hostname.endsWith('github.io') ||
                 token === 'mock_token_marcelo' ||
                 localStorage.getItem('dl_force_demo') === '1' ||
                 (!BASE && !token);

  if (isMock) {
    await new Promise((r) => setTimeout(r, 250));
    return mockRequest(path, options);
  }

  try {
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
  } catch (fetchErr) {
    // Caso de falha (ex: backend offline). Entra em modo demo local.
    console.warn("Conexão com o backend falhou. Ativando modo Mock de demonstração.");
    localStorage.setItem('dl_force_demo', '1');
    setToken('mock_token_marcelo');
    await new Promise((r) => setTimeout(r, 250));
    return mockRequest(path, options);
  }
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
export async function login(email, password) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
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
  localStorage.removeItem('dl_force_demo');
}

// ── Aprovação de post (tela do email) ────────────────────────────────
export async function fetchPost(token) {
  if (isDemoToken(token)) {
    await new Promise((r) => setTimeout(r, 400));
    let mockPost = MOCK_STORAGE.get('dl_mock_demo_post', DEMO_POST);
    return { ...mockPost };
  }
  return request(`/api/posts/${encodeURIComponent(token)}`);
}

export async function sendAction(token, action, feedback) {
  if (isDemoToken(token)) {
    await new Promise((r) => setTimeout(r, 600));
    const nextStatus = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'draft';
    let mockPost = MOCK_STORAGE.get('dl_mock_demo_post', DEMO_POST);
    mockPost = {
      ...mockPost,
      status: nextStatus,
      approval_feedback: feedback || null,
      rejection_reason: action === 'reject' ? feedback : null,
      approved_at: action === 'approve' ? new Date().toISOString() : null,
      regenerate_count: action === 'regenerate' ? mockPost.regenerate_count + 1 : mockPost.regenerate_count,
    };
    MOCK_STORAGE.set('dl_mock_demo_post', mockPost);
    return { action, post: mockPost };
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
  const data = await request(`/api/clients${qs({ status, search, limit: 500 })}`);
  return data.items || [];
}

export async function createClient(payload) {
  return request('/api/clients', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateClient(id, patch) {
  return request(`/api/clients/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
}

export async function deleteClient(id) {
  return request(`/api/clients/${id}`, { method: 'DELETE' });
}

export async function markContacted(id) {
  return request(`/api/clients/${id}/contacted`, { method: 'POST' });
}

export async function importClientsCsv(file) {
  const isMock = window.location.hostname.endsWith('github.io') ||
                 getToken() === 'mock_token_marcelo' ||
                 localStorage.getItem('dl_force_demo') === '1';

  if (isMock) {
    await new Promise((r) => setTimeout(r, 600));
    let clients = MOCK_STORAGE.get('dl_mock_clients', INITIAL_CLIENTS);
    const newClients = [
      { id: 'c_csv1', name: 'Ana Beatriz Ramos', phone: '31991112222', email: 'anab@gmail.com', last_exam_date: '2025-08-10', status: 'active', created_at: new Date().toISOString(), observations: 'Importada via CSV.' },
      { id: 'c_csv2', name: 'Roberto Alencar', phone: '31992223333', email: 'roberto@gmail.com', last_exam_date: '2024-03-12', status: 'active', created_at: new Date().toISOString(), observations: 'Importado via CSV.' }
    ];
    let inserted = 0;
    let skipped = 0;
    newClients.forEach((nc) => {
      if (clients.some((c) => c.phone.replace(/\D/g, '') === nc.phone.replace(/\D/g, ''))) {
        skipped++;
      } else {
        clients.push(nc);
        inserted++;
      }
    });
    MOCK_STORAGE.set('dl_mock_clients', clients);
    return { inserted, skipped_duplicates: skipped, failed: [] };
  }

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

export function clientsExportUrl() {
  const isMock = window.location.hostname.endsWith('github.io') ||
                 getToken() === 'mock_token_marcelo' ||
                 localStorage.getItem('dl_force_demo') === '1';

  if (isMock) {
    return 'javascript:alert("CSV exportado com sucesso no modo demonstração!")';
  }
  return `${BASE}/api/clients/export.csv?token=${getToken() || ''}`;
}

// ── Settings ─────────────────────────────────────────────────────────
export async function fetchSettings() {
  return request('/api/settings');
}

export async function updateSettings(patch) {
  return request('/api/settings', { method: 'PATCH', body: JSON.stringify(patch) });
}

// ── Products/Catálogo ────────────────────────────────────────────────
export async function listProducts() {
  return request('/api/products');
}

export async function createProduct(payload) {
  return request('/api/products', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateProduct(id, patch) {
  return request(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
}

export async function deleteProduct(id) {
  return request(`/api/products/${id}`, { method: 'DELETE' });
}

export function imageUrlFor(post) {
  if (!post || !post.image_url) return null;
  if (post.image_url.startsWith('http')) return post.image_url;
  return `${BASE}${post.image_url}`;
}
