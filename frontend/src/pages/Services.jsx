import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import { mockServicesList } from '../utils/mockData'
import { getStoredUser } from '../utils/storage'

const categoryColors = {
  Security: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Finance: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Messaging: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Data: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Infrastructure: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  AI: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
}

const categoryIcons = {
  Security: '🔐',
  Finance: '💳',
  Messaging: '📬',
  Data: '🗄️',
  Infrastructure: '⚙️',
  AI: '🤖',
}

function ServiceCard({ service, onRequest, requesting }) {
  const catStyle = categoryColors[service.category] || 'text-forge-dim bg-forge-border border-forge-border'
  const catIcon = categoryIcons[service.category] || '🔧'
  const isApproved = service.status === 'approved'
  const isPending = service.status === 'pending'

  return (
    <div className="forge-card flex flex-col gap-4 group relative overflow-hidden">
      {isApproved && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300" />
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forge-border flex items-center justify-center text-lg">
            {catIcon}
          </div>
          <div>
            <h3 className="font-display font-semibold text-forge-text text-sm">{service.name}</h3>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${catStyle}`}>
              {service.category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-forge-muted">Uptime</div>
          <div className="text-xs font-mono text-emerald-400 font-bold">{service.uptime}</div>
        </div>
      </div>

      <p className="text-sm text-forge-dim font-body leading-relaxed flex-1">{service.description}</p>

      <div className="flex items-center justify-between pt-2 border-t border-forge-border">
        <span className="text-xs font-mono text-forge-muted">{service.version}</span>
        <div className="flex items-center gap-2">
          {isApproved ? (
            <span className="status-active">Connected</span>
          ) : isPending ? (
            <span className="status-pending">Pending Review</span>
          ) : (
            <button
              onClick={() => onRequest(service.id)}
              disabled={requesting === service.id}
              className="forge-btn text-xs py-1.5 px-4"
            >
              {requesting === service.id ? (
                <span className="flex items-center gap-1.5">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                  </svg>
                  Requesting...
                </span>
              ) : 'Request Access'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const [user] = useState(() => getStoredUser())
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/services')
        setServices(res.data)
      } catch {
        setServices(mockServicesList)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const requestAccess = async (id) => {
    setRequesting(id)
    try {
      await api.post(`/services/${id}/request`)
    } catch {
      // mock
    } finally {
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: 'pending' } : s))
      )
      setRequesting(null)
    }
  }

  const categories = ['all', ...new Set(services.map((s) => s.category))]
  const filtered = filter === 'all' ? services : services.filter((s) => s.category === filter)

  const approved = services.filter((s) => s.status === 'approved').length
  const pending = services.filter((s) => s.status === 'pending').length

  return (
    <div className="flex h-screen bg-forge-bg overflow-hidden">
      <Sidebar user={user} />
      <main className="ml-60 flex-1 overflow-y-auto">
        <Navbar title="Services" subtitle="Browse and connect to platform services" />
        <div className="p-6 space-y-6 animate-fade-up">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="forge-card text-center">
              <div className="text-2xl font-display font-bold text-forge-ember">{services.length}</div>
              <div className="text-xs text-forge-muted font-mono mt-1">Available</div>
            </div>
            <div className="forge-card text-center">
              <div className="text-2xl font-display font-bold text-emerald-400">{approved}</div>
              <div className="text-xs text-forge-muted font-mono mt-1">Connected</div>
            </div>
            <div className="forge-card text-center">
              <div className="text-2xl font-display font-bold text-amber-400">{pending}</div>
              <div className="text-xs text-forge-muted font-mono mt-1">Pending</div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all capitalize border ${
                  filter === cat
                    ? 'bg-forge-ember/10 text-forge-ember border-forge-ember/30'
                    : 'border-forge-border text-forge-muted hover:border-forge-ember/20 hover:text-forge-dim'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services grid */}
          {loading ? (
            <div className="text-center py-20 text-forge-muted font-mono text-sm">Loading services...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onRequest={requestAccess}
                  requesting={requesting}
                />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-20 text-forge-muted font-mono text-sm">
                  No services in this category.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
