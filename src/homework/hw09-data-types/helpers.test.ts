import { describe, expect, it } from 'vitest'
import { testExamples } from '../../test/examples'
import { examples } from './examples'
import { getArrayOfKeys, getPastDay } from './helpers'
import source from './helpers.ts?raw'

describe('examples of the task', () => {
  testExamples(examples)
})

describe('immutability', () => {
  it('getPastDay does not change the source date', () => {
    const date = new Date(2020, 0, 2)
    getPastDay(date, 10)
    expect(date.getDate()).toBe(2)
  })

  it('getArrayOfKeys does not change the source array', () => {
    const fruits = [{ name: 'apple' }]
    getArrayOfKeys(fruits, 'name')
    expect(fruits).toEqual([{ name: 'apple' }])
  })
})

describe('restriction', () => {
  it('uses no built-in array or string methods besides push and parseInt', () => {
    const code = source.replace(/\/\/.*$/gm, '')
    const forbidden =
      /\.(map|filter|forEach|reduce|find|findIndex|indexOf|includes|some|every|concat|slice|splice|reverse|join|split|replace|charAt|substring|toString)\(/
    expect(code).not.toMatch(forbidden)
  })
})
