import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../utils/api'
import { getStoredUser } from '../utils/storage'
import toast from 'react-hot-toast'

function ServiceCard({ service, onRequest, requesting, status }) {
  return (
    <div className="forge-card flex flex-col gap-4 group relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forge-border flex items-center justify-center text-lg">
            🔧
          </div>
          <div>
            <h3 className="font-display font-semibold text-forge-text text-sm">{service.name}</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-forge-dim bg-forge-border border-forge-border">
              Service ID: {service.id}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-forge-dim font-body leading-relaxed flex-1">{service.description}</p>

      <div className="space-y-3 pt-2 border-t border-forge-border">
        <div>
          <div className="text-[10px] font-mono text-forge-muted uppercase tracking-widest mb-1">Endpoint</div>
          <code className="block font-mono text-xs text-forge-ember bg-forge-bg px-3 py-2 rounded-lg border border-forge-border break-all">
            {service.endpoint}
          </code>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-mono text-forge-muted">
            {status === "approved" ? (
              <span className="text-emerald-400 font-semibold">✓ Connected</span>
            ) : status === "pending" ? (
              <span className="text-amber-400 font-semibold">🕒 Pending Approval</span>
            ) : (
              "Not connected"
            )}
          </span>
          {status === "not_requested" && (
            <button
              onClick={() => onRequest(service.id)}
              disabled={requesting === service.id}
              className="forge-btn text-xs py-1.5 px-4 disabled:opacity-50"
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
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [requesting, setRequesting] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [servicesRes, requestsRes] = await Promise.all([
          api.get('/services'),
          api.get('/service-access')
        ])
        setServices(servicesRes.data || [])
        setRequests(requestsRes.data || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load services.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getStatus = (serviceId) => {
    const req = requests.find((r) => r.serviceId === serviceId)
    if (!req) return "not_requested"
    return req.approved ? "approved" : "pending"
  }

  const requestAccess = async (id) => {
    setRequesting(id)
    try {
      const res = await api.post(`/services/${id}/request`)
      setRequests((prev) => [...prev, res.data])
      toast.success("Access requested successfully")
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request service access.')
    } finally {
      setRequesting(null)
    }
  }

  return (
    <div className="flex h-screen bg-forge-bg overflow-hidden">
      <Sidebar user={user} />
      <main className="ml-60 flex-1 overflow-y-auto">
        <Navbar title="Services" subtitle="Browse and connect to platform services" />
        <div className="p-6 space-y-6 animate-fade-up">

          <div className="forge-card border-forge-ember/20 bg-forge-ember/5 text-sm text-forge-dim">
            This page renders only the backend service shape: <span className="font-mono text-forge-ember">id</span>, <span className="font-mono text-forge-ember">name</span>, <span className="font-mono text-forge-ember">description</span>, and <span className="font-mono text-forge-ember">endpoint</span>.
          </div>

          {error && (
            <div className="forge-card border-red-500/30 bg-red-500/5 text-red-300 font-mono text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="forge-card text-center">
              <div className="text-2xl font-display font-bold text-forge-ember">{services.length}</div>
              <div className="text-xs text-forge-muted font-mono mt-1">Available Services</div>
            </div>
            <div className="forge-card text-center">
              <div className="text-2xl font-display font-bold text-emerald-400">
                {requests.filter((r) => r.approved).length}
              </div>
              <div className="text-xs text-forge-muted font-mono mt-1">Connected</div>
            </div>
            <div className="forge-card text-center">
              <div className="text-2xl font-display font-bold text-amber-400">
                {requests.filter((r) => !r.approved).length}
              </div>
              <div className="text-xs text-forge-muted font-mono mt-1">Pending Approval</div>
            </div>
          </div>

          {/* Services grid */}
          {loading ? (
            <div className="text-center py-20 text-forge-muted font-mono text-sm">Loading services...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-300 font-mono text-sm">Unable to display services.</div>
          ) : services.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No services available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onRequest={requestAccess}
                  requesting={requesting}
                  status={getStatus(service.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
