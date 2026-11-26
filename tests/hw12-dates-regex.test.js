import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getAge,
  getProgrammersDay,
  getWeekDay,
  howFarIs,
} from '../public/legacy/12-dates-regex/dates.js'
import { createExamples } from '../public/legacy/12-dates-regex/examples.js'
import {
  addThousandsSeparators,
  capitalize,
  getHexadecimalColors,
  isValidAudioFile,
  isValidIdentifier,
  isValidPassword,
} from '../public/legacy/12-dates-regex/validators.js'

// The task sheet's "today": Thursday, 22 October 2020.
const TASK_TODAY = new Date(2020, 9, 22, 12)

describe('with today fixed to 22 October 2020', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(TASK_TODAY)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('getAge counts full years until today', () => {
    expect(getAge(new Date(2000, 9, 22))).toBe(20)
    expect(getAge(new Date(2000, 9, 23))).toBe(19)
    expect(getAge(new Date(2000, 1, 7))).toBe(20)
  })

  it('getWeekDay works with Date.now()', () => {
    expect(getWeekDay(Date.now())).toBe('Thursday')
  })

  it('howFarIs counts the days to the next weekday', () => {
    expect(howFarIs('friday')).toBe("It's 1 day(s) left till Friday.")
    expect(howFarIs('Thursday')).toBe('Hey, today is Thursday =)')
    expect(howFarIs('WEDNESDAY')).toBe("It's 6 day(s) left till Wednesday.")
    expect(howFarIs(' sunday ')).toBe("It's 3 day(s) left till Sunday.")
  })

  it('every example on the page matches its expected value', () => {
    for (const example of createExamples()) {
      if ('expected' in example) {
        expect(example.result, example.call).toEqual(example.expected)
      }
    }
  })
})

describe('getAge', () => {
  it('takes the birthday itself as a full year', () => {
    expect(getAge(new Date(2000, 1, 29), new Date(2021, 1, 28))).toBe(20)
    expect(getAge(new Date(2000, 1, 29), new Date(2021, 2, 1))).toBe(21)
    expect(getAge(new Date(2000, 5, 15), new Date(2020, 5, 15))).toBe(20)
    expect(getAge(new Date(2000, 5, 15), new Date(2020, 5, 14))).toBe(19)
  })
})

describe('getWeekDay', () => {
  it('accepts a date and a timestamp', () => {
    expect(getWeekDay(new Date(2020, 9, 22))).toBe('Thursday')
    expect(getWeekDay(new Date(2021, 2, 8).getTime())).toBe('Monday')
  })
})

describe('getProgrammersDay', () => {
  it.each([
    [2020, '12 Sep, 2020 (Saturday)'],
    [2019, '13 Sep, 2019 (Friday)'],
    [2000, '12 Sep, 2000 (Tuesday)'],
    [1900, '13 Sep, 1900 (Thursday)'],
    [2021, '13 Sep, 2021 (Monday)'],
  ])('%i → %s', (year, expected) => {
    expect(getProgrammersDay(year)).toBe(expected)
  })
})

describe('howFarIs', () => {
  it('rejects an unknown weekday', () => {
    expect(howFarIs('Funday', TASK_TODAY)).toBe('"Funday" is not a weekday')
  })
})

describe('isValidIdentifier', () => {
  it.each([
    ['myVar!', false],
    ['myVar$', true],
    ['myVar_1', true],
    ['1_myVar', false],
    ['$', true],
    ['_rika', true],
    ['', false],
    ['my var', false],
  ])('%j → %s', (name, expected) => {
    expect(isValidIdentifier(name)).toBe(expected)
  })
})

describe('capitalize', () => {
  it('capitalizes the first letter of every word', () => {
    expect(capitalize('My name is John Smith. I am 27.')).toBe('My Name Is John Smith. I Am 27.')
    expect(capitalize("hello, i'm rika")).toBe("Hello, I'm Rika")
    expect(capitalize('  two  spaces')).toBe('  Two  Spaces')
  })
})

describe('isValidAudioFile', () => {
  it.each([
    ['file.mp4', false],
    ['my_file.mp3', false],
    ['file.mp3', true],
    ['Song.flac', true],
    ['song.alac', true],
    ['song.aac', true],
    ['.mp3', false],
    ['song.mp3.exe', false],
    ['song1.mp3', false],
  ])('%j → %s', (fileName, expected) => {
    expect(isValidAudioFile(fileName)).toBe(expected)
  })
})

describe('getHexadecimalColors', () => {
  it('extracts the 3 and 6 digit colors only', () => {
    expect(getHexadecimalColors('color: #3f3; background-color: #AA00ef; and: #abcd')).toEqual([
      '#3f3',
      '#AA00ef',
    ])
    expect(getHexadecimalColors('red and #0000')).toEqual([])
    expect(getHexadecimalColors('#abcdefa #fff,#000000')).toEqual(['#fff', '#000000'])
    expect(getHexadecimalColors('no colors')).toEqual([])
  })
})

describe('isValidPassword', () => {
  it.each([
    ['agent007', false],
    ['AGENT007', false],
    ['AgentOOO', false],
    ['Age_007', false],
    ['Agent007', true],
    ['Rika2021', true],
  ])('%j → %s', (password, expected) => {
    expect(isValidPassword(password)).toBe(expected)
  })
})

describe('addThousandsSeparators', () => {
  it.each([
    ['1234567890', '1,234,567,890'],
    [1234567890, '1,234,567,890'],
    [123, '123'],
    [1000, '1,000'],
    [-1234567, '-1,234,567'],
    [1234.5678, '1,234.5678'],
  ])('%j → %s', (value, expected) => {
    expect(addThousandsSeparators(value)).toBe(expected)
  })
})
