import type { Example } from '../../components/ExampleTable'
import {
  addThousandsSeparators,
  capitalize,
  getAge,
  getHexadecimalColors,
  getProgrammersDay,
  getWeekDay,
  howFarIs,
  isValidAudioFile,
  isValidIdentifier,
  isValidPassword,
} from './helpers'

// The examples of the task assume that today is 22 October 2020.
const exampleToday = new Date(2020, 9, 22)

export const examples: Example[] = [
  {
    call: 'getAge(new Date(2000, 9, 22)) // on 22 Oct 2020',
    actual: getAge(new Date(2000, 9, 22), exampleToday),
    expected: 20,
  },
  {
    call: 'getAge(new Date(2000, 9, 23)) // on 22 Oct 2020',
    actual: getAge(new Date(2000, 9, 23), exampleToday),
    expected: 19,
  },
  { call: 'getWeekDay(Date.now())', actual: getWeekDay(Date.now()) },
  {
    call: 'getWeekDay(new Date(2020, 9, 22))',
    actual: getWeekDay(new Date(2020, 9, 22)),
    expected: 'Thursday',
  },
  {
    call: 'getProgrammersDay(2020)',
    actual: getProgrammersDay(2020),
    expected: '12 Sep, 2020 (Saturday)',
  },
  {
    call: 'getProgrammersDay(2019)',
    actual: getProgrammersDay(2019),
    expected: '13 Sep, 2019 (Friday)',
  },
  {
    call: "howFarIs('friday') // on 22 Oct 2020",
    actual: howFarIs('friday', exampleToday),
    expected: "It's 1 day(s) left till Friday.",
  },
  {
    call: "howFarIs('Thursday') // on 22 Oct 2020",
    actual: howFarIs('Thursday', exampleToday),
    expected: 'Hey, today is Thursday =)',
  },
  { call: "isValidIdentifier('myVar!')", actual: isValidIdentifier('myVar!'), expected: false },
  { call: "isValidIdentifier('myVar$')", actual: isValidIdentifier('myVar$'), expected: true },
  { call: "isValidIdentifier('myVar_1')", actual: isValidIdentifier('myVar_1'), expected: true },
  { call: "isValidIdentifier('1_myVar')", actual: isValidIdentifier('1_myVar'), expected: false },
  {
    call: "capitalize('My name is John Smith. I am 27.')",
    actual: capitalize('My name is John Smith. I am 27.'),
    expected: 'My Name Is John Smith. I Am 27.',
  },
  { call: "isValidAudioFile('file.mp4')", actual: isValidAudioFile('file.mp4'), expected: false },
  {
    call: "isValidAudioFile('my_file.mp3')",
    actual: isValidAudioFile('my_file.mp3'),
    expected: false,
  },
  { call: "isValidAudioFile('file.mp3')", actual: isValidAudioFile('file.mp3'), expected: true },
  {
    call: "getHexadecimalColors('color: #3f3; background-color: #AA00ef; and: #abcd')",
    actual: getHexadecimalColors('color: #3f3; background-color: #AA00ef; and: #abcd'),
    expected: ['#3f3', '#AA00ef'],
  },
  {
    call: "getHexadecimalColors('red and #0000')",
    actual: getHexadecimalColors('red and #0000'),
    expected: [],
  },
  { call: "isValidPassword('agent007')", actual: isValidPassword('agent007'), expected: false },
  { call: "isValidPassword('AGENT007')", actual: isValidPassword('AGENT007'), expected: false },
  { call: "isValidPassword('AgentOOO')", actual: isValidPassword('AgentOOO'), expected: false },
  { call: "isValidPassword('Age_007')", actual: isValidPassword('Age_007'), expected: false },
  { call: "isValidPassword('Agent007')", actual: isValidPassword('Agent007'), expected: true },
  {
    call: "addThousandsSeparators('1234567890')",
    actual: addThousandsSeparators('1234567890'),
    expected: '1,234,567,890',
  },
  {
    call: 'addThousandsSeparators(1234567890)',
    actual: addThousandsSeparators(1234567890),
    expected: '1,234,567,890',
  },
]
