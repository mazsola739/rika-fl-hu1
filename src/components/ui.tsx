import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function Panel({
  title,
  children,
  className,
}: {
  title?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={cx(
        'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
    >
      {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
      {children}
    </section>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-accent text-white hover:bg-accent-strong',
        variant === 'secondary' &&
          'border border-accent text-link hover:bg-accent-soft dark:hover:bg-slate-800',
        variant === 'ghost' &&
          'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
        className,
      )}
      {...props}
    />
  )
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string }

export function TextField({ label, className, ...props }: TextFieldProps) {
  return (
    <label className={cx('flex flex-col gap-1 text-sm font-medium', className)}>
      {label}
      <input
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal dark:border-slate-700 dark:bg-slate-950"
        {...props}
      />
    </label>
  )
}

export function Output({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'error'
}) {
  return (
    <output
      className={cx(
        'block rounded-lg px-4 py-3 text-sm whitespace-pre-line',
        tone === 'neutral' && 'bg-accent-soft text-slate-900 dark:bg-slate-800 dark:text-slate-100',
        tone === 'error' && 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-100',
      )}
    >
      {children}
    </output>
  )
}
