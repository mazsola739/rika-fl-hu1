import { describe, expect, it } from 'vitest'
import { testExamples } from '../../test/examples'
import { examples } from './examples'
import source from './helpers.ts?raw'

describe('examples of the task', () => {
  testExamples(examples)
})

describe('restriction', () => {
  it('does not use the Math object', () => {
    expect(source.replace(/\/\/.*$/gm, '')).not.toMatch(/\bMath\./)
  })
})
