import { useState, useEffect } from 'react'
import { useAuth } from "../context/AuthContext";

export default function Navbar({ title, subtitle }) {
  const [time, setTime] = useState(new Date())
  const { logout } = useAuth()

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
        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono">LIVE</span>
        </div>
        {/* Clock */}
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
