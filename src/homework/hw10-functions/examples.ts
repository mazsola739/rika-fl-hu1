import type { Example } from '../../components/ExampleTable'
import {
  countPoints,
  getDivision,
  isBigger,
  isEquals,
  letterCount,
  negativeCount,
  numberToString,
  storeNames,
} from './helpers'

const scores = ['100:90', '110:98', '100:100', '95:46', '54:90', '99:44', '90:90', '111:100']

export const examples: Example[] = [
  { call: 'isEquals(3, 3)', actual: isEquals(3, 3), expected: true },
  { call: 'isBigger(3, 3)', actual: isBigger(3, 3), expected: false },
  { call: 'numberToString(1258)', actual: numberToString(1258), expected: '1258' },
  {
    call: "storeNames('Tommy Shelby', 'Ragnar Lodbrok', 'Tom Hardy')",
    actual: storeNames('Tommy Shelby', 'Ragnar Lodbrok', 'Tom Hardy'),
    expected: ['Tommy Shelby', 'Ragnar Lodbrok', 'Tom Hardy'],
  },
  { call: 'getDivision(4, 1)', actual: getDivision(4, 1), expected: 4 },
  { call: 'getDivision(2, 8)', actual: getDivision(2, 8), expected: 4 },
  { call: 'negativeCount([4, 3, 2, 9])', actual: negativeCount([4, 3, 2, 9]), expected: 0 },
  { call: 'negativeCount([0, -3, 5, 7])', actual: negativeCount([0, -3, 5, 7]), expected: 1 },
  { call: "letterCount('Marry', 'r')", actual: letterCount('Marry', 'r'), expected: 2 },
  { call: "letterCount('Barny', 'y')", actual: letterCount('Barny', 'y'), expected: 1 },
  { call: "letterCount('', 'z')", actual: letterCount('', 'z'), expected: 0 },
  { call: "letterCount('Rika', 'a')", actual: letterCount('Rika', 'a'), expected: 1 },
  { call: `countPoints(${JSON.stringify(scores)})`, actual: countPoints(scores), expected: 17 },
]
