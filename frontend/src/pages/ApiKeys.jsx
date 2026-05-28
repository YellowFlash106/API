import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import { getStoredUser } from '../utils/storage'

function KeyRow({ k, onRevoke, revoking }) {
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const masked = k.key ? `${k.key.slice(0, 10)}${'•'.repeat(12)}` : 'Hidden'

  const handleCopy = async () => {
    if (!k.key) return
    await navigator.clipboard.writeText(k.key)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
    setRevealed(false)
  }

  return (
    <tr className="border-b border-forge-border/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="py-4 px-4">
        <div className="font-medium text-forge-text text-sm">{k.name || `API Key ${k.id}`}</div>
        <div className="text-xs text-forge-muted font-mono mt-0.5">ID: {k.id}</div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs text-forge-dim bg-forge-border px-3 py-1.5 rounded-lg">
            {revealed && k.key ? k.key : masked}
          </code>
          <button
            onClick={() => k.key && setRevealed(!revealed)}
            className={`transition-colors p-1 ${k.key ? 'text-forge-muted hover:text-forge-ember' : 'text-forge-muted/50 cursor-not-allowed'}`}
            title={k.key ? (revealed ? 'Hide key' : 'Reveal key') : 'Key only available at creation'}
            disabled={!k.key}
          >
            {revealed ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
          {revealed && (
            <button
              onClick={handleCopy}
              className="text-forge-muted hover:text-forge-ember transition-colors p-1"
              title="Copy to clipboard"
            >
              {copied ? (
                <span className="text-xs text-emerald-400 font-mono">Copied</span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        <span
          className={`px-2 py-1 text-xs rounded ${
            k.status === 'active'
              ? 'bg-green-100 text-green-600'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {k.status}
        </span>
      </td>
      <td className="py-4 px-4 text-xs font-mono text-forge-muted">
        {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : '—'}
      </td>
      <td className="py-4 px-4 text-xs font-mono text-forge-muted">{k.lastUsed || '—'}</td>
      <td className="py-4 px-4 text-sm font-mono text-forge-dim">{k.requests?.toLocaleString() || '0'}</td>
      <td className="py-4 px-4">
        {k.status === 'active' && (
          <button
            onClick={() => onRevoke(k.id)}
            disabled={revoking === k.id}
            className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-all font-mono disabled:opacity-40"
          >
            {revoking === k.id ? 'Revoking...' : 'Revoke'}
          </button>
        )}
      </td>
    </tr>
  )
}

export default function ApiKeys() {
  const [user] = useState(() => getStoredUser())
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [revoking, setRevoking] = useState(null)
  const [newKeyName, setNewKeyName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [newKey, setNewKey] = useState(null)
  const [newKeyCopied, setNewKeyCopied] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const res = await api.get('/apikeys')
      setKeys(res.data)
    } catch (err) {
      setLoadError(err.response?.data?.message || 'Failed to load API keys.')
    } finally {
      setLoading(false)
    }
  }

  const generateKey = async () => {
    if (!newKeyName.trim()) return
    setGenerating(true)
    setError('')
    try {
      const res = await api.post('/apikeys', { name: newKeyName })
      setNewKey(res.data)
      setKeys((prev) => [res.data, ...prev])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate API key.')
    } finally {
      setGenerating(false)
      setNewKeyName('')
      setShowForm(false)
    }
  }

  const revokeKey = async (id) => {
    setRevoking(id)
    try {
      await api.put(`/apikeys/${id}/revoke`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to revoke API key.')
    } finally {
      setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: 'revoked' } : k)))
      setRevoking(null)
    }
  }

  const activeCount = keys.filter((k) => k.status === 'active').length

  return (
    <div className="flex h-screen bg-forge-bg overflow-hidden">
      <Sidebar user={user} />
      <main className="ml-60 flex-1 overflow-y-auto">
        <Navbar title="API Keys" subtitle="Manage your authentication credentials" />
        <motion.div
          className="p-6 space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >

          {loadError && (
            <div className="forge-card border-red-500/30 bg-red-500/5 text-red-300 font-mono text-sm">
              {loadError}
            </div>
          )}

          {error && !loadError && (
            <div className="forge-card border-red-500/30 bg-red-500/5 text-red-300 font-mono text-sm">
              {error}
            </div>
          )}

          {/* Header stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="forge-card text-center">
              <div className="text-2xl font-display font-bold text-forge-ember">{keys.length}</div>
              <div className="text-xs text-forge-muted font-mono mt-1">Total Keys</div>
            </div>
            <div className="forge-card text-center">
              <div className="text-2xl font-display font-bold text-emerald-400">{activeCount}</div>
              <div className="text-xs text-forge-muted font-mono mt-1">Active</div>
            </div>
            <div className="forge-card text-center">
              <div className="text-2xl font-display font-bold text-red-400">{keys.length - activeCount}</div>
              <div className="text-xs text-forge-muted font-mono mt-1">Revoked</div>
            </div>
          </div>

          {/* New key revealed */}
          {newKey && (
            <div className="forge-card border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-400 text-lg">✓</span>
                    <span className="font-display font-semibold text-forge-text">Key generated: {newKey.name || `API Key ${newKey.id}`}</span>
                  </div>
                  <p className="text-xs text-forge-muted font-mono mb-3">Copy this key now — it won't be shown again in full.</p>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-sm text-emerald-300 bg-forge-bg px-4 py-2 rounded-lg border border-emerald-500/20">
                      {newKey.key}
                    </code>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(newKey.key)
                        setNewKeyCopied(true)
                        setTimeout(() => setNewKeyCopied(false), 1500)
                      }}
                      className="forge-btn text-xs"
                    >
                      {newKeyCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
                <button onClick={() => setNewKey(null)} className="text-forge-muted hover:text-forge-text ml-4">✕</button>
              </div>
            </div>
          )}

          {/* Keys table */}
          <div className="forge-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-forge-text">Your API Keys</h3>
                <p className="text-xs text-forge-muted font-mono mt-0.5">Keep your keys secret. Never expose them in client-side code.</p>
              </div>
              <div className="flex items-center gap-3">
                {showForm ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="forge-input w-48 py-2 text-sm"
                      placeholder="Key name..."
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && generateKey()}
                      autoFocus
                    />
                    <button onClick={generateKey} disabled={generating || !newKeyName.trim()} className="forge-btn text-xs py-2">
                      {generating ? '...' : 'Generate'}
                    </button>
                    <button onClick={() => setShowForm(false)} className="forge-btn-ghost text-xs py-2">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setShowForm(true)} className="forge-btn flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    New API Key
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-forge-muted font-mono text-sm">Loading keys...</div>
            ) : loadError ? (
              <div className="text-center py-12 text-red-300 font-mono text-sm">Unable to display keys.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-forge-border">
                      {['Name', 'Key', 'Status', 'Created', 'Last Used', 'Requests', 'Actions'].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-xs uppercase text-gray-500 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((k) => (
                      <KeyRow key={k.id} k={k} onRevoke={revokeKey} revoking={revoking} />
                    ))}
                    {keys.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-gray-500 text-sm">
                          No API keys found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Usage tips */}
          <div className="forge-card border-forge-ember/20">
            <h4 className="font-display font-semibold text-forge-text mb-3 flex items-center gap-2">
              <span className="text-forge-ember">⚡</span> Usage
            </h4>
            <pre className="bg-forge-bg rounded-lg p-4 text-xs font-mono text-forge-dim overflow-x-auto border border-forge-border">
{`curl https://api.apiforge.dev/v1/data \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
            </pre>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
