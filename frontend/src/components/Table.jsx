export default function Table({ columns, data, emptyMessage = 'No data available' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-forge-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3 px-4 text-[11px] font-mono text-forge-muted uppercase tracking-widest font-medium"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12 text-forge-muted font-mono text-xs">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-forge-border/50 hover:bg-forge-border/30 transition-colors group"
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4 text-forge-dim font-body">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
