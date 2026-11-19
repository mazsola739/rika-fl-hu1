import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from 'react-router'
import { Dialog } from '../../components/Dialog'
import { cx } from '../../components/ui'
import { type Book, type BookFields, DEFAULT_COVER, useBooks } from './useBooks'

const BASE = '/hw/15-bom-books'
const ALERT_DELAY_MS = 200

const FIELDS = [
  { name: 'title', label: 'Book name' },
  { name: 'author', label: 'Author' },
  { name: 'image', label: 'Image URL' },
  { name: 'plot', label: 'Plot', multiline: true },
] as const satisfies readonly { name: keyof BookFields; label: string; multiline?: boolean }[]

const bookPath = (id: number) => `${BASE}/books/${id}`

// The burgundy buttons of the quiz (homework 08).
const primaryButton =
  'inline-flex cursor-pointer rounded-lg bg-[#b22746] px-4 py-2 font-semibold text-sm text-white hover:bg-[#8e244d]'
const secondaryButton =
  'inline-flex cursor-pointer rounded-lg border border-slate-400 px-4 py-2 font-semibold text-slate-700 text-sm hover:bg-slate-100'
const dangerButton =
  'inline-flex cursor-pointer rounded-lg border border-[#b22746] px-4 py-2 font-semibold text-[#b22746] text-sm hover:bg-[#b22746] hover:text-white'

// Routes: index → list only, books/new → add, books/:id → preview, books/:id/edit → edit.
// Anything else (unknown id, unknown path) falls back to the list.
export default function Books() {
  const { books, saveBook, deleteBook } = useBooks()
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  // The success messages come a moment after the change, as the task asks.
  function showMessage(text: string) {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(text), ALERT_DELAY_MS)
  }

  function handleSave(id: number | undefined, fields: BookFields) {
    const book = saveBook(id, fields)
    showMessage(id === undefined ? 'Book successfully added' : 'Book successfully updated')
    return book
  }

  function handleDelete(id: number) {
    deleteBook(id)
    showMessage('Book successfully deleted')
  }

  return (
    // Like the quiz of homework 08: a frame in the EPAM colors around a white app window,
    // which stays light in the dark theme too.
    <div className="rounded-3xl bg-linear-to-br from-[#39c2d7] to-[#a3c644] p-3 sm:p-6">
      <div className="grid items-start gap-6 rounded-2xl bg-white p-4 text-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.35)] sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <BookList books={books} />

        <section className="min-h-72 md:border-l md:border-slate-200 md:pl-6">
          <Routes>
            <Route
              index
              element={
                <p className="pt-1 text-slate-500 italic">Select a book to see the details.</p>
              }
            />
            <Route path="books/new" element={<BookForm onSave={handleSave} />} />
            <Route
              path="books/:id"
              element={<WithBook books={books} render={(book) => <BookPreview book={book} />} />}
            />
            <Route
              path="books/:id/edit"
              element={
                <WithBook
                  books={books}
                  render={(book) => (
                    <BookForm
                      key={book.id}
                      book={book}
                      onSave={handleSave}
                      onDelete={handleDelete}
                    />
                  )}
                />
              }
            />
            <Route path="*" element={<Navigate to={BASE} replace />} />
          </Routes>
        </section>
      </div>

      <Dialog open={message !== null} onConfirm={() => setMessage(null)}>
        {message}
      </Dialog>
    </div>
  )
}

function WithBook({ books, render }: { books: Book[]; render: (book: Book) => ReactNode }) {
  const { id } = useParams()
  const book = books.find((item) => String(item.id) === id)
  return book ? render(book) : <Navigate to={BASE} replace />
}

function BookList({ books }: { books: Book[] }) {
  const location = useLocation()
  const activeId = useMatch({ path: `${BASE}/books/:id`, end: false })?.params.id

  return (
    <aside>
      <h2 className="mb-3 text-xl font-bold text-[#fc098f]">Books</h2>
      {books.length === 0 && <p className="mb-4 text-slate-500 italic">No books yet.</p>}
      <ul className="mb-4 flex flex-col gap-1">
        {books.map((book) => (
          <li
            key={book.id}
            className={cx(
              'flex items-center gap-2 rounded-lg pr-1',
              String(book.id) === activeId ? 'bg-[#39c2d7]/20' : 'hover:bg-[#39c2d7]/10',
            )}
          >
            <Link
              to={bookPath(book.id)}
              className="flex-1 truncate px-3 py-2 font-semibold text-slate-800"
            >
              {book.title}
            </Link>
            <Link
              to={`${bookPath(book.id)}/edit`}
              state={{ from: location.pathname }}
              aria-label={`Edit ${book.title}`}
              className="rounded-md border border-[#b22746] px-2.5 py-0.5 text-xs font-semibold text-[#b22746] hover:bg-[#b22746] hover:text-white"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`${BASE}/books/new`} state={{ from: location.pathname }} className={primaryButton}>
        Add book
      </Link>
    </aside>
  )
}

function BookPreview({ book }: { book: Book }) {
  return (
    <article>
      <h2 className="text-2xl font-bold text-[#fc098f]">{book.title}</h2>
      <p className="text-slate-500 italic">{book.author}</p>
      <img
        src={book.image || DEFAULT_COVER}
        alt={`Cover of ${book.title}`}
        onError={(event) => {
          if (!event.currentTarget.src.endsWith('book-cover.svg')) {
            event.currentTarget.src = DEFAULT_COVER
          }
        }}
        className="my-4 max-h-72 max-w-48 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.3)]"
      />
      <p>{book.plot}</p>
    </article>
  )
}

function BookForm({
  book,
  onSave,
  onDelete,
}: {
  book?: Book
  onSave: (id: number | undefined, fields: BookFields) => Book
  /** Only when editing an existing book. */
  onDelete?: (id: number) => void
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [confirming, setConfirming] = useState<'discard' | 'delete' | null>(null)
  const from = (location.state as { from?: string } | null)?.from

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = {} as BookFields
    for (const { name } of FIELDS) {
      const input = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement
      input.value = input.value.trim() // whitespace-only values count as empty
      fields[name] = input.value
    }
    if (!form.reportValidity()) {
      return
    }

    const saved = onSave(book?.id, fields)
    // Coming from the same preview: go back instead of stacking a second copy in the history.
    if (from === bookPath(saved.id)) {
      navigate(-1)
    } else {
      navigate(bookPath(saved.id), { replace: true })
    }
  }

  function remove() {
    setConfirming(null)
    if (book && onDelete) {
      onDelete(book.id)
      navigate(BASE, { replace: true })
    }
  }

  function discard() {
    setConfirming(null)
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(book ? bookPath(book.id) : BASE, { replace: true })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-[#fc098f]">{book ? 'Edit book' : 'Add book'}</h2>
      {FIELDS.map((field) => {
        const id = `book-${field.name}`
        const props = {
          id,
          name: field.name,
          required: true,
          defaultValue: book?.[field.name] ?? '',
          className:
            'rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal text-slate-800 outline-none focus:border-[#39c2d7] focus:ring-2 focus:ring-[#39c2d7]/40',
        }
        return (
          <div key={field.name} className="flex flex-col gap-1 text-sm font-medium">
            <label htmlFor={id}>{field.label}</label>
            {'multiline' in field ? <textarea rows={4} {...props} /> : <input {...props} />}
          </div>
        )
      })}
      <div className="flex flex-wrap justify-end gap-2">
        {book && onDelete && (
          <button
            type="button"
            onClick={() => setConfirming('delete')}
            className={`${dangerButton} mr-auto`}
          >
            Delete book
          </button>
        )}
        <button type="button" onClick={() => setConfirming('discard')} className={secondaryButton}>
          Cancel
        </button>
        <button type="submit" className={primaryButton}>
          Save
        </button>
      </div>

      <Dialog
        open={confirming === 'discard'}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        onConfirm={discard}
        onCancel={() => setConfirming(null)}
      >
        Discard changes?
      </Dialog>
      <Dialog
        open={confirming === 'delete'}
        confirmLabel="Delete"
        cancelLabel="Keep it"
        onConfirm={remove}
        onCancel={() => setConfirming(null)}
      >
        Delete “{book?.title}”?
      </Dialog>
    </form>
  )
}
