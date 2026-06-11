import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-context.jsx';

function NavIcon({ paths, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden {...props}>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const NAV = [
  {
    to: '/admin', label: 'Visão Geral',
    icon: <NavIcon paths={['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 17.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0']} />,
  },
  {
    to: '/admin/aprovacoes', label: 'Aprovações',
    icon: <NavIcon paths={['M9 11l3 3 8-8', 'M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9']} />,
  },
  {
    to: '/admin/clientes', label: 'Clientes',
    icon: <NavIcon paths={['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75']} />,
  },
  {
    to: '/admin/produtos', label: 'Catálogo',
    icon: <NavIcon paths={['M2 6h4l3 9h10l3-9H6', 'M8.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3', 'M18.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3']} />,
  },
  {
    to: '/admin/relatorio', label: 'Relatório',
    icon: <NavIcon paths={['M18 20V10', 'M12 20V4', 'M6 20v-6']} />,
  },
  {
    to: '/admin/reels', label: 'Reels',
    icon: <NavIcon paths={['M15 10l4.553-2.069A1 1 0 0 1 21 8.869V15.13a1 1 0 0 1-1.447.9L15 14', 'M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z']} />,
  },
  {
    to: '/admin/settings', label: 'Configurações',
    icon: <NavIcon paths={['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1']} />,
  },
];

const ROLE_LABEL = { owner: 'Proprietário', staff: 'Equipe' };

const GALLERY_URL  = import.meta.env.VITE_GALLERY_URL  ?? 'http://localhost:4321/galeria/';
const CATALOG_URL  = import.meta.env.VITE_CATALOG_URL  ?? 'http://localhost:4321/catalogo/';
const QR_PRINT_URL = import.meta.env.VITE_QR_PRINT_URL ?? 'http://localhost:8000/recall/qr/dilorenzo/print';

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ width: 16, height: 16 }}>
      <path d="M15 17l5-5-5-5" /><path d="M20 12H9" /><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

export function BrandLogo({ onDark = false }) {
  return (
    <span className={`brand-logo ${onDark ? 'on-dark' : ''}`}>
      <span className={`brand-seal ${onDark ? 'on-dark' : ''}`}>DL</span>
      <span className="brand-words">
        <span className="name">Di <em>Lorenzo</em></span>
        <span className="kicker">@oticadilorenzo</span>
      </span>
    </span>
  );
}

function Sidebar({ open, collapsed, onClose, onLogout, onToggleCollapse, owner }) {
  const initial = (owner.name || '?').trim().charAt(0).toUpperCase();
  return (
    <aside className={`sidebar-v2 ${open ? 'open' : ''}`}>
      <div className="sidebar-head">
        <BrandLogo onDark />
        <button className="sidebar-collapse" onClick={onToggleCollapse} aria-label={collapsed ? 'Expandir menu' : 'Retrair menu'} title={collapsed ? 'Expandir menu' : 'Retrair menu'}>
          <Chevron />
        </button>
      </div>

      <div className="sidebar-eyebrow">Menu</div>
      <nav className="sidebar-nav-v2">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/admin'}
            onClick={onClose}
            title={n.label}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-ic" aria-hidden>{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <a href="../dilorenzo/" className="sidebar-landing" title="Ver landing page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="logout-text">Landing page</span>
        </a>
        <a href={GALLERY_URL} target="_blank" rel="noopener noreferrer" className="sidebar-landing" title="Ver galeria pública">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden>
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span className="logout-text">Galeria pública</span>
        </a>
        <a href={CATALOG_URL} target="_blank" rel="noopener noreferrer" className="sidebar-landing" title="Ver catálogo público">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span className="logout-text">Catálogo público</span>
        </a>
        <a href={QR_PRINT_URL} target="_blank" rel="noopener noreferrer" className="sidebar-landing" title="Imprimir QR Code do balcão">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden>
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="17" y="17" width="4" height="4"/><path d="M14 14h3v3"/><path d="M14 17h.01"/>
          </svg>
          <span className="logout-text">QR Code balcão</span>
        </a>
        <div className="user-card">
          <span className="user-avatar">{initial}</span>
          <span className="user-meta">
            <div className="u-name">{owner.name}</div>
            <div className="u-role">{owner.role} · {owner.business}</div>
          </span>
        </div>
        <button className="sidebar-logout" onClick={onLogout} title="Sair">
          <LogoutIcon /> <span className="logout-text">Sair com segurança</span>
        </button>
      </div>
    </aside>
  );
}

export default function AppShell() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('dl_sidebar_collapsed') === '1');

  const owner = {
    name: user?.name || 'Conta',
    role: ROLE_LABEL[user?.role] || 'Acesso',
    business: 'Ótica Di Lorenzo',
  };

  // Fecha o drawer ao trocar de rota.
  useEffect(() => { setDrawer(false); }, [loc.pathname]);

  // Trava scroll do body com drawer aberto (mobile).
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawer]);

  const toggleCollapse = () => {
    setCollapsed((c) => {
      localStorage.setItem('dl_sidebar_collapsed', c ? '0' : '1');
      return !c;
    });
  };

  const onLogout = () => { signOut(); navigate('/login', { replace: true }); };

  return (
    <div className={`app-frame ${collapsed ? 'collapsed' : ''}`}>
      <header className="topbar">
        <button className="hamburger" aria-label="Abrir menu" aria-expanded={drawer} onClick={() => setDrawer(true)}>
          <span /><span /><span />
        </button>
        <BrandLogo />
      </header>

      {drawer && <div className="drawer-overlay" onClick={() => setDrawer(false)} />}
      <Sidebar
        open={drawer}
        collapsed={collapsed}
        onClose={() => setDrawer(false)}
        onLogout={onLogout}
        onToggleCollapse={toggleCollapse}
        owner={owner}
      />

      <main className="app-main enter" key={loc.pathname}>
        <Outlet />
      </main>
    </div>
  );
}
