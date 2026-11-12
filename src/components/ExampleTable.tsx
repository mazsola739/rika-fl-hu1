export interface Example {
  /** The call as written in the task, e.g. `flipOver('hey world')`. */
  call: string
  actual: unknown
  /** Omitted when the result depends on the current date. */
  expected?: unknown
}

export function formatValue(value: unknown): string {
  if (typeof value === 'string') {
    return `'${value}'`
  }
  if (Array.isArray(value)) {
    return `[${value.map(formatValue).join(', ')}]`
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value).map(([key, item]) => `${key}: ${formatValue(item)}`)
    return `{ ${entries.join(', ')} }`
  }
  return String(value)
}

export function isPassing(example: Example) {
  return !('expected' in example) || formatValue(example.actual) === formatValue(example.expected)
}

/** Runs the examples of a task and shows the results next to the expected values. */
export function ExampleTable({ examples }: { examples: Example[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th className="px-4 py-2 font-semibold">Call</th>
            <th className="px-4 py-2 font-semibold">Result</th>
            <th className="px-4 py-2 font-semibold">Expected</th>
            <th className="px-4 py-2 font-semibold">
              <span className="sr-only">Status</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white font-mono dark:divide-slate-800 dark:bg-slate-900">
          {examples.map((example) => {
            const passing = isPassing(example)
            return (
              <tr key={example.call}>
                <td className="px-4 py-2 whitespace-nowrap">{example.call}</td>
                <td className="px-4 py-2">{formatValue(example.actual)}</td>
                <td className="px-4 py-2 text-slate-500 dark:text-slate-400">
                  {'expected' in example ? formatValue(example.expected) : '(depends on today)'}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    role="img"
                    aria-label={passing ? 'passes' : 'fails'}
                    className={passing ? 'text-emerald-600' : 'text-rose-600'}
                  >
                    {passing ? '✓' : '✗'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
