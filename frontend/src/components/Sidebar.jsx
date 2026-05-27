import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NavIcon = ({ d }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

export default function Sidebar({ user }) {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      to: '/api-keys',
      label: 'API Keys',
      icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
    },
    {
      to: '/services',
      label: 'Services',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    },
  ]

  if (user?.role === 'admin') {
    navItems.push({
      to: '/admin',
      label: 'Admin',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    })
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-forge-surface border-r border-forge-border flex flex-col z-20">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-forge-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-forge-ember flex items-center justify-center shadow-ember">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span className="font-display font-bold text-forge-text tracking-tight">APIForge</span>
            <div className="text-[10px] text-forge-muted font-mono tracking-widest uppercase">Platform</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="text-[10px] font-mono text-forge-muted tracking-widest uppercase px-4 pb-2">Navigation</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <NavIcon d={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-3 border-t border-forge-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-forge-ember/20 border border-forge-ember/30 flex items-center justify-center text-forge-ember font-display font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-display font-medium text-forge-text truncate">{user?.name || 'User'}</div>
            <div className="text-[10px] text-forge-muted truncate font-mono">{user?.role || 'member'}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="nav-link w-full text-red-400 hover:bg-red-500/10 hover:text-red-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
