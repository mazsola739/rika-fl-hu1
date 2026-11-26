// Prefixed, so the counts do not clash with the other homework on the same origin.
export const STORAGE_KEY = 'rika-hw11-visits'
const PAGES = ['Page1', 'Page2', 'Page3']

/** The stored counts, or an empty object when there are none or they are unreadable. */
export function readVisits(storage = localStorage) {
  try {
    const visits = JSON.parse(storage.getItem(STORAGE_KEY))

    return visits !== null && typeof visits === 'object' ? visits : {}
  } catch {
    return {}
  }
}

/** Saves one more visit of the page. */
export function visitLink(page, storage = localStorage) {
  const visits = readVisits(storage)
  visits[page] = (visits[page] ?? 0) + 1
  storage.setItem(STORAGE_KEY, JSON.stringify(visits))
}

/** The result lines of every page, then the counts are cleared (only this homework's key). */
export function viewResults(storage = localStorage) {
  const visits = readVisits(storage)
  storage.removeItem(STORAGE_KEY)

  return PAGES.map((page) => `You visited ${page}: ${visits[page] ?? 0} time(s)`)
}
