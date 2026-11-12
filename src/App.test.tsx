import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './App'
import { homeworkList } from './homeworkList'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('App', () => {
  it('lists all 15 homework on the home page', () => {
    renderAt('/')
    const targets = screen.getAllByRole('link').map((link) => link.getAttribute('href'))
    for (const homework of homeworkList) {
      expect(targets).toContain(`/hw/${homework.slug}`)
    }
  })

  it('embeds the original page of the HTML and CSS homework', () => {
    renderAt('/hw/01-html-basics')
    expect(screen.getByRole('heading', { level: 1, name: 'HTML Basics' })).toBeInTheDocument()
    expect(screen.getByTitle('HTML Basics')).toHaveAttribute(
      'src',
      'legacy/01-html-basics/index.html',
    )
  })

  it('loads the React version of a JavaScript homework', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('link', { name: /Intro to JS/ }))
    expect(
      await screen.findByRole('heading', { name: 'Task 1 – Defective batteries' }),
    ).toBeVisible()
  })

  it('shows a not found page for unknown homework', () => {
    renderAt('/hw/99-nothing')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
