const BASE = import.meta.env.VITE_API_URL || '';

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
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { detail: text };
    }
  }
  if (!res.ok) {
    const err = new Error((data && data.detail) || `HTTP ${res.status}`);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

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

export function imageUrlFor(post) {
  if (!post || !post.image_url) return null;
  if (post.image_url.startsWith('http')) return post.image_url;
  return `${BASE}${post.image_url}`;
}
