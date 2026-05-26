import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { writeJsonStorage } from '../utils/storage'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.removeItem('demo_mode')
      const sessionUser = res.data.user ?? {
        name: form.email.split('@')[0] || 'Developer',
        email: form.email,
        role: 'user',
      }
      writeJsonStorage('user', sessionUser)
      navigate('/')
    } catch (err) {
      // Demo mode: fake login
      if (err.code === 'ERR_NETWORK' || err.response?.status >= 500) {
        const mockUser = { name: 'Demo User', email: form.email, role: 'admin' }
        localStorage.setItem('token', 'mock_token_demo')
        localStorage.setItem('demo_mode', 'true')
        writeJsonStorage('user', mockUser)
        navigate('/')
      } else {
        setError(err.response?.data?.message || 'Invalid credentials. Try demo mode.')
      }
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = () => {
    const mockUser = { name: 'Admin Demo', email: 'admin@apiforge.dev', role: 'admin' }
    localStorage.setItem('token', 'mock_token_demo')
    localStorage.setItem('demo_mode', 'true')
    writeJsonStorage('user', mockUser)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-forge-bg grid-bg flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-forge-ember/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-up relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-forge-ember flex items-center justify-center shadow-ember-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-display font-bold text-2xl text-forge-text">APIForge</span>
          </div>
          <h2 className="font-display font-semibold text-xl text-forge-text">Welcome back</h2>
          <p className="text-forge-muted text-sm mt-1 font-body">Sign in to your developer account</p>
        </div>

        <div className="forge-card border-forge-border/80">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm font-mono">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-forge-muted uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                className="forge-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-forge-muted uppercase tracking-widest mb-2">Password</label>
              <input
                type="password"
                className="forge-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="forge-btn w-full text-center mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                  </svg>
                  Authenticating...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-forge-border">
            <button onClick={demoLogin} className="forge-btn-ghost w-full text-center text-forge-ember border-forge-ember/30 hover:bg-forge-ember/5">
              ⚡ Enter Demo Mode
            </button>
          </div>

          <p className="text-center text-forge-muted text-sm mt-4 font-body">
            No account?{' '}
            <Link to="/register" className="text-forge-ember hover:text-forge-glow transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
