import { Link, Outlet } from 'react-router'

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="grid size-8 place-items-center rounded-lg bg-accent text-sm text-white">
              FL
            </span>
            FL-HU1 homework
          </Link>
          <a
            href="https://github.com/mazsola739/rika-fl-hu1"
            className="text-sm font-medium text-slate-600 hover:text-accent dark:text-slate-300"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        EPAM Front-end Lab, 2020–2021 · rebuilt with Bun, Vite, React and TypeScript
      </footer>
    </div>
  )
}
