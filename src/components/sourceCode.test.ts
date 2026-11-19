import { describe, expect, it } from 'vitest'
import { calledFunction, functionSource } from './sourceCode'

const source = `// Header comment of the module.

const LIMIT = 3

function double(value: number) {
  return value * 2
}

/** Doubles the value, up to the limit. */
export function capped(value: number) {
  const result = double(value)

  return result > LIMIT ? LIMIT : result
}

/** Unrelated. */
export function other() {
  return 1
}
`

describe('functionSource', () => {
  it('returns the function with its doc comment and the helpers it uses', () => {
    expect(functionSource(source, 'capped')).toBe(`const LIMIT = 3

function double(value: number) {
  return value * 2
}

/** Doubles the value, up to the limit. */
export function capped(value: number) {
  const result = double(value)

  return result > LIMIT ? LIMIT : result
}`)
  })

  it('returns a function without helpers on its own', () => {
    expect(functionSource(source, 'other')).toBe(
      '/** Unrelated. */\nexport function other() {\n  return 1\n}',
    )
  })

  it('returns undefined for a missing function', () => {
    expect(functionSource(source, 'missing')).toBeUndefined()
  })
})

describe('calledFunction', () => {
  it('reads the function name of an example call', () => {
    expect(calledFunction("flipOver('Rika')")).toBe('flipOver')
    expect(calledFunction('getPastDay(new Date(2020, 0, 2), 1)')).toBe('getPastDay')
    expect(calledFunction('not a call')).toBeUndefined()
  })
})
