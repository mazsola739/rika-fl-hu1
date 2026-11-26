import { getAge, getProgrammersDay, getWeekDay, howFarIs } from './dates.js'
import {
  addThousandsSeparators,
  capitalize,
  getHexadecimalColors,
  isValidAudioFile,
  isValidIdentifier,
  isValidPassword,
} from './validators.js'

// The examples of the task sheet assume that today is 22 October 2020.
const EXAMPLE_TODAY = new Date(2020, 9, 22)
// The deadline of Rika's very first Front-end Lab homework (HW01).
const RIKAS_FIRST_DEADLINE = new Date(2021, 2, 8)
const TEST_SENTENCE = 'My name is John Smith. I am 27.'
const TEST_COLORS = 'color: #3f3; background-color: #AA00ef; and: #abcd'

/**
 * The call as text, its result and the expected value. Rows without `expected` depend on the
 * real date, so they cannot be checked.
 */
export function createExamples(today = new Date()) {
  return [
    {
      call: 'getAge(new Date(2000, 9, 22)) // on 22 Oct 2020',
      result: getAge(new Date(2000, 9, 22), EXAMPLE_TODAY),
      expected: 20,
    },
    {
      call: 'getAge(new Date(2000, 9, 23)) // on 22 Oct 2020',
      result: getAge(new Date(2000, 9, 23), EXAMPLE_TODAY),
      expected: 19,
    },
    {
      call: "getAge(new Date(2021, 2, 8)) // the age of Rika's first homework",
      result: getAge(RIKAS_FIRST_DEADLINE, today),
    },
    { call: 'getWeekDay(Date.now())', result: getWeekDay(today.getTime()) },
    {
      call: 'getWeekDay(new Date(2020, 9, 22))',
      result: getWeekDay(new Date(2020, 9, 22)),
      expected: 'Thursday',
    },
    {
      call: "getWeekDay(new Date(2021, 2, 8)) // Rika's first deadline",
      result: getWeekDay(RIKAS_FIRST_DEADLINE),
      expected: 'Monday',
    },
    {
      call: 'getProgrammersDay(2020)',
      result: getProgrammersDay(2020),
      expected: '12 Sep, 2020 (Saturday)',
    },
    {
      call: 'getProgrammersDay(2019)',
      result: getProgrammersDay(2019),
      expected: '13 Sep, 2019 (Friday)',
    },
    {
      call: "getProgrammersDay(2021) // in Rika's Front-end Lab year",
      result: getProgrammersDay(2021),
      expected: '13 Sep, 2021 (Monday)',
    },
    {
      call: "howFarIs('friday') // on 22 Oct 2020",
      result: howFarIs('friday', EXAMPLE_TODAY),
      expected: "It's 1 day(s) left till Friday.",
    },
    {
      call: "howFarIs('Thursday') // on 22 Oct 2020",
      result: howFarIs('Thursday', EXAMPLE_TODAY),
      expected: 'Hey, today is Thursday =)',
    },
    { call: "howFarIs('sunday') // today", result: howFarIs('sunday', today) },
    { call: "isValidIdentifier('myVar!')", result: isValidIdentifier('myVar!'), expected: false },
    { call: "isValidIdentifier('myVar$')", result: isValidIdentifier('myVar$'), expected: true },
    { call: "isValidIdentifier('myVar_1')", result: isValidIdentifier('myVar_1'), expected: true },
    { call: "isValidIdentifier('1_myVar')", result: isValidIdentifier('1_myVar'), expected: false },
    {
      call: `capitalize('${TEST_SENTENCE}')`,
      result: capitalize(TEST_SENTENCE),
      expected: 'My Name Is John Smith. I Am 27.',
    },
    { call: "isValidAudioFile('file.mp4')", result: isValidAudioFile('file.mp4'), expected: false },
    {
      call: "isValidAudioFile('my_file.mp3')",
      result: isValidAudioFile('my_file.mp3'),
      expected: false,
    },
    { call: "isValidAudioFile('file.mp3')", result: isValidAudioFile('file.mp3'), expected: true },
    {
      call: `getHexadecimalColors('${TEST_COLORS}')`,
      result: getHexadecimalColors(TEST_COLORS),
      expected: ['#3f3', '#AA00ef'],
    },
    {
      call: "getHexadecimalColors('red and #0000')",
      result: getHexadecimalColors('red and #0000'),
      expected: [],
    },
    { call: "isValidPassword('agent007')", result: isValidPassword('agent007'), expected: false },
    { call: "isValidPassword('AGENT007')", result: isValidPassword('AGENT007'), expected: false },
    { call: "isValidPassword('AgentOOO')", result: isValidPassword('AgentOOO'), expected: false },
    { call: "isValidPassword('Age_007')", result: isValidPassword('Age_007'), expected: false },
    { call: "isValidPassword('Agent007')", result: isValidPassword('Agent007'), expected: true },
    {
      call: "addThousandsSeparators('1234567890')",
      result: addThousandsSeparators('1234567890'),
      expected: '1,234,567,890',
    },
    {
      call: 'addThousandsSeparators(1234567890)',
      result: addThousandsSeparators(1234567890),
      expected: '1,234,567,890',
    },
  ]
}
