import {
  convert,
  describePastDay,
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
} from './index.js'

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

// executeforEach returns nothing, so the example collects what it would log.
function collectLogs(run) {
  const logs = []
  run((value) => logs.push(value))

  return logs
}

const examples = [
  { call: "convert('1', 2, 3, '4')", actual: convert('1', 2, 3, '4'), expected: [1, '2', '3', 4] },
  {
    call: 'executeforEach([1, 2, 3], (el) => console.log(el * 2))',
    actual: collectLogs((log) => executeforEach([1, 2, 3], (el) => log(el * 2))),
    expected: [2, 4, 6],
    note: 'Logged values',
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
  { call: "flipOver('Rika')", actual: flipOver('Rika'), expected: 'akiR' },
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
  { call: 'getPastDay(date, 1)', actual: getPastDay(date, 1), expected: 1 },
  { call: 'getPastDay(date, 2)', actual: getPastDay(date, 2), expected: 31 },
  { call: 'getPastDay(date, 365)', actual: getPastDay(date, 365), expected: 2 },
  {
    call: 'describePastDay(date, 2)',
    actual: describePastDay(date, 2),
    expected: '31, (31 Dec 2019)',
    note: "Rika's extra: the exact look of the task example",
  },
  {
    call: "formatDate(new Date('6/15/2019 09:15:00'))",
    actual: formatDate(new Date(2019, 5, 15, 9, 15)),
    expected: '2019/06/15 09:15',
    note: 'The task sheet says 2018 – time travel is still impossible, so Rika fixed the typo',
  },
  { call: 'formatDate(new Date())', actual: formatDate(new Date()), note: 'Current local time' },
]

// Writes values the way they look in the code: [1, '2', '3', 4]
function formatValue(value) {
  if (typeof value === 'string') {
    return `'${value}'`
  }
  if (!Array.isArray(value)) {
    return String(value)
  }
  let text = ''
  for (let i = 0; i < value.length; i++) {
    text += i === 0 ? formatValue(value[i]) : `, ${formatValue(value[i])}`
  }

  return `[${text}]`
}

function createCell(tagName, text, className) {
  const cell = document.createElement(tagName)
  cell.textContent = text
  if (className) {
    cell.className = className
  }

  return cell
}

function createCallCell({ call, note }) {
  const cell = document.createElement('th')
  cell.scope = 'row'
  cell.append(createCell('code', call))
  if (note) {
    cell.append(createCell('small', note, 'note'))
  }

  return cell
}

function createRow(example) {
  const hasExpected = 'expected' in example
  const result = formatValue(example.actual)
  const expected = hasExpected ? formatValue(example.expected) : '–'
  const isPassing = !hasExpected || result === expected

  const row = document.createElement('tr')
  row.append(
    createCallCell(example),
    createCell('td', result, isPassing ? 'result' : 'result result-failing'),
    createCell('td', expected),
  )

  return row
}

function renderExamples() {
  const tableBody = document.querySelector('.js-results')
  const rows = []
  for (const example of examples) {
    rows.push(createRow(example))
  }
  tableBody.replaceChildren(...rows)
}

renderExamples()
