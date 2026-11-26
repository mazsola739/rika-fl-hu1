import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { EXAMPLES } from '../public/legacy/10-functions/examples.js'
import {
  countPoints,
  getDivision,
  isBigger,
  isEquals,
  letterCount,
  negativeCount,
  numberToString,
  storeNames,
} from '../public/legacy/10-functions/functions.js'

describe('examples shown on the page', () => {
  it.each(EXAMPLES)('$call', ({ result, expected }) => {
    expect(result).toEqual(expected)
  })
})

describe('isEquals', () => {
  it('compares strictly', () => {
    expect(isEquals(3, 3)).toBe(true)
    expect(isEquals(3, 4)).toBe(false)
    expect(isEquals(3, '3')).toBe(false)
  })
})

describe('isBigger', () => {
  it('is true only when the first one is bigger', () => {
    expect(isBigger(4, 3)).toBe(true)
    expect(isBigger(3, 3)).toBe(false)
    expect(isBigger(2, 3)).toBe(false)
  })
})

describe('numberToString', () => {
  it('returns a string', () => {
    expect(numberToString(1258)).toBe('1258')
    expect(numberToString(-1.5)).toBe('-1.5')
  })
})

describe('storeNames', () => {
  it('collects any number of names', () => {
    expect(storeNames('Tommy Shelby', 'Ragnar Lodbrok', 'Tom Hardy')).toEqual([
      'Tommy Shelby',
      'Ragnar Lodbrok',
      'Tom Hardy',
    ])
    expect(storeNames('Rika')).toEqual(['Rika'])
    expect(storeNames()).toEqual([])
  })
})

describe('getDivision', () => {
  it('divides the bigger number by the smaller one', () => {
    expect(getDivision(4, 1)).toBe(4)
    expect(getDivision(2, 8)).toBe(4)
    expect(getDivision(5, 5)).toBe(1)
    expect(getDivision(3, 6)).toBe(2)
  })
})

describe('negativeCount', () => {
  it('counts the negative numbers only', () => {
    expect(negativeCount([4, 3, 2, 9])).toBe(0)
    expect(negativeCount([0, -3, 5, 7])).toBe(1)
    expect(negativeCount([-1, -2, -0.5])).toBe(3)
    expect(negativeCount([])).toBe(0)
  })
})

describe('letterCount', () => {
  it('counts the occurrences, case-sensitively', () => {
    expect(letterCount('Marry', 'r')).toBe(2)
    expect(letterCount('Barny', 'y')).toBe(1)
    expect(letterCount('', 'z')).toBe(0)
    expect(letterCount('Rika', 'r')).toBe(0)
  })
})

describe('countPoints', () => {
  it('gives 3 points for a win, 1 for a draw and 0 for a loss', () => {
    expect(
      countPoints(['100:90', '110:98', '100:100', '95:46', '54:90', '99:44', '90:90', '111:100']),
    ).toBe(17)
    expect(countPoints(['1:0', '0:0', '0:1'])).toBe(4)
    expect(countPoints([])).toBe(0)
  })
})

describe('restriction of the task', () => {
  it('does not use the Math object', () => {
    // Vitest runs from the repository root.
    const source = readFileSync('public/legacy/10-functions/functions.js', 'utf8')
    expect(source).not.toMatch(/\bMath\./)
  })
})
