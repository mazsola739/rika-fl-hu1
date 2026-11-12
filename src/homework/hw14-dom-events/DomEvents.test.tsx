import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Basketball } from './Basketball'
import { ColorTable } from './ColorTable'
import { PhoneChecker } from './PhoneChecker'

describe('ColorTable', () => {
  it('keeps the color priority yellow > blue > green', async () => {
    const user = userEvent.setup()
    render(<ColorTable />)
    const cells = screen.getAllByRole('button')
    const color = (index: number) => cells[index]?.dataset.color

    await user.click(screen.getByRole('button', { name: 'Special cell' }))
    expect(color(0)).toBe('green')

    await user.click(cells[1] as HTMLElement)
    expect(color(1)).toBe('yellow')

    await user.click(cells[0] as HTMLElement)
    expect([color(0), color(1), color(2), color(3)]).toEqual(['blue', 'yellow', 'blue', 'green'])

    await user.click(cells[0] as HTMLElement)
    await user.click(cells[1] as HTMLElement)
    await user.click(screen.getByRole('button', { name: 'Special cell' }))
    expect(cells.every((cell) => cell.dataset.color === 'white')).toBe(true)
  })
})

describe('PhoneChecker', () => {
  it('validates the +380 format and sends valid numbers', async () => {
    const user = userEvent.setup()
    render(<PhoneChecker />)
    const input = screen.getByRole('textbox', { name: 'Phone number' })
    const send = screen.getByRole('button', { name: 'Send' })

    expect(send).toBeDisabled()
    await user.type(input, '+38')
    expect(screen.getByRole('status')).toHaveTextContent('Type number does not follow format')
    expect(input).toHaveAttribute('aria-invalid', 'true')

    await user.type(input, '0501234567')
    expect(send).toBeEnabled()
    expect(input).toHaveAttribute('aria-invalid', 'false')

    await user.click(send)
    expect(screen.getByRole('status')).toHaveTextContent('Data was successfully sent')

    await user.type(input, '8')
    expect(send).toBeDisabled()
  })
})

describe('Basketball', () => {
  it('scores through a custom "goal" event and hides the notification after 3 seconds', () => {
    vi.useFakeTimers()
    render(<Basketball />)
    const goals: string[] = []
    screen.getByTestId('court').addEventListener('goal', (event) => {
      goals.push((event as CustomEvent<{ team: string }>).detail.team)
    })

    fireEvent.click(screen.getByRole('button', { name: 'Scoring zone of team A' }))
    fireEvent.click(screen.getByRole('button', { name: 'Scoring zone of team A' }))
    fireEvent.click(screen.getByRole('button', { name: 'Scoring zone of team B' }))

    expect(goals).toEqual(['A', 'A', 'B'])
    expect(screen.getByTestId('score-A')).toHaveTextContent('2')
    expect(screen.getByTestId('score-B')).toHaveTextContent('1')
    expect(screen.getByRole('status')).toHaveTextContent('Team B scored!')
    expect(screen.getByRole('status')).toHaveClass('opacity-100')

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByRole('status')).toHaveClass('opacity-0')
    vi.useRealTimers()
  })
})
