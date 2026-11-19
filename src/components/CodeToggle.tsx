import { cx } from './ui'

/** The `</> Code` button that opens or closes the code of a function, with a turning arrow. */
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
        'inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-sans font-semibold text-xs transition-colors',
        open
          ? 'border-accent bg-accent text-white'
          : 'border-link text-link hover:bg-accent-soft dark:hover:bg-slate-800',
      )}
    >
      <span aria-hidden="true" className="font-mono">
        {'</>'}
      </span>
      Code
      <span aria-hidden="true" className={cx('transition-transform', open && 'rotate-90')}>
        ▸
      </span>
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
