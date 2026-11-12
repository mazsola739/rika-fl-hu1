import type { Example } from '../../components/ExampleTable'
import {
  convert,
  executeforEach,
  filterArray,
  flipOver,
  formatDate,
  getArrayOfKeys,
  getPastDay,
  getTotalWeight,
  getValuePosition,
  makeListFromRange,
  mapArray,
} from './helpers'

const fruits = [
  { name: 'apple', weight: 0.5 },
  { name: 'pineapple', weight: 2 },
]

const basket = [
  { name: 'Bread', weight: 0.3 },
  { name: 'Coca-Cola', weight: 0.5 },
  { name: 'Watermelon', weight: 8 },
]

const date = new Date(2020, 0, 2)

function logged(run: (log: (value: unknown) => void) => void) {
  const lines: unknown[] = []
  run((value) => lines.push(value))
  return lines
}

export const examples: Example[] = [
  { call: "convert('1', 2, 3, '4')", actual: convert('1', 2, 3, '4'), expected: [1, '2', '3', 4] },
  {
    call: 'executeforEach([1, 2, 3], (el) => console.log(el * 2))',
    actual: logged((log) => executeforEach([1, 2, 3], (el) => log(el * 2))),
    expected: [2, 4, 6],
  },
  {
    call: "mapArray([2, '5', 8], (el) => el + 3)",
    actual: mapArray([2, '5', 8], (el) => el + 3),
    expected: [5, 8, 11],
  },
  {
    call: 'filterArray([2, 5, 8], (el) => el % 2 === 0)',
    actual: filterArray([2, 5, 8], (el) => el % 2 === 0),
    expected: [2, 8],
  },
  { call: 'getValuePosition([2, 5, 8], 8)', actual: getValuePosition([2, 5, 8], 8), expected: 3 },
  {
    call: 'getValuePosition([12, 4, 6], 1)',
    actual: getValuePosition([12, 4, 6], 1),
    expected: false,
  },
  { call: "flipOver('hey world')", actual: flipOver('hey world'), expected: 'dlrow yeh' },
  {
    call: 'makeListFromRange([2, 7])',
    actual: makeListFromRange([2, 7]),
    expected: [2, 3, 4, 5, 6, 7],
  },
  {
    call: "getArrayOfKeys(fruits, 'name')",
    actual: getArrayOfKeys(fruits, 'name'),
    expected: ['apple', 'pineapple'],
  },
  { call: 'getTotalWeight(basket)', actual: getTotalWeight(basket), expected: 8.8 },
  { call: 'getPastDay(new Date(2020, 0, 2), 1)', actual: getPastDay(date, 1), expected: 1 },
  { call: 'getPastDay(new Date(2020, 0, 2), 2)', actual: getPastDay(date, 2), expected: 31 },
  { call: 'getPastDay(new Date(2020, 0, 2), 365)', actual: getPastDay(date, 365), expected: 2 },
  {
    call: "formatDate(new Date('6/15/2019 09:15:00'))",
    actual: formatDate(new Date(2019, 5, 15, 9, 15)),
    expected: '2019/06/15 09:15',
  },
  { call: 'formatDate(new Date())', actual: formatDate(new Date()) },
]
