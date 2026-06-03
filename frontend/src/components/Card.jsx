import { motion } from 'framer-motion'

export default function Card({ children, title, value, sub, trend, icon, accent = false }) {
  const isUp = trend > 0
  const trendStr = trend !== undefined ? `${isUp ? '+' : ''}${trend}%` : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`forge-card relative overflow-hidden ${accent ? 'border-forge-ember/40 shadow-ember' : ''}`}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-forge-ember to-forge-amber" />
      )}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${accent ? 'bg-forge-ember/15 text-forge-ember' : 'bg-forge-border text-forge-dim'}`}>
          {icon}
        </div>
        {trendStr && (
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${isUp ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-red-400 bg-red-500/10 border-red-500/20'}`}>
            {trendStr}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-display font-bold text-forge-text tabular-nums">{value}</div>
        <div className="text-sm text-forge-dim font-body">{title}</div>
        {sub && <div className="text-xs text-forge-muted font-mono">{sub}</div>}
      </div>
      {children}
    </motion.div>
  )
}
