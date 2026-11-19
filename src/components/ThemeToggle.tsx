import { useState } from 'react'
import { MoonIcon, SunIcon } from './icons'

type Theme = 'light' | 'dark'

/** localStorage key of the visitor's choice; index.html reads the same key before the first paint. */
export const THEME_STORAGE_KEY = 'theme'

const readTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

/** Switches between the light (default) and the dark theme and remembers the choice. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readTheme)

  const next: Theme = theme === 'dark' ? 'light' : 'dark'

  const toggle = () => {
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Private mode or blocked storage: the switch still works for this visit.
    }
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="grid size-9 cursor-pointer place-items-center rounded-full border border-slate-300 bg-white text-lg text-slate-600 transition-colors hover:border-accent hover:text-link dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
