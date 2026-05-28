import { useState, useEffect } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import Table from '../components/Table'
import api from '../utils/api'
import { useAuth } from "../context/AuthContext";


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-forge-card border border-forge-border rounded-lg px-4 py-3 shadow-ember">
        <p className="text-xs font-mono text-forge-muted mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-sm font-mono" style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value?.toLocaleString()}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { user: authUser } = useAuth()
  const user = authUser || {}
  const [overview, setOverview] = useState(null)
  const [daily, setDaily] = useState([])
  const [services, setServices] = useState([])
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [ov, da, sv, er] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/daily'),
          api.get('/analytics/services'),
          api.get('/analytics/errors'),
        ])
        setOverview(ov.data)
        setDaily((da.data || []).map((row) => ({
          date: row.date,
          requests: row.totalRequests ?? row.requests ?? 0,
          errors: row.totalErrors ?? row.errors ?? 0,
        })))
        setServices((sv.data || []).map((row) => ({
          name: row.serviceName ?? row.name ?? 'Unknown Service',
          requests: row.requestCount ?? row.requests ?? 0,
          uptime: row.uptime,
        })))
        setErrors((er.data || []).map((row) => ({
          service: row.serviceName ?? row.service ?? 'Unknown Service',
          errors: row.totalErrors ?? row.errors ?? 0,
          rate: row.rate ?? '—',
        })))
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const fmt = (n) => {
    if (!n && n !== 0) return '—'
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toLocaleString()
  }

  const serviceColumns = [
    { key: 'name', label: 'Service', render: (v) => <span className="text-forge-text font-medium">{v}</span> },
    { key: 'requests', label: 'Requests', render: (v) => <span className="font-mono">{typeof v === 'number' ? v.toLocaleString() : v}</span> },
    {
      key: 'uptime', label: 'Uptime', render: (v) => (
        <span className="text-emerald-400 font-mono">{v || '99.9%'}</span>
      )
    },
    {
      key: 'share', label: 'Share', render: (_v, row) => {
        const requests = row.requests || 0
        const total = services.reduce((s, r) => s + (r.requests || 0), 0)
        const pct = total ? Math.round((requests / total) * 100) : 0
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-forge-border rounded-full h-1.5 w-20">
              <div className="bg-forge-ember h-1.5 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-mono text-forge-muted">{pct}%</span>
          </div>
        )
      }
    },
  ]

  const errorColumns = [
    { key: 'service', label: 'Service', render: (v) => <span className="text-forge-text font-medium">{v}</span> },
    { key: 'errors', label: 'Errors', render: (v) => <span className="font-mono text-red-400">{typeof v === 'number' ? v.toLocaleString() : v}</span> },
    {
      key: 'rate', label: 'Error Rate', render: (v) => {
        if (!v || v === '—') {
          return <span className="font-mono text-sm text-forge-muted">—</span>
        }
        const n = parseFloat(v)
        return (
          <span className={`font-mono text-sm ${n > 5 ? 'text-red-400' : n > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {v}
          </span>
        )
      }
    },
  ]

  if (loading) {
    return (
      <div className="flex h-screen bg-forge-bg">
        <div className="fixed left-0 top-0 h-screen w-60 bg-forge-surface border-r border-forge-border" />
        <div className="ml-60 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-forge-ember border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-forge-muted font-mono text-sm">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-forge-bg">
        <div className="fixed left-0 top-0 h-screen w-60 bg-forge-surface border-r border-forge-border" />
        <div className="ml-60 flex-1 flex items-center justify-center px-6 text-center">
          <div>
            <p className="text-red-400 font-display text-lg mb-2">Failed to load dashboard</p>
            <p className="text-forge-muted font-mono text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const successRate = overview ? Math.round((overview.successRequests / overview.totalRequests) * 100) : 0

  return (
    <div className="flex h-screen bg-forge-bg overflow-hidden">
      <Sidebar user={user} />
      <main className="ml-60 flex-1 overflow-y-auto">
        <Navbar title="Dashboard" subtitle={`Welcome back, ${user.name || 'Developer'}`} />
        <div className="p-6 space-y-6 animate-fade-up">

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              title="Total Requests"
              value={fmt(overview?.totalRequests)}
              sub="All time · all services"
              trend={12}
              icon="📡"
              accent={true}
            />
            <Card
              title="Successful Requests"
              value={fmt(overview?.successRequests)}
              sub={`${successRate}% success rate`}
              trend={8}
              icon="✅"
            />
            <Card
              title="Failed Requests"
              value={fmt(overview?.failedRequests)}
              sub="Errors across all services"
              trend={-3}
              icon="⚠️"
            />
          </div>

          {/* Success rate bar */}
          <div className="forge-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-display font-medium text-forge-text">Overall Health</span>
              <span className="font-mono text-sm text-emerald-400">{successRate}% uptime</span>
            </div>
            <div className="h-2 bg-forge-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-forge-ember to-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${successRate}%` }}
              />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Daily Requests - takes 2 cols */}
            <div className="forge-card xl:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-display font-semibold text-forge-text">Daily Traffic</h3>
                  <p className="text-xs text-forge-muted font-mono mt-0.5">Requests & errors over the week</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-forge-ember inline-block" /> Requests</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 inline-block" /> Errors</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={daily}>
                  <defs>
                    <linearGradient id="gradReq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradErr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e24" />
                  <XAxis dataKey="date" tick={{ fill: '#52525b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#52525b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="requests" stroke="#f97316" strokeWidth={2} fill="url(#gradReq)" name="Requests" />
                  <Area type="monotone" dataKey="errors" stroke="#f87171" strokeWidth={2} fill="url(#gradErr)" name="Errors" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Error breakdown */}
            <div className="forge-card">
              <h3 className="font-display font-semibold text-forge-text mb-1">Error Breakdown</h3>
              <p className="text-xs text-forge-muted font-mono mb-5">By service</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={errors} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e24" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#52525b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                  <YAxis type="category" dataKey="service" tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="errors" fill="#f97316" radius={[0, 3, 3, 0]} name="Errors" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Services Table */}
          <div className="forge-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-semibold text-forge-text">Top Services</h3>
                <p className="text-xs text-forge-muted font-mono mt-0.5">Ranked by total request volume</p>
              </div>
              <span className="text-xs font-mono text-forge-muted border border-forge-border px-3 py-1 rounded-full">{services.length} services</span>
            </div>
            <Table columns={serviceColumns} data={services} emptyMessage="No service data" />
          </div>

          {/* Error Analytics Table */}
          <div className="forge-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-semibold text-forge-text">Error Analytics</h3>
                <p className="text-xs text-forge-muted font-mono mt-0.5">Failed requests per service</p>
              </div>
            </div>
            <Table columns={errorColumns} data={errors} emptyMessage="No error data" />
          </div>

        </div>
      </main>
    </div>
  )
}
