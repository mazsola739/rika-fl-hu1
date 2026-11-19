import { useRef } from 'react'
import { Link, Outlet } from 'react-router'
import { PORTFOLIO_URL, REPO_URL } from '../site'
import { ContactDialog } from './ContactDialog'
import { GitHubIcon } from './icons'
import { ThemeToggle } from './ThemeToggle'

const footerLink = 'font-semibold text-link hover:underline'

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

      {/* Like the footers of my other project pages: years and stack, a line, then the links. */}
      <footer className="border-t border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-1">
          <p>2020–2026 · HTML, CSS, Sass, Bootstrap, JavaScript</p>
          <p>
            The tasks are the course’s, the solutions are mine: my noob years, before my first job.
          </p>
          <div>
            <a href={PORTFOLIO_URL} target="_blank" rel="noreferrer" className={footerLink}>
              Portfolio
            </a>
            {' · '}
            <a href={REPO_URL} target="_blank" rel="noreferrer" className={footerLink}>
              GitHub
            </a>
            {' · '}
            <ContactDialog />
          </div>
        </div>
      </footer>
    </div>
  )
}
