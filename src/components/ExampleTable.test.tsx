import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ExampleTable } from './ExampleTable'

const source = `/** Reverses a string. */
export function flipOver(text: string) {
  return text
}
`

describe('ExampleTable', () => {
  it('opens and closes the code of the called function', async () => {
    const user = userEvent.setup()
    render(
      <ExampleTable
        examples={[{ call: "flipOver('Rika')", actual: 'akiR', expected: 'akiR' }]}
        source={source}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Show the code of flipOver' }))
    expect(screen.getByText(/export function flipOver/)).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Hide the code of flipOver' }))
    expect(screen.queryByText(/export function flipOver/)).not.toBeInTheDocument()
  })

  it('has no code buttons without a source', () => {
    render(<ExampleTable examples={[{ call: "flipOver('Rika')", actual: 'akiR' }]} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
