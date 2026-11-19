import { useRef } from 'react'
import { Link, Outlet } from 'react-router'
import { PORTFOLIO_URL, REPO_URL } from '../site'
import { GitHubIcon } from './icons'
import { CourseMark } from './sheet'
import { ThemeToggle } from './ThemeToggle'

const footerLink = 'inline-flex items-center gap-1.5 font-semibold hover:text-link'

export function Layout() {
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div className="flex min-h-dvh flex-col">
      {/* With hash routing an href="#main" link would open the route /main,
          so a button moves the focus instead. */}
      <button
        type="button"
        onClick={() => mainRef.current?.focus()}
        className="absolute -top-16 left-4 z-30 cursor-pointer rounded-lg bg-accent px-4 py-2 font-semibold text-white focus:top-4"
      >
        Skip to content
      </button>

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span
              aria-hidden="true"
              className="grid h-8 w-9 place-items-center rounded-lg bg-accent font-mono text-xs text-white"
            >
              {'</>'}
            </span>
            FL-HU1 homework
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Source code on GitHub"
              title="Source code on GitHub"
              className="grid size-9 place-items-center rounded-full text-lg text-slate-600 transition-colors hover:text-link dark:text-slate-300"
            >
              <GitHubIcon />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main
        id="main"
        ref={mainRef}
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 outline-none"
      >
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <CourseMark />
            <p>© 2020–2026 Rika · The tasks are EPAM’s, the solutions are mine.</p>
            <p>Made in 2020–2021, renovated in 2026.</p>
          </div>
          <p className="flex gap-4">
            <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className={footerLink}>
              Portfolio
            </a>
            <a href={REPO_URL} target="_blank" rel="noreferrer" className={footerLink}>
              <GitHubIcon />
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
