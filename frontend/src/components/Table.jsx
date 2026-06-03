import { motion } from 'framer-motion'

export default function Table({ columns, data, emptyMessage = 'No data available' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-forge-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3 px-4 text-xs uppercase tracking-widest text-gray-500 font-semibold"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-gray-500 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <motion.tr
                key={row.id ?? i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="border-b border-forge-border/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4 text-forge-dim font-body">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
