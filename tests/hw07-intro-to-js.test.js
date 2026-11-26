import { describe, expect, it } from 'vitest'
import {
  calcBatteries,
  createBatteryMessage,
  createMiddleMessage,
  getMiddle,
  INVALID_INPUT,
  INVALID_VALUE,
  isValidBatteryAmount,
  isValidDefectiveRate,
  parseNumber,
  SAME_MIDDLE,
} from '../public/legacy/07-intro-to-js/logic.js'

describe('task 1 – defective batteries', () => {
  it('shows the example of the task', () => {
    expect(createBatteryMessage('150', '10')).toBe(
      [
        'Rika calculated for you that:',
        'Amount of batteries: 150',
        'Defective rate: 10%',
        'Amount of defective batteries: 15',
        'Amount of working batteries: 135',
      ].join('\n'),
    )
  })

  it('shows at most two numbers after the comma', () => {
    expect(calcBatteries(100, 33.333)).toEqual({
      amount: 100,
      rate: 33.333,
      defective: 33.33,
      working: 66.67,
    })
    expect(calcBatteries(10, 25)).toMatchObject({ defective: 2.5, working: 7.5 })
  })

  it('parses numbers and rejects cancel, empty and text input', () => {
    expect(parseNumber(' 42 ')).toBe(42)
    expect(parseNumber('1.5')).toBe(1.5)
    expect(parseNumber(null)).toBeNull()
    expect(parseNumber('')).toBeNull()
    expect(parseNumber('   ')).toBeNull()
    expect(parseNumber('Rika')).toBeNull()
  })

  it('validates the amount and the rate', () => {
    expect(isValidBatteryAmount(0)).toBe(true)
    expect(isValidBatteryAmount(-1)).toBe(false)
    expect(isValidDefectiveRate(0)).toBe(true)
    expect(isValidDefectiveRate(100)).toBe(true)
    expect(isValidDefectiveRate(-1)).toBe(false)
    expect(isValidDefectiveRate(101)).toBe(false)
  })

  it.each([
    [null, null],
    ['', '10'],
    ['abc', '5'],
    ['-1', '10'],
    ['10', '-1'],
    ['10', '101'],
    ['10', null],
  ])('shows "Invalid input data" for (%j, %j)', (amount, rate) => {
    expect(createBatteryMessage(amount, rate)).toBe(INVALID_INPUT)
  })
})

describe('task 2 – middle character', () => {
  it.each([
    ['test', 'es'],
    ['commit', SAME_MIDDLE],
    ['character', 'a'],
    ['B', 'B'],
    ['', INVALID_VALUE],
    [' ', INVALID_VALUE],
    [null, INVALID_VALUE],
    ['  hello  ', 'l'],
  ])('getMiddle(%j) → %j', (word, expected) => {
    expect(getMiddle(word)).toBe(expected)
  })

  it('wraps a found middle in Rika’s message', () => {
    expect(createMiddleMessage('Rika')).toBe(
      'Rika checked it for you!\nThe middle of "Rika" is: ik',
    )
  })

  it('shows the task messages as they are', () => {
    expect(createMiddleMessage('commit')).toBe('Middle characters are the same')
    expect(createMiddleMessage(' ')).toBe('Invalid value')
  })
})
