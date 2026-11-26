import { beforeEach, describe, expect, it } from 'vitest'
import {
  calculate,
  ExpressionError,
  evaluate,
  tokenize,
} from '../public/legacy/11-errors-storage/js/expression.js'
import {
  readVisits,
  STORAGE_KEY,
  viewResults,
  visitLink,
} from '../public/legacy/11-errors-storage/js/visits.js'

describe('visit counter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('counts the visits of each page under a prefixed key', () => {
    visitLink('Page1')
    visitLink('Page1')
    visitLink('Page3')

    expect(STORAGE_KEY).toMatch(/^rika-hw11-/)
    expect(readVisits()).toEqual({ Page1: 2, Page3: 1 })
  })

  it('lists every page, then clears the counts', () => {
    visitLink('Page2')

    expect(viewResults()).toEqual([
      'You visited Page1: 0 time(s)',
      'You visited Page2: 1 time(s)',
      'You visited Page3: 0 time(s)',
    ])
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(viewResults()).toEqual([
      'You visited Page1: 0 time(s)',
      'You visited Page2: 0 time(s)',
      'You visited Page3: 0 time(s)',
    ])
  })

  it('leaves the keys of other homework alone', () => {
    localStorage.setItem('rika-hw15-books', '[]')
    visitLink('Page1')
    viewResults()

    expect(localStorage.getItem('rika-hw15-books')).toBe('[]')
  })

  it('starts again from zero when the stored value is broken', () => {
    localStorage.setItem(STORAGE_KEY, '{oops')
    expect(readVisits()).toEqual({})

    visitLink('Page1')
    expect(readVisits()).toEqual({ Page1: 1 })
  })
})

describe('tokenize', () => {
  it('splits numbers, operators and brackets', () => {
    expect(tokenize(' 12.5*(3 - .5) ')).toEqual([12.5, '*', '(', 3, '-', 0.5, ')'])
  })

  it('rejects unknown characters', () => {
    expect(() => tokenize('2 + x')).toThrow(new ExpressionError('Unexpected character "x"'))
  })
})

describe('evaluate', () => {
  it.each([
    ['2+3', 5],
    ['2+3*4', 14],
    ['(2+3)*4', 20],
    ['10/4', 2.5],
    ['10-4-3', 3],
    ['16/4/2', 2],
    ['-3--2', -1],
    ['2*-3', -6],
    ['+5', 5],
    ['-(2+3)*2', -10],
    ['0.1+0.2', 0.3],
    ['.5+1.5', 2],
    ['  7  ', 7],
    ['2 + 3 * (4 - 1)', 11],
  ])('%s = %s', (expression, expected) => {
    expect(evaluate(expression)).toBe(expected)
  })

  it.each([
    ['', 'The expression is empty'],
    ['   ', 'The expression is empty'],
    ['4+', 'The expression is incomplete'],
    ['*2', 'Unexpected "*"'],
    ['2 3', 'Unexpected "3"'],
    ['1)', 'Unexpected ")"'],
    ['((1)', 'A closing bracket is missing'],
    ['abc', 'Unexpected character "a"'],
    ['0/0', 'The result is not a number (NaN)'],
    ['1/0', 'Division by zero'],
  ])('%j is an error: %s', (expression, message) => {
    expect(() => evaluate(expression)).toThrow(new ExpressionError(message))
  })
})

describe('calculate', () => {
  it('returns the result line of a valid expression', () => {
    expect(calculate(' 6*7 ')).toEqual({ isValid: true, message: '6*7 = 42' })
  })

  it('returns an error message for an invalid one', () => {
    expect(calculate('0/0')).toEqual({
      isValid: false,
      message: 'Invalid expression: The result is not a number (NaN). Please try again.',
    })
  })

  it('knows that Rika is priceless', () => {
    expect(calculate('RIKA')).toEqual({ isValid: true, message: 'Rika = priceless ✨' })
  })
})
