import { lazy, Suspense } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Approve from './pages/Approve.jsx';

const AppShell = lazy(() => import('./components/AppShell.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Clientes = lazy(() => import('./pages/Clientes.jsx'));
const Produtos = lazy(() => import('./pages/Produtos.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const Aprovacoes = lazy(() => import('./pages/Aprovacoes.jsx'));

function Loading() {
  return (
    <div style={{ padding: 80, textAlign: 'center', color: 'var(--ink-mute)' }}>
      <div className="ornament" style={{ fontSize: 28, marginBottom: 12 }}>✻</div>
      <div className="eyebrow">carregando</div>
    </div>
  );
}

function Landing() {
  return (
    <div className="shell">
      <header className="brand-bar">
        <div className="brand-mark">
          <span className="brand-mark-name">VisãoPost</span>
          <span className="brand-mark-tag">— atelier digital</span>
        </div>
      </header>
      <main className="main enter" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>
          <span className="eyebrow-num">01</span> Plataforma do dono
        </div>
        <h1 className="display-1" style={{ fontSize: 'clamp(40px, 7vw, 72px)', marginBottom: 16 }}>
          O conteúdo da sua ótica,<br />
          <em className="text-italic-serif" style={{ color: 'var(--champagne)' }}>cuidado todo dia.</em>
        </h1>
        <p className="page-sub" style={{ fontSize: 17, marginBottom: 32 }}>
          Aprove no celular. Vamos cuidar do resto.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/aprovar/demo" className="btn-touch btn-primary-atelier">
            Ver demo de aprovação
          </Link>
          <Link to="/admin" className="btn-touch btn-ghost-atelier">
            Entrar no painel
          </Link>
        </div>
        <hr className="hairline" style={{ margin: '48px auto', maxWidth: 200 }} />
        <p className="muted" style={{ fontSize: 13 }}>
          <span className="ornament">✻</span> Piloto Automático — Premium R$ 297 / mês
        </p>
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div className="shell">
      <main className="main enter" style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: 64 }}>
        <div className="eyebrow-num">404</div>
        <h1 className="page-title" style={{ marginBottom: 12 }}>Página não encontrada</h1>
        <Link className="btn-touch btn-ghost-atelier" to="/">Voltar ao início</Link>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/aprovar/:token" element={<Approve />} />
        <Route path="/admin" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="aprovacoes" element={<Aprovacoes />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
