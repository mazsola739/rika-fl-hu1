import { describe, expect, it } from 'vitest'
import { testExamples } from '../../test/examples'
import { examples } from './examples'
import { addThousandsSeparators, capitalize, getAge, howFarIs } from './helpers'

describe('examples of the task', () => {
  testExamples(examples)
})

describe('edge cases', () => {
  it('getAge counts the birthday itself as a full year', () => {
    expect(getAge(new Date(2000, 1, 29), new Date(2021, 1, 28))).toBe(20)
    expect(getAge(new Date(2000, 1, 29), new Date(2021, 2, 1))).toBe(21)
  })

  it('howFarIs rejects unknown weekdays', () => {
    expect(howFarIs('Funday')).toBe('"Funday" is not a weekday')
  })

  it('capitalize keeps apostrophes inside words', () => {
    expect(capitalize("don't stop")).toBe("Don't Stop")
  })

  it('addThousandsSeparators leaves the fraction alone', () => {
    expect(addThousandsSeparators(1234.5678)).toBe('1,234.5678')
  })
})
