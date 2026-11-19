import type { ReactNode } from 'react'
import { cx } from './ui'

/*
 * The look of the course's task sheets: a white page, a big title, a coral "DEADLINE:" line under
 * it, a thin rule, cyan uppercase section headings and the gray </> Frontend Lab mark at the end.
 */

/** A white page, like one of the task sheets. */
export function Sheet({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        'rounded-md border border-slate-200 bg-white px-5 py-8 shadow-sm sm:px-10 sm:py-12 dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** The big title of a sheet, with a small mono line above it (the folder name of the homework). */
export function SheetTitle({ overline, children }: { overline: ReactNode; children: ReactNode }) {
  return (
    <header>
      <p className="font-mono text-sm text-slate-500 dark:text-slate-400">{overline}</p>
      <h1 className="mt-1 text-4xl leading-tight font-bold text-sheet-title sm:text-5xl">
        {children}
      </h1>
    </header>
  )
}

/** The coral "DEADLINE:" line under the title, and the thin rule under it. */
export function Deadline({
  label = 'DEADLINE:',
  children,
}: {
  label?: string
  children: ReactNode
}) {
  return (
    <>
      <p className="mt-4 text-[0.95rem]">
        <span className="font-bold text-deadline">{label}</span> {children}
      </p>
      <hr className="mt-3 border-slate-200 dark:border-slate-800" />
    </>
  )
}

/** A section with a cyan uppercase heading, like TASK or RESTRICTIONS on the sheets. */
export function SheetSection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cx('mt-10', className)}>
      <h2 className="mb-4 text-xl font-bold tracking-wide text-sheet-heading uppercase">{title}</h2>
      {children}
    </section>
  )
}

/** The gray mark at the bottom of every task sheet. */
export function CourseMark({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2 text-sheet-mark', className)}>
      <span
        aria-hidden="true"
        className="grid h-7 w-8 place-items-center rounded-lg border-2 border-current font-mono text-xs font-bold"
      >
        {'</>'}
      </span>
      <span className="font-bold">Frontend Lab</span>
    </span>
  )
}
