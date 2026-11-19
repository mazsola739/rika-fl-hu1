import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it } from 'vitest'
import ErrorsStorage from './ErrorsStorage'

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/hw/11-errors-storage']}>
      <Routes>
        <Route path="/hw/11-errors-storage/*" element={<ErrorsStorage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('ErrorsStorage', () => {
  it('counts the page links and alerts the results', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('link', { name: 'Page 2' }))
    await user.click(screen.getByRole('link', { name: 'Page 2' }))
    await user.click(screen.getByRole('link', { name: 'Home' }))
    await user.click(screen.getByRole('button', { name: 'View page visits results' }))

    expect(screen.getByText(/You visited Page2 2 time\(s\)/)).toBeVisible()
    await user.click(screen.getAllByRole('button', { name: 'OK' })[0] as HTMLElement)
    expect(screen.getByRole('button', { name: 'View page visits results' })).toBeVisible()
  })

  it('calculates the expression of the prompt, then asks again', async () => {
    const user = userEvent.setup()
    renderPage()

    const input = screen.getByRole('textbox', { name: 'Enter a mathematical expression' })
    expect(input).toHaveValue('2 + 3 * (4 - 1)')
    await user.type(input, '{Enter}')
    expect(screen.getByText('2 + 3 * (4 - 1) = 11')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'OK' }))
    expect(screen.getByRole('textbox', { name: 'Enter a mathematical expression' })).toHaveFocus()
  })

  it('shows the error of an invalid expression', async () => {
    const user = userEvent.setup()
    renderPage()

    const input = screen.getByRole('textbox', { name: 'Enter a mathematical expression' })
    await user.clear(input)
    await user.type(input, '2 +{Enter}')
    expect(screen.getByText(/Invalid expression: .*Please try again\./)).toBeVisible()
  })
})
