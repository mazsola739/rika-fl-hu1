import { describe, expect, it } from 'vitest'
import { checkBatteries, formatBatteryReport, getMiddle } from './logic'

describe('checkBatteries', () => {
  it('calculates the example of the task', () => {
    expect(formatBatteryReport(checkBatteries('150', '10'))).toBe(
      [
        'Amount of batteries: 150',
        'Defective rate: 10%',
        'Amount of defective batteries: 15',
        'Amount of working batteries: 135',
      ].join('\n'),
    )
  })

  it('shows at most two decimals', () => {
    expect(checkBatteries('100', '33.333')).toMatchObject({ defective: 33.33, working: 66.67 })
  })

  it.each([
    ['', ''],
    ['abc', '5'],
    ['-1', '10'],
    ['10', '-1'],
    ['10', '101'],
  ])('rejects invalid input (%j, %j)', (batteries, rate) => {
    expect(checkBatteries(batteries, rate)).toBeNull()
    expect(formatBatteryReport(null)).toBe('Invalid input data')
  })
})

describe('getMiddle', () => {
  it.each([
    ['test', 'es'],
    ['commit', 'Middle characters are the same'],
    ['character', 'a'],
    ['B', 'B'],
    ['', 'Invalid value'],
    [' ', 'Invalid value'],
    ['  hello  ', 'l'],
  ])('%j → %j', (word, expected) => {
    expect(getMiddle(word)).toBe(expected)
  })
})
