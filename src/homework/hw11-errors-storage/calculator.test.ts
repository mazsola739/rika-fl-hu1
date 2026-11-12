import { describe, expect, it } from 'vitest'
import { ExpressionError, evaluate } from './calculator'

describe('evaluate', () => {
  it.each([
    ['2+3*4', 14],
    ['(2+3)*4', 20],
    ['-3--2', -1],
    ['2*-3', -6],
    ['0.1+0.2', 0.3],
    ['10/4', 2.5],
    ['  7  ', 7],
    ['-(2+3)*2', -10],
    ['.5+1.5', 2],
  ])('%s = %s', (expression, expected) => {
    expect(evaluate(expression)).toBe(expected)
  })

  it.each([
    ['4+', 'The expression is incomplete'],
    ['0/0', 'The result is not a number (e.g. 0/0 or division by zero)'],
    ['1/0', 'The result is not a number (e.g. 0/0 or division by zero)'],
    ['', 'The expression is empty'],
    ['abc', 'Unexpected character "a"'],
    ['((1)', 'Missing closing bracket'],
    ['1)', 'Unexpected ")"'],
    ['2 3', 'Unexpected "3"'],
  ])('%j is an error: %s', (expression, message) => {
    expect(() => evaluate(expression)).toThrow(new ExpressionError(message))
  })
})
