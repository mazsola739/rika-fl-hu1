import { cx } from './ui'

/** The `</>` button that opens or closes the code of a function. */
export function CodeToggleButton({
  name,
  open,
  controls,
  onToggle,
}: {
  name: string
  open: boolean
  /** Id of the code block it opens. */
  controls: string
  onToggle: () => void
}) {
  const label = `${open ? 'Hide' : 'Show'} the code of ${name}`
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={label}
      title={label}
      onClick={onToggle}
      className={cx(
        'cursor-pointer whitespace-nowrap rounded-md px-2 py-1 font-bold font-mono text-xs',
        open ? 'bg-accent text-white' : 'text-link hover:bg-accent-soft dark:hover:bg-slate-800',
      )}
    >
      {'</>'}
    </button>
  )
}

/** The source of a function, as it is in the repository. */
export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-[0.8rem] leading-relaxed text-slate-100 dark:bg-black/50">
      <code>{code}</code>
    </pre>
  )
}
