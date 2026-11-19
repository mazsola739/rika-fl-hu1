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

  it('embeds the vanilla JS solution of a JavaScript homework', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('link', { name: /Intro to JS/ }))
    expect(await screen.findByTitle('Intro to JS')).toHaveAttribute(
      'src',
      'legacy/07-intro-to-js/index.html',
    )
  })

  it('shows the Day/Night switch of HW03 when coming from the previous homework', async () => {
    const user = userEvent.setup()
    renderAt('/hw/02-css-basics')
    await user.click(screen.getAllByRole('link', { name: /HW 03 Preprocessors/ })[0] as HTMLElement)

    expect(screen.getByRole('heading', { level: 1, name: 'Preprocessors' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Night' })).toBeInTheDocument()
  })

  it('shows a not found page for unknown homework', () => {
    renderAt('/hw/99-nothing')
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
