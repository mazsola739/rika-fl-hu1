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
import { Button, cx } from '../../components/ui'
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

// Routes: index → list only, books/new → add, books/:id → preview, books/:id/edit → edit.
// Anything else (unknown id, unknown path) falls back to the list.
export default function Books() {
  const { books, saveBook } = useBooks()
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  function handleSave(id: number | undefined, fields: BookFields) {
    const book = saveBook(id, fields)
    clearTimeout(timer.current)
    timer.current = setTimeout(
      () => setMessage(id === undefined ? 'Book successfully added' : 'Book successfully updated'),
      ALERT_DELAY_MS,
    )
    return book
  }

  return (
    <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <BookList books={books} />

      <section className="min-h-72 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <Routes>
          <Route
            index
            element={
              <p className="text-slate-500 dark:text-slate-400">
                Select a book to see the details.
              </p>
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
                render={(book) => <BookForm key={book.id} book={book} onSave={handleSave} />}
              />
            }
          />
          <Route path="*" element={<Navigate to={BASE} replace />} />
        </Routes>
      </section>

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
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-lg font-semibold">Books</h2>
      <ul className="mb-4 flex flex-col gap-1">
        {books.map((book) => (
          <li
            key={book.id}
            className={cx(
              'flex items-center gap-2 rounded-lg pr-1',
              String(book.id) === activeId && 'bg-accent-soft dark:bg-slate-800',
            )}
          >
            <Link
              to={bookPath(book.id)}
              className="flex-1 truncate px-3 py-2 font-semibold hover:underline"
            >
              {book.title}
            </Link>
            <Link
              to={`${bookPath(book.id)}/edit`}
              state={{ from: location.pathname }}
              aria-label={`Edit ${book.title}`}
              className="rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-white hover:bg-accent-strong"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
      <Link
        to={`${BASE}/books/new`}
        state={{ from: location.pathname }}
        className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-strong"
      >
        Add book
      </Link>
    </aside>
  )
}

function BookPreview({ book }: { book: Book }) {
  return (
    <article>
      <h2 className="text-2xl font-bold">{book.title}</h2>
      <p className="text-slate-500 italic dark:text-slate-400">{book.author}</p>
      <img
        src={book.image || DEFAULT_COVER}
        alt={`Cover of ${book.title}`}
        onError={(event) => {
          if (!event.currentTarget.src.endsWith('book-cover.svg')) {
            event.currentTarget.src = DEFAULT_COVER
          }
        }}
        className="my-4 max-h-72 max-w-48 rounded-lg"
      />
      <p>{book.plot}</p>
    </article>
  )
}

function BookForm({
  book,
  onSave,
}: {
  book?: Book
  onSave: (id: number | undefined, fields: BookFields) => Book
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const [confirming, setConfirming] = useState(false)
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

  function discard() {
    setConfirming(false)
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate(book ? bookPath(book.id) : BASE, { replace: true })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{book ? 'Edit book' : 'Add book'}</h2>
      {FIELDS.map((field) => {
        const id = `book-${field.name}`
        const props = {
          id,
          name: field.name,
          required: true,
          defaultValue: book?.[field.name] ?? '',
          className:
            'rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal dark:border-slate-700 dark:bg-slate-950',
        }
        return (
          <div key={field.name} className="flex flex-col gap-1 text-sm font-medium">
            <label htmlFor={id}>{field.label}</label>
            {'multiline' in field ? <textarea rows={4} {...props} /> : <input {...props} />}
          </div>
        )
      })}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => setConfirming(true)}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>

      <Dialog
        open={confirming}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
        onConfirm={discard}
        onCancel={() => setConfirming(false)}
      >
        Discard changes?
      </Dialog>
    </form>
  )
}
