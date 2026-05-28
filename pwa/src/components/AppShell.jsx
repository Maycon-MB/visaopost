import { NavLink, Outlet, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/admin', label: 'Visão Geral', num: '01', icon: '◐', mobileLabel: 'Visão' },
  { to: '/admin/aprovacoes', label: 'Aprovações', num: '02', icon: '✓', mobileLabel: 'Aprovar' },
  { to: '/admin/clientes', label: 'Clientes', num: '03', icon: '◇', mobileLabel: 'Clientes' },
  { to: '/admin/produtos', label: 'Catálogo', num: '04', icon: '◫', mobileLabel: 'Catálogo' },
  { to: '/admin/settings', label: 'Configurações', num: '05', icon: '⚙', mobileLabel: 'Ajustes' },
];

function BrandBar() {
  return (
    <header className="brand-bar">
      <div className="brand-mark">
        <span className="brand-mark-name">VisãoPost</span>
        <span className="brand-mark-tag">— atelier digital</span>
      </div>
      <span className="eyebrow muted">Ótica Di Lorenzo</span>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="eyebrow" style={{ marginBottom: 14 }}>Painel</div>
      <nav className="sidebar-nav">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/admin'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-num">{n.num}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <hr className="hairline" style={{ margin: '28px 0 18px' }} />
      <div className="eyebrow" style={{ marginBottom: 8 }}>Plano</div>
      <div className="text-italic-serif" style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
        Piloto Automático <span className="ornament">·</span> Premium
      </div>
      <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>R$ 297 / mês</div>
    </aside>
  );
}

function BottomNav() {
  return (
    <nav className="bottom-nav shell-nav-mobile" aria-label="Navegação">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === '/admin'}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon" aria-hidden>{n.icon}</span>
          <span>{n.mobileLabel}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppShell() {
  const loc = useLocation();
  return (
    <div className="shell" key={loc.pathname}>
      <BrandBar />
      <Sidebar />
      <main className="main enter">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
