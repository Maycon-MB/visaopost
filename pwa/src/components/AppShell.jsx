import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth-context.jsx';

const NAV = [
  { to: '/admin', label: 'Visão Geral', icon: '◐' },
  { to: '/admin/aprovacoes', label: 'Aprovações', icon: '✓' },
  { to: '/admin/clientes', label: 'Clientes', icon: '◇' },
  { to: '/admin/produtos', label: 'Catálogo', icon: '◫' },
  { to: '/admin/settings', label: 'Configurações', icon: '⚙' },
];

const ROLE_LABEL = { owner: 'Proprietário', staff: 'Equipe' };

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
