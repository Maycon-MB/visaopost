import { lazy, Suspense } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Approve from './pages/Approve.jsx';
import Login from './pages/Login.jsx';
import { BrandLogo } from './components/AppShell.jsx';
import { useAuth } from './auth-context.jsx';
import { DEMO } from './config.js';

const AppShell = lazy(() => import('./components/AppShell.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Clientes = lazy(() => import('./pages/Clientes.jsx'));
const Produtos = lazy(() => import('./pages/Produtos.jsx'));
const Apresentacao = lazy(() => import('./pages/Apresentacao.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));
const Aprovacoes = lazy(() => import('./pages/Aprovacoes.jsx'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'));

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}

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
    <div className="lp">
      <header className="lp-bar">
        <BrandLogo />
        <Link to="/login" className="lp-login">Entrar no painel →</Link>
      </header>

      <main className="lp-hero enter">
        <div>
          <div className="lp-kicker">Conteúdo todo dia pra sua ótica</div>
          <h1 className="lp-title">
            A presença da sua ótica,<br />
            <em>cuidada nos detalhes.</em>
          </h1>
          <p className="lp-lede">
            Posts pensados pra sua marca, aprovados num toque e publicados na hora certa.
            Marcelo aprova do celular — a gente cuida do resto.
          </p>
          <div className="lp-cta">
            <Link to="/login" className="btn-touch btn-primary-atelier">Entrar no painel</Link>
            <Link to="/aprovar/demo" className="btn-touch btn-ghost-atelier">Ver demo de aprovação</Link>
          </div>
        </div>

        <div className="lp-aside enter enter-1">
          <div className="lp-card">
            <div className="lp-quote">“Cada armação conta uma história. O conteúdo da Di Lorenzo precisa contar a mesma.”</div>
            <div className="eyebrow muted">Ótica Di Lorenzo · @oticadilorenzo</div>
          </div>
          <div className="lp-feats">
            <div className="lp-feat"><div className="n">i.</div><div className="t">Aprovar no celular</div><div className="d">Um toque, sem complicação.</div></div>
            <div className="lp-feat"><div className="n">ii.</div><div className="t">Recall WhatsApp</div><div className="d">Clientes voltam na hora.</div></div>
            <div className="lp-feat"><div className="n">iii.</div><div className="t">Catálogo no site</div><div className="d">Sua vitrine sempre viva.</div></div>
            <div className="lp-feat"><div className="n">iv.</div><div className="t">Tudo num lugar</div><div className="d">Clientes, posts e métricas.</div></div>
          </div>
        </div>
      </main>

      <footer className="lp-foot">
        <span className="ornament">✻</span> Ótica Di Lorenzo — painel do proprietário
      </footer>
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
        <Route path="/" element={DEMO ? <Navigate to="/admin" replace /> : <Landing />} />
        <Route path="/login" element={DEMO ? <Navigate to="/admin" replace /> : <Login />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />
        <Route path="/aprovar/:token" element={<Approve />} />
        <Route path="/admin" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="aprovacoes" element={<Aprovacoes />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/apresentacao" element={<ProtectedRoute><Apresentacao /></ProtectedRoute>} />
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
