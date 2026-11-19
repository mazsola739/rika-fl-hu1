import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { THEME_STORAGE_KEY, ThemeToggle } from './ThemeToggle'

afterEach(() => {
  delete document.documentElement.dataset.theme
})

describe('ThemeToggle', () => {
  it('switches the theme and remembers the choice', async () => {
    const user = userEvent.setup()
    document.documentElement.dataset.theme = 'light'
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

    await user.click(screen.getByRole('button', { name: 'Switch to light mode' }))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('starts from the theme that index.html picked', () => {
    document.documentElement.dataset.theme = 'dark'
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
  })
})
