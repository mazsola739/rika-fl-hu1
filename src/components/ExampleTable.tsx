import { useId, useState } from 'react'
import { CodeBlock, CodeToggleButton } from './CodeToggle'
import { calledFunction, functionSource } from './sourceCode'

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

/**
 * Runs the examples of a task and shows the results next to the expected values. With the source
 * of the module (imported with `?raw`), every row can also open the code of its function.
 */
export function ExampleTable({ examples, source }: { examples: Example[]; source?: string }) {
  return (
    <div>
      {source && (
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
          Every example runs live. Open <b>Code</b> on a row to see the function behind it.
        </p>
      )}
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
              {source && <th className="px-4 py-2 font-semibold">Code</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white font-mono dark:divide-slate-800 dark:bg-slate-900">
            {examples.map((example) => (
              <ExampleRow key={example.call} example={example} source={source} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ExampleRow({ example, source }: { example: Example; source?: string }) {
  const [open, setOpen] = useState(false)
  const codeId = useId()
  const passing = isPassing(example)
  const name = calledFunction(example.call)
  const code = source && name ? functionSource(source, name) : undefined

  return (
    <>
      <tr>
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
        {source && (
          <td className="px-2 py-1 text-right">
            {code && name && (
              <CodeToggleButton
                name={name}
                open={open}
                controls={codeId}
                onToggle={() => setOpen(!open)}
              />
            )}
          </td>
        )}
      </tr>
      {open && code && (
        <tr id={codeId}>
          <td colSpan={5} className="bg-slate-50 px-4 py-3 dark:bg-slate-950/60">
            <CodeBlock code={code} />
          </td>
        </tr>
      )}
    </>
  )
}
