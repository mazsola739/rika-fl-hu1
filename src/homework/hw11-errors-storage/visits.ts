export const STORAGE_KEY = 'fl-hu1:page-visits'
export const PAGES = ['Page1', 'Page2', 'Page3'] as const

export type PageName = (typeof PAGES)[number]
export type Visits = Partial<Record<PageName, number>>

export function readVisits(): Visits {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Visits
  } catch {
    return {}
  }
}

/** Counts a click on a page link. */
export function visitLink(page: PageName) {
  const visits = readVisits()
  visits[page] = (visits[page] ?? 0) + 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visits))
}

/** Returns the result lines and clears the stored counts (only this homework's key). */
export function viewResults() {
  const visits = readVisits()
  localStorage.removeItem(STORAGE_KEY)
  return PAGES.map((page) => `You visited ${page} ${visits[page] ?? 0} time(s)`)
}
