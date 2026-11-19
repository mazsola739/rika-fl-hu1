import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router'
import { Dialog } from '../../components/Dialog'
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

/** The browser's default button, as the original page used it (no styling of its own). */
const defaultButton =
  'inline-block cursor-pointer rounded-[3px] border border-[#767676] bg-[#efefef] px-1.5 py-px font-verdana text-[1.05rem] text-black hover:bg-[#e5e5e5]'

/** A book card of the original page: a black-bordered square. */
const card = 'h-[15.3rem] w-[15.3rem] overflow-hidden border border-black p-3.5'

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
    // The original page: in Times New Roman, the books as bordered cards on light blue, and a
    // mint panel on the right for the preview and the forms. It stays light in the dark theme too.
    <div className="flex min-h-[36rem] flex-col overflow-hidden rounded-lg font-times text-black md:flex-row">
      <BookList books={books} />

      <section className="min-h-72 border-black bg-[#dcfcf6] p-2 max-md:border-t md:w-[22.5rem] md:shrink-0 md:border-l">
        <Routes>
          <Route
            index
            element={<p className="text-[1.2rem]">Select a book to see the details.</p>}
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
                  <BookForm key={book.id} book={book} onSave={handleSave} onDelete={handleDelete} />
                )}
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

  return (
    <section aria-label="Books" className="flex-1 bg-[#cff5fe] p-5">
      <ul className="flex flex-wrap gap-x-11 gap-y-6">
        {books.map((book) => (
          <li key={book.id} className={card}>
            <p className="text-[1.6rem] leading-tight">{book.author}</p>
            <h3 className="mt-5 text-[1.6rem] leading-tight font-bold">{book.title}</h3>
            <p className="mt-1">
              <Link
                to={bookPath(book.id)}
                aria-label={`Preview ${book.title}`}
                className={defaultButton}
              >
                Preview
              </Link>
              <Link
                to={`${bookPath(book.id)}/edit`}
                state={{ from: location.pathname }}
                aria-label={`Edit ${book.title}`}
                className={defaultButton}
              >
                Edit
              </Link>
            </p>
          </li>
        ))}
        <li className={card}>
          <Link
            to={`${BASE}/books/new`}
            state={{ from: location.pathname }}
            className={`${defaultButton} mt-1`}
          >
            Add book
          </Link>
        </li>
      </ul>
    </section>
  )
}

function BookPreview({ book }: { book: Book }) {
  return (
    <article className="text-[1.35rem]">
      <p>{book.author}</p>
      <h2 className="mt-4 font-bold">{book.title}</h2>
      <img
        src={book.image || DEFAULT_COVER}
        alt={`Cover of ${book.title}`}
        onError={(event) => {
          if (!event.currentTarget.src.endsWith('book-cover.svg')) {
            event.currentTarget.src = DEFAULT_COVER
          }
        }}
        className="mt-1 w-[12.5rem] border border-[#999]"
      />
      <p className="mt-10">{book.plot}</p>
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-[1.2rem]">
      <h2 className="text-[1.35rem] font-bold">{book ? 'Edit book' : 'Add book'}</h2>
      {FIELDS.map((field) => {
        const id = `book-${field.name}`
        const props = {
          id,
          name: field.name,
          required: true,
          defaultValue: book?.[field.name] ?? '',
          className: 'border border-[#767676] bg-white px-1 py-0.5 font-verdana text-base',
        }
        return (
          <div key={field.name} className="flex flex-col">
            <label htmlFor={id}>{field.label}</label>
            {'multiline' in field ? <textarea rows={4} {...props} /> : <input {...props} />}
          </div>
        )
      })}
      <p className="flex flex-wrap gap-1">
        <button type="submit" className={defaultButton}>
          Save
        </button>
        <button type="button" onClick={() => setConfirming('discard')} className={defaultButton}>
          Cancel
        </button>
        {book && onDelete && (
          <button
            type="button"
            onClick={() => setConfirming('delete')}
            className={`${defaultButton} ml-auto`}
          >
            Delete book
          </button>
        )}
      </p>

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
