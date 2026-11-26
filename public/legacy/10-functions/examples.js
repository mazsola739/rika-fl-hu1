import {
  countPoints,
  getDivision,
  isBigger,
  isEquals,
  letterCount,
  negativeCount,
  numberToString,
  storeNames,
} from './functions.js'

const NAMES = ['Tommy Shelby', 'Ragnar Lodbrok', 'Tom Hardy']
const SCORES = ['100:90', '110:98', '100:100', '95:46', '54:90', '99:44', '90:90', '111:100']

/** The examples of the task sheet: the call as text, its result and the expected value. */
export const EXAMPLES = [
  { call: 'isEquals(3, 3)', result: isEquals(3, 3), expected: true },
  // The task sheet expects false here: that is isBigger, so both of them are shown.
  { call: 'isBigger(3, 3)', result: isBigger(3, 3), expected: false },
  { call: 'numberToString(1258)', result: numberToString(1258), expected: '1258' },
  {
    call: "storeNames('Tommy Shelby', 'Ragnar Lodbrok', 'Tom Hardy')",
    result: storeNames(...NAMES),
    expected: NAMES,
  },
  { call: 'getDivision(4, 1)', result: getDivision(4, 1), expected: 4 },
  { call: 'getDivision(2, 8)', result: getDivision(2, 8), expected: 4 },
  { call: 'negativeCount([4, 3, 2, 9])', result: negativeCount([4, 3, 2, 9]), expected: 0 },
  { call: 'negativeCount([0, -3, 5, 7])', result: negativeCount([0, -3, 5, 7]), expected: 1 },
  { call: "letterCount('Marry', 'r')", result: letterCount('Marry', 'r'), expected: 2 },
  { call: "letterCount('Barny', 'y')", result: letterCount('Barny', 'y'), expected: 1 },
  { call: "letterCount('', 'z')", result: letterCount('', 'z'), expected: 0 },
  { call: "letterCount('Rika', 'a')", result: letterCount('Rika', 'a'), expected: 1 },
  {
    call: `countPoints(['${SCORES.join("', '")}'])`,
    result: countPoints(SCORES),
    expected: 17,
  },
]
