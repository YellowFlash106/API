import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Table from '../components/Table'
import api from '../utils/api'
import { mockUsers, mockServices, mockErrors } from '../utils/mockData'
import { getStoredUser } from '../utils/storage'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-forge-card border border-forge-border rounded-lg px-4 py-3">
        <p className="text-xs font-mono text-forge-muted mb-1">{label}</p>
        <p className="text-sm font-mono text-forge-ember">{payload[0]?.value?.toLocaleString()}</p>
      </div>
    )
  }
  return null
}

export default function Admin() {
  const [user] = useState(() => getStoredUser())
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [services, setServices] = useState([])
  const [approving, setApproving] = useState(null)

  useEffect(() => {
    if (user.role !== 'admin') {
      navigate('/')
      return
    }
    const load = async () => {
      try {
        const [usersRes] = await Promise.all([api.get('/analytics/users')])
        setUsers(usersRes.data)
      } catch {
        setUsers(mockUsers)
        setServices(mockServices)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const approveService = async (id) => {
    setApproving(id)
    await new Promise((r) => setTimeout(r, 800))
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'approved' } : s)))
    setApproving(null)
  }

  const userColumns = [
    {
      key: 'name', label: 'User', render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-forge-ember/15 border border-forge-ember/25 flex items-center justify-center text-forge-ember font-bold text-xs">
            {v?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="text-forge-text font-medium text-sm">{v}</div>
            <div className="text-forge-muted text-xs font-mono">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role', label: 'Role', render: (v) => (
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${v === 'admin' ? 'text-forge-ember bg-forge-ember/10 border-forge-ember/20' : 'text-forge-muted bg-forge-border border-forge-border'}`}>
          {v}
        </span>
      )
    },
    {
      key: 'status', label: 'Status', render: (v) => (
        <span className={v === 'active' ? 'status-active' : 'status-revoked'}>{v}</span>
      )
    },
    {
      key: 'requests', label: 'Requests', render: (v) => (
        <span className="font-mono text-sm">{typeof v === 'number' ? v.toLocaleString() : v || '—'}</span>
      )
    },
    {
      key: 'joined', label: 'Joined', render: (v) => (
        <span className="text-xs font-mono text-forge-muted">{v}</span>
      )
    },
    {
      key: 'id', label: 'Actions', render: (v, row) => (
        <div className="flex gap-2">
          {row.status === 'active' ? (
            <button className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-2.5 py-1 rounded-lg font-mono transition-all">
              Suspend
            </button>
          ) : (
            <button className="text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 px-2.5 py-1 rounded-lg font-mono transition-all">
              Restore
            </button>
          )}
        </div>
      )
    },
  ]

  const usageData = users.map((u) => ({ name: u.name?.split(' ')[0] || 'User', requests: u.requests || 0 }))

  const tabs = [
    { id: 'users', label: 'Users', count: users.length },
    { id: 'services', label: 'Service Requests', count: services.filter((s) => s.status === 'pending').length },
    { id: 'usage', label: 'Usage Monitor' },
  ]

  return (
    <div className="flex h-screen bg-forge-bg overflow-hidden">
      <Sidebar user={user} />
      <main className="ml-60 flex-1 overflow-y-auto">
        <Navbar title="Admin Panel" subtitle="Platform management & monitoring" />
        <div className="p-6 space-y-6 animate-fade-up">

          {/* Admin banner */}
          <div className="forge-card border-forge-ember/30 bg-forge-ember/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-forge-ember/20 flex items-center justify-center text-forge-ember text-lg">
              🛡️
            </div>
            <div>
              <div className="font-display font-semibold text-forge-text">Administrator Access</div>
              <div className="text-xs text-forge-muted font-mono">Elevated privileges active · All actions are logged</div>
            </div>
            <div className="ml-auto flex items-center gap-6 text-center">
              <div>
                <div className="text-xl font-display font-bold text-forge-ember">{users.length}</div>
                <div className="text-xs font-mono text-forge-muted">Users</div>
              </div>
              <div>
                <div className="text-xl font-display font-bold text-amber-400">{services.filter((s) => s.status === 'pending').length}</div>
                <div className="text-xs font-mono text-forge-muted">Pending</div>
              </div>
              <div>
                <div className="text-xl font-display font-bold text-emerald-400">{users.filter((u) => u.status === 'active').length}</div>
                <div className="text-xs font-mono text-forge-muted">Active</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-forge-surface border border-forge-border p-1 rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-display font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-forge-card text-forge-ember shadow-sm'
                    : 'text-forge-muted hover:text-forge-text'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full ${tab.count > 0 ? 'bg-forge-ember/20 text-forge-ember' : 'bg-forge-border text-forge-muted'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'users' && (
            <div className="forge-card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-display font-semibold text-forge-text">All Users</h3>
                  <p className="text-xs text-forge-muted font-mono mt-0.5">Manage platform users and access</p>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-12 text-forge-muted font-mono text-sm">Loading users...</div>
              ) : (
                <Table columns={userColumns} data={users} emptyMessage="No users found" />
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-3">
              <h3 className="font-display font-semibold text-forge-text">Service Access Requests</h3>
              {services.filter((s) => s.status === 'pending').length === 0 ? (
                <div className="forge-card text-center py-12 text-forge-muted font-mono text-sm">
                  No pending service requests.
                </div>
              ) : (
                services.filter((s) => s.status === 'pending').map((s) => (
                  <div key={s.id} className="forge-card flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-forge-border flex items-center justify-center text-lg">🔧</div>
                      <div>
                        <div className="font-display font-medium text-forge-text">{s.name}</div>
                        <div className="text-xs text-forge-muted font-mono">{s.description?.slice(0, 60)}...</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="status-pending">Pending</span>
                      <button
                        onClick={() => approveService(s.id)}
                        disabled={approving === s.id}
                        className="forge-btn text-xs py-1.5 disabled:opacity-40"
                      >
                        {approving === s.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button className="forge-btn-ghost text-xs py-1.5">Deny</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="forge-card">
              <h3 className="font-display font-semibold text-forge-text mb-1">API Usage by User</h3>
              <p className="text-xs text-forge-muted font-mono mb-6">Total requests per user</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e24" />
                  <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#52525b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="requests" fill="#f97316" radius={[4, 4, 0, 0]} name="Requests" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
