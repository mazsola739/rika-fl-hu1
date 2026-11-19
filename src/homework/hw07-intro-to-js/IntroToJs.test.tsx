import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import IntroToJs from './IntroToJs'

describe('IntroToJs', () => {
  it('asks for the batteries in two prompts, then alerts the report', async () => {
    const user = userEvent.setup()
    render(<IntroToJs />)

    await user.type(screen.getByRole('textbox', { name: 'Enter the amount of batteries' }), '150')
    await user.click(screen.getAllByRole('button', { name: 'OK' })[0] as HTMLElement)
    const rate = screen.getByRole('textbox', {
      name: 'Enter the percentage of defective batteries',
    })
    expect(rate).toHaveFocus()
    await user.type(rate, '10{Enter}')

    expect(screen.getByText(/Amount of defective batteries: 15/)).toBeVisible()
    expect(screen.getByText(/Amount of working batteries: 135/)).toBeVisible()

    await user.click(screen.getAllByRole('button', { name: 'OK' })[0] as HTMLElement)
    expect(screen.getByRole('textbox', { name: 'Enter the amount of batteries' })).toHaveFocus()
  })

  it('treats a cancelled prompt as invalid input, like prompt() returning null', async () => {
    const user = userEvent.setup()
    render(<IntroToJs />)

    await user.click(screen.getAllByRole('button', { name: 'Cancel' })[0] as HTMLElement)
    await user.click(screen.getAllByRole('button', { name: 'Cancel' })[0] as HTMLElement)
    expect(screen.getByText('Invalid input data')).toBeVisible()
  })

  it('finds the middle of the pre-filled word', async () => {
    const user = userEvent.setup()
    render(<IntroToJs />)

    expect(screen.getByRole('textbox', { name: 'Enter a word' })).toHaveValue('Rika')
    await user.click(screen.getAllByRole('button', { name: 'OK' })[1] as HTMLElement)
    expect(screen.getByText('ik')).toBeVisible()
  })
})
