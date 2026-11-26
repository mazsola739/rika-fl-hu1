/* Pure logic of the book list: storage, editing and the routes. No DOM here. */

import { DEFAULT_BOOKS } from './books.js'

export const STORAGE_KEY = 'rika-hw15-books'
const BOOK_FIELDS = ['title', 'author', 'image', 'plot']

function isBook(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    Number.isInteger(value.id) &&
    BOOK_FIELDS.every((field) => typeof value[field] === 'string')
  )
}

/** Reads the books from the storage; the default books on the first visit or broken data. */
export function loadBooks(storage) {
  try {
    const stored = JSON.parse(storage.getItem(STORAGE_KEY))
    if (Array.isArray(stored) && stored.every(isBook)) {
      return stored
    }
  } catch {
    // Broken JSON or blocked storage: start again from the default books.
  }

  return DEFAULT_BOOKS
}

/** Writes the books to the storage. Returns false when the storage is not available. */
export function saveBooks(storage, books) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(books))

    return true
  } catch {
    return false
  }
}

/** The form values without surrounding whitespace, so blank values count as empty. */
export function normalizeFields(fields) {
  return Object.fromEntries(BOOK_FIELDS.map((field) => [field, String(fields[field] ?? '').trim()]))
}

/** All four fields are required. */
export function isComplete(fields) {
  return BOOK_FIELDS.every((field) => fields[field] !== '')
}

/** Returns a new list in which the book has the new fields. */
export function updateBook(books, id, fields) {
  return books.map((book) => (book.id === id ? { id, ...fields } : book))
}

/** Returns a new list with the book added to the end, and the new book with its new id. */
export function addBook(books, fields) {
  const id = Math.max(0, ...books.map((book) => book.id)) + 1
  const book = { id, ...fields }

  return { books: [...books, book], book }
}

/* Routes: ?id={id}#preview, ?id={id}#edit, #add, or nothing for the list only. */

export const VIEW = {
  list: 'list',
  preview: 'preview',
  edit: 'edit',
  add: 'add',
}

const ID_PATTERN = /^[1-9]\d*$/

function getBookId(params, books) {
  const keys = [...params.keys()]
  const id = params.get('id')
  if (keys.length !== 1 || keys[0] !== 'id' || !ID_PATTERN.test(id)) {
    return null
  }
  const bookId = Number(id)

  return books.some((book) => book.id === bookId) ? bookId : null
}

/**
 * Reads the route from `location.search` and `location.hash`. An invalid URL (unknown hash,
 * extra or wrong query params, unknown book id) is the list with `isValid: false`.
 */
export function parseRoute(search, hash, books) {
  const params = new URLSearchParams(search)
  const hasParams = [...params.keys()].length > 0
  const list = { view: VIEW.list, id: null, isValid: true }
  const invalid = { ...list, isValid: false }

  if (hash === '') {
    return hasParams ? invalid : list
  }
  if (hash === '#add') {
    return hasParams ? invalid : { view: VIEW.add, id: null, isValid: true }
  }
  if (hash === '#preview' || hash === '#edit') {
    const id = getBookId(params, books)
    const view = hash === '#preview' ? VIEW.preview : VIEW.edit

    return id === null ? invalid : { view, id, isValid: true }
  }

  return invalid
}

/** The search and hash part of a route's URL (empty for the list). */
export function getRouteUrl({ view, id }) {
  if (view === VIEW.preview || view === VIEW.edit) {
    return `?id=${id}#${view}`
  }

  return view === VIEW.add ? '#add' : ''
}
