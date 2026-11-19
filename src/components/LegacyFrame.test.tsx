import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { LegacyPage } from '../homeworkList'
import { LegacyFrame } from './LegacyFrame'

const themed: LegacyPage = {
  src: 'legacy/03-preprocessors/index.html',
  themes: [
    { label: 'Day', stylesheet: 'css/style1.css' },
    { label: 'Night', stylesheet: 'css/style2.css' },
  ],
}

describe('LegacyFrame', () => {
  it('opens the selected theme in the new tab', async () => {
    const user = userEvent.setup()
    render(<LegacyFrame page={themed} title="Preprocessors" />)
    const link = screen.getByRole('link', { name: /Open in a new tab/ })
    expect(link).toHaveAttribute('href', 'legacy/03-preprocessors/index.html')

    await user.click(screen.getByRole('button', { name: 'Night' }))
    expect(link).toHaveAttribute('href', 'legacy/03-preprocessors/index.html?theme=night')

    await user.click(screen.getByRole('button', { name: 'Day' }))
    expect(link).toHaveAttribute('href', 'legacy/03-preprocessors/index.html')
  })

  it('scales a desktop-only page down on a narrow screen instead of cutting it off', async () => {
    const user = userEvent.setup()
    render(<LegacyFrame page={{ src: 'legacy/page.html', minWidth: 900 }} title="Layout" />)

    await user.click(screen.getByRole('button', { name: 'Mobile' }))
    const frame = screen.getByTitle('Layout')
    expect(frame.style.width).toBe('900px')
    expect(frame.style.transform).toBe(`scale(${375 / 900})`)
    expect(screen.getByText(/built for screens at least 900px wide/)).toBeVisible()
  })

  it('shows a responsive page at the real width of the screen', async () => {
    const user = userEvent.setup()
    render(<LegacyFrame page={{ src: 'legacy/page.html' }} title="Responsive" />)

    await user.click(screen.getByRole('button', { name: 'Mobile' }))
    const frame = screen.getByTitle('Responsive')
    expect(frame.style.width).toBe('375px')
    expect(frame.style.transform).toBe('')
    expect(screen.queryByText(/built for screens/)).not.toBeInTheDocument()
  })
})
