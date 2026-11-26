import { describe, expect, it } from 'vitest'
import { DEFAULT_BOOKS } from '../public/legacy/15-bom-books/books.js'
import {
  addBook,
  getRouteUrl,
  isComplete,
  loadBooks,
  normalizeFields,
  parseRoute,
  STORAGE_KEY,
  saveBooks,
  updateBook,
  VIEW,
} from '../public/legacy/15-bom-books/store.js'

function createStorage(initial = {}) {
  const data = new Map(Object.entries(initial))

  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
  }
}

const fields = { title: 'Raisin Days', author: 'Rika', image: 'x.png', plot: 'Sweet.' }

describe('HW15 book store', () => {
  it('starts with the three books of books.js, Rika among the authors', () => {
    expect(loadBooks(createStorage())).toEqual(DEFAULT_BOOKS)
    expect(DEFAULT_BOOKS).toHaveLength(3)
    expect(DEFAULT_BOOKS.map((book) => book.author)).toContain('Rika')
  })

  it('saves under a prefixed key and loads the saved books back', () => {
    const storage = createStorage()
    const { books } = addBook(DEFAULT_BOOKS, fields)
    expect(saveBooks(storage, books)).toBe(true)
    expect(storage.getItem(STORAGE_KEY)).not.toBeNull()
    expect(STORAGE_KEY.startsWith('rika-hw15-')).toBe(true)
    expect(loadBooks(storage)).toEqual(books)
  })

  it('falls back to the default books on broken data or blocked storage', () => {
    expect(loadBooks(createStorage({ [STORAGE_KEY]: '{oops' }))).toEqual(DEFAULT_BOOKS)
    expect(loadBooks(createStorage({ [STORAGE_KEY]: '[{"id":"1"}]' }))).toEqual(DEFAULT_BOOKS)
    expect(loadBooks(null)).toEqual(DEFAULT_BOOKS)
    expect(saveBooks(null, DEFAULT_BOOKS)).toBe(false)
  })

  it('adds a book to the end with the next id', () => {
    const { books, book } = addBook(DEFAULT_BOOKS, fields)
    expect(book).toEqual({ id: 4, ...fields })
    expect(books.at(-1)).toEqual(book)
    expect(DEFAULT_BOOKS).toHaveLength(3)
  })

  it('updates only the edited book', () => {
    const books = updateBook(DEFAULT_BOOKS, 2, fields)
    expect(books[1]).toEqual({ id: 2, ...fields })
    expect(books[0]).toBe(DEFAULT_BOOKS[0])
  })

  it('trims the form values and requires all four fields', () => {
    const normalized = normalizeFields({ ...fields, title: '  Raisin Days  ', plot: '   ' })
    expect(normalized.title).toBe('Raisin Days')
    expect(isComplete(normalized)).toBe(false)
    expect(isComplete(normalizeFields(fields))).toBe(true)
  })
})

describe('HW15 routes', () => {
  it.each([
    ['', '', { view: VIEW.list, id: null, isValid: true }],
    ['?id=2', '#preview', { view: VIEW.preview, id: 2, isValid: true }],
    ['?id=3', '#edit', { view: VIEW.edit, id: 3, isValid: true }],
    ['', '#add', { view: VIEW.add, id: null, isValid: true }],
  ])('reads %j %j', (search, hash, route) => {
    expect(parseRoute(search, hash, DEFAULT_BOOKS)).toEqual(route)
  })

  it.each([
    ['?id=9', '#preview'],
    ['?id=abc', '#edit'],
    ['?id=02', '#preview'],
    ['?id=2&x=1', '#preview'],
    ['?book=2', '#preview'],
    ['', '#preview'],
    ['?id=2', '#add'],
    ['?id=2', ''],
    ['', '#unknown'],
  ])('shows the list for the invalid URL %j %j', (search, hash) => {
    expect(parseRoute(search, hash, DEFAULT_BOOKS)).toEqual({
      view: VIEW.list,
      id: null,
      isValid: false,
    })
  })

  it('builds the URLs of the task', () => {
    expect(getRouteUrl({ view: VIEW.preview, id: 2 })).toBe('?id=2#preview')
    expect(getRouteUrl({ view: VIEW.edit, id: 2 })).toBe('?id=2#edit')
    expect(getRouteUrl({ view: VIEW.add })).toBe('#add')
    expect(getRouteUrl({ view: VIEW.list })).toBe('')
  })
})
