import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: '◈' },
    { to: '/admin/checklists', label: 'Checklists', icon: '☑' },
    { to: '/admin/responses', label: 'Respostas', icon: '📋' },
  ];

  const lojaLinks = [
    { to: '/loja', label: 'Meus Checklists', icon: '✏️' },
  ];

  const links = user?.role === 'admin' ? adminLinks : lojaLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>🌿 Boticario</h1>
        <p>Sistema de Checklist</p>
      </div>

      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/admin' || l.to === '/loja'}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <strong>{user?.name}</strong>
          <p>{user?.role === 'admin' ? 'Administrador' : 'Loja'}</p>
        </div>
        <button onClick={handleLogout}>Sair da conta</button>
      </div>
    </aside>
  );
}
