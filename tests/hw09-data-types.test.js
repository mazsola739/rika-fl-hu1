import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import {
  convert,
  describePastDay,
  executeforEach,
  filterArray,
  flipOver,
  formatDate,
  getArrayOfKeys,
  getPastDay,
  getTotalWeight,
  getValuePosition,
  makeListFromRange,
  mapArray,
} from '../public/legacy/09-data-types/index.js'

const fruits = [
  { name: 'apple', weight: 0.5 },
  { name: 'pineapple', weight: 2 },
]

const basket = [
  { name: 'Bread', weight: 0.3 },
  { name: 'Coca-Cola', weight: 0.5 },
  { name: 'Watermelon', weight: 8 },
]

describe('1. convert', () => {
  it('turns strings into numbers and numbers into strings', () => {
    expect(convert('1', 2, 3, '4')).toEqual([1, '2', '3', 4])
  })

  it('returns an empty array without arguments', () => {
    expect(convert()).toEqual([])
  })
})

describe('2. executeforEach', () => {
  it('runs the callback on every element in order', () => {
    const log = vi.fn()
    executeforEach([1, 2, 3], (el) => log(el * 2))
    expect(log.mock.calls).toEqual([[2], [4], [6]])
  })
})

describe('3. mapArray', () => {
  it('converts numbers in strings and transforms every element', () => {
    expect(mapArray([2, '5', 8], (el) => el + 3)).toEqual([5, 8, 11])
  })
})

describe('4. filterArray', () => {
  it('keeps the elements the callback accepts', () => {
    expect(filterArray([2, 5, 8], (el) => el % 2 === 0)).toEqual([2, 8])
  })
})

describe('5. getValuePosition', () => {
  it('returns the position, not the index', () => {
    expect(getValuePosition([2, 5, 8], 8)).toBe(3)
  })

  it('returns false for a missing value', () => {
    expect(getValuePosition([12, 4, 6], 1)).toBe(false)
  })
})

describe('6. flipOver', () => {
  it.each([
    ['hey world', 'dlrow yeh'],
    ['Rika', 'akiR'],
    ['', ''],
  ])('flipOver(%j) → %j', (text, expected) => {
    expect(flipOver(text)).toBe(expected)
  })
})

describe('7. makeListFromRange', () => {
  it('creates the inclusive range', () => {
    expect(makeListFromRange([2, 7])).toEqual([2, 3, 4, 5, 6, 7])
    expect(makeListFromRange([3, 3])).toEqual([3])
  })
})

describe('8. getArrayOfKeys', () => {
  it('returns the values of the key without changing the array', () => {
    const copy = structuredClone(fruits)
    expect(getArrayOfKeys(fruits, 'name')).toEqual(['apple', 'pineapple'])
    expect(fruits).toEqual(copy)
  })
})

describe('9. getTotalWeight', () => {
  it('adds up the weights', () => {
    expect(getTotalWeight(basket)).toBeCloseTo(8.8)
  })
})

describe('10. getPastDay', () => {
  const date = new Date(2020, 0, 2)

  it.each([
    [1, 1],
    [2, 31],
    [365, 2],
  ])('%i days before 2 Jan 2020 → %i', (days, expected) => {
    expect(getPastDay(date, days)).toBe(expected)
  })

  it('does not change the source date', () => {
    getPastDay(date, 10)
    expect(date.getTime()).toBe(new Date(2020, 0, 2).getTime())
  })

  it('describes the past day like the task example', () => {
    expect(describePastDay(date, 1)).toBe('1, (1 Jan 2020)')
    expect(describePastDay(date, 2)).toBe('31, (31 Dec 2019)')
    expect(describePastDay(date, 365)).toBe('2, (2 Jan 2019)')
  })
})

describe('11. formatDate', () => {
  it('formats as YYYY/MM/DD HH:mm with leading zeros', () => {
    expect(formatDate(new Date(2019, 5, 15, 9, 15))).toBe('2019/06/15 09:15')
    expect(formatDate(new Date(2020, 11, 31, 23, 5))).toBe('2020/12/31 23:05')
  })
})

describe('restriction of the task', () => {
  it('uses no built-in array, object or string methods besides push and parseInt', () => {
    const path = resolve(process.cwd(), 'public/legacy/09-data-types/index.js')
    const code = readFileSync(path, 'utf8').replace(/\/\/.*$|\/\*\*.*\*\//gm, '')
    const forbidden =
      /\.(map|filter|forEach|reduce|find|findIndex|indexOf|includes|some|every|concat|slice|splice|reverse|join|split|replace|charAt|substring|toString|trim|padStart|keys|values|entries|assign)\(/
    expect(code).not.toMatch(forbidden)
  })
})
