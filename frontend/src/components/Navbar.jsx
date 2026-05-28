import { useEffect, useState } from 'react'
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ title = 'Dashboard', subtitle }) {
  const [time, setTime] = useState(new Date())
  const { logout, user } = useAuth()
  const { dark, setDark } = useTheme()

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <header className="h-14 border-b border-forge-border bg-forge-surface/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h1 className="font-display font-bold text-forge-text text-base tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-forge-muted font-mono">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setDark(!dark)}
          className="text-xs font-mono text-forge-muted hover:text-forge-text transition-colors"
        >
          {dark ? 'Light' : 'Dark'}
        </button>
        <div className="text-xs font-mono text-forge-muted hidden md:block">
          {user?.email || user?.name || 'User'}
        </div>
        <div className="text-xs font-mono text-forge-muted hidden md:block">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </div>
        <button
          type="button"
          onClick={logout}
          className="text-xs font-mono text-forge-muted hover:text-red-300 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
