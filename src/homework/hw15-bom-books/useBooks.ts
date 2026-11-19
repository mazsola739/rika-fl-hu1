import { useEffect, useState } from 'react'

export interface Book {
  id: number
  title: string
  author: string
  image: string
  plot: string
}

export type BookFields = Omit<Book, 'id'>

export const STORAGE_KEY = 'fl-hu1:books'
const cover = (file: string) => `${import.meta.env.BASE_URL}hw15/${file}`

/** The cover of new books. */
export const DEFAULT_COVER = cover('book-cover.svg')

/**
 * The three books of the very first visit, with funny covers; afterwards the list lives in
 * localStorage.
 */
export const defaultBooks: Book[] = [
  {
    id: 1,
    title: 'Harry Potter',
    author: 'J. K. Rowling',
    image: cover('harry-potter.svg'),
    plot: 'Young boy realizes that he is a wizard.',
  },
  {
    id: 2,
    title: 'How to Cook',
    author: 'Robin Cook',
    image: cover('how-to-cook.svg'),
    plot: 'Writer realizes he is a cook, but he cannot cook.',
  },
  {
    id: 3,
    title: 'Life in EPAM',
    author: 'Rika',
    image: cover('life-in-epam.svg'),
    plot: 'Rika goes to EPAM =)',
  },
]

function loadBooks(): Book[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    if (Array.isArray(stored)) {
      return (stored as Book[]).map(withFunnyCover)
    }
  } catch {
    // Corrupted storage: start again from the default books.
  }
  return defaultBooks
}

/** Books saved before the funny covers: the default books get their new cover. */
function withFunnyCover(book: Book): Book {
  const original = defaultBooks.find((item) => item.id === book.id && item.title === book.title)
  return original && book.image.endsWith('hw15/book-cover.svg')
    ? { ...book, image: original.image }
    : book
}

export function useBooks() {
  const [books, setBooks] = useState(loadBooks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  }, [books])

  function saveBook(id: number | undefined, fields: BookFields): Book {
    if (id === undefined) {
      const book = { id: Math.max(0, ...books.map((item) => item.id)) + 1, ...fields }
      setBooks([...books, book])
      return book
    }
    const book = { id, ...fields }
    setBooks(books.map((item) => (item.id === id ? book : item)))
    return book
  }

  function deleteBook(id: number) {
    setBooks(books.filter((item) => item.id !== id))
  }

  return { books, saveBook, deleteBook }
}
