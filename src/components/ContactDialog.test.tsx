import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ContactDialog } from './ContactDialog'

async function fillAndSend() {
  const user = userEvent.setup()
  render(<ContactDialog />)
  await user.click(screen.getByRole('button', { name: 'Contact me' }))
  await user.type(screen.getByLabelText('Name'), 'Rika')
  await user.type(screen.getByLabelText('E-mail'), 'rika@example.com')
  await user.type(screen.getByLabelText('Message'), 'Hello from the raisin!')
  await user.click(screen.getByRole('button', { name: 'Send message' }))
}

describe('ContactDialog', () => {
  it('sends the message through Web3Forms and thanks for it', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ success: true }) })
    vi.stubGlobal('fetch', fetchMock)

    await fillAndSend()

    expect(await screen.findByText(/Your message is on its way/)).toBeInTheDocument()
    const body = JSON.parse(fetchMock.mock.calls[0]?.[1].body)
    expect(body).toMatchObject({ name: 'Rika', email: 'rika@example.com' })
    expect(body.subject).toBe('FL-HU1 homework: a message from Rika')
    vi.unstubAllGlobals()
  })

  it('says so when the message could not be sent', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await fillAndSend()

    expect(await screen.findByText(/couldn't be sent/)).toBeInTheDocument()
    vi.unstubAllGlobals()
  })
})
