import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import Books from './Books'
import { STORAGE_KEY } from './useBooks'

function CurrentPath() {
  const location = useLocation()
  return <output data-testid="path">{location.pathname}</output>
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/hw/15-bom-books/*" element={<Books />} />
      </Routes>
      <CurrentPath />
    </MemoryRouter>,
  )
}

const path = () => screen.getByTestId('path').textContent

describe('Books', () => {
  it('shows the three default books and opens a preview', async () => {
    const user = userEvent.setup()
    renderAt('/hw/15-bom-books')

    await user.click(screen.getByRole('link', { name: 'Preview How to Cook' }))
    expect(path()).toBe('/hw/15-bom-books/books/2')
    expect(screen.getByRole('heading', { level: 2, name: 'How to Cook' })).toBeInTheDocument()
    expect(within(screen.getByRole('article')).getByText('Robin Cook')).toBeInTheDocument()
  })

  it.each([
    '/hw/15-bom-books/books/99',
    '/hw/15-bom-books/books/abc/edit',
    '/hw/15-bom-books/something',
  ])('falls back to the list for the invalid URL %s', (url) => {
    renderAt(url)
    expect(path()).toBe('/hw/15-bom-books')
    expect(screen.getByText('Select a book to see the details.')).toBeInTheDocument()
  })

  it('edits a book, saves it to localStorage and shows the success message', async () => {
    const user = userEvent.setup()
    renderAt('/hw/15-bom-books/books/1')

    await user.click(screen.getByRole('link', { name: 'Edit Harry Potter' }))
    const title = screen.getByRole('textbox', { name: 'Book name' })
    await user.clear(title)
    await user.type(title, 'Harry Potter 2')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(path()).toBe('/hw/15-bom-books/books/1')
    expect(screen.getByRole('heading', { level: 2, name: 'Harry Potter 2' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')[0].title).toBe('Harry Potter 2')
    await waitFor(() => expect(screen.getByText('Book successfully updated')).toBeVisible())
  })

  it('does not save empty or whitespace-only fields', async () => {
    const user = userEvent.setup()
    renderAt('/hw/15-bom-books/books/new')

    await user.type(screen.getByRole('textbox', { name: 'Book name' }), '   ')
    await user.type(screen.getByRole('textbox', { name: 'Author' }), 'Me')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    expect(path()).toBe('/hw/15-bom-books/books/new')
  })

  it('adds a new book to the end of the list', async () => {
    const user = userEvent.setup()
    renderAt('/hw/15-bom-books')

    await user.click(screen.getByRole('link', { name: 'Add book' }))
    await user.type(screen.getByRole('textbox', { name: 'Book name' }), 'New Book')
    await user.type(screen.getByRole('textbox', { name: 'Author' }), 'Me')
    await user.type(screen.getByRole('textbox', { name: 'Image URL' }), 'cover.png')
    await user.type(screen.getByRole('textbox', { name: 'Plot' }), 'Something happens.')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(path()).toBe('/hw/15-bom-books/books/4')
    const titles = screen
      .getAllByRole('link', { name: /^Preview / })
      .map((link) => link.getAttribute('aria-label'))
    expect(titles.at(-1)).toBe('Preview New Book')
  })

  it('asks before discarding changes and goes back on confirmation', async () => {
    const user = userEvent.setup()
    renderAt('/hw/15-bom-books/books/3')

    await user.click(screen.getByRole('link', { name: 'Edit Life in EPAM' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText('Discard changes?')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Keep editing' }))
    expect(path()).toBe('/hw/15-bom-books/books/3/edit')

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    await user.click(screen.getByRole('button', { name: 'Discard' }))
    expect(path()).toBe('/hw/15-bom-books/books/3')
  })

  it('deletes a book after confirming, from localStorage too', async () => {
    const user = userEvent.setup()
    renderAt('/hw/15-bom-books/books/3/edit')

    await user.click(screen.getByRole('button', { name: 'Delete book' }))
    expect(screen.getByText('Delete “Life in EPAM”?')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(path()).toBe('/hw/15-bom-books')
    expect(screen.queryByRole('link', { name: 'Preview Life in EPAM' })).not.toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as { title: string }[]
    expect(stored.map((book) => book.title)).toEqual(['Harry Potter', 'How to Cook'])
    await waitFor(() => expect(screen.getByText('Book successfully deleted')).toBeVisible())
  })

  it('keeps the book when the delete is not confirmed', async () => {
    const user = userEvent.setup()
    renderAt('/hw/15-bom-books/books/3/edit')

    await user.click(screen.getByRole('button', { name: 'Delete book' }))
    await user.click(screen.getByRole('button', { name: 'Keep it' }))

    expect(path()).toBe('/hw/15-bom-books/books/3/edit')
    expect(screen.getByRole('link', { name: 'Preview Life in EPAM' })).toBeInTheDocument()
  })

  it('has no delete button when adding a book', () => {
    renderAt('/hw/15-bom-books/books/new')
    expect(screen.queryByRole('button', { name: 'Delete book' })).not.toBeInTheDocument()
  })
})
