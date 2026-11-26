// Data types – the eleven tasks of homework 9.
// Restriction of the task: no built-in array, object or string methods,
// except push, length, parseInt and the Date methods.

const DECIMAL_RADIX = 10
const PADDING_LIMIT = 10
const MONTH_OFFSET = 1
const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]

function toNumber(value) {
  return typeof value === 'string' ? Number.parseInt(value, DECIMAL_RADIX) : value
}

/** 1. Converts strings to numbers and numbers to strings. */
export function convert(...values) {
  const converted = []
  for (let i = 0; i < values.length; i++) {
    const value = values[i]
    converted.push(typeof value === 'string' ? toNumber(value) : String(value))
  }

  return converted
}

/** 2. Runs the callback on every element of the array. */
export function executeforEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i)
  }
}

/** 3. Transforms every element with the callback; numbers in strings become numbers first. */
export function mapArray(array, callback) {
  const mapped = []
  executeforEach(array, (element) => {
    mapped.push(callback(toNumber(element)))
  })

  return mapped
}

/** 4. Keeps the elements for which the callback returns true. */
export function filterArray(array, callback) {
  const filtered = []
  executeforEach(array, (element) => {
    if (callback(element)) {
      filtered.push(element)
    }
  })

  return filtered
}

/** 5. Position (not index) of the value in the array, or false when it is missing. */
export function getValuePosition(array, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return i + 1
    }
  }

  return false
}

/** 6. Reverses the string. */
export function flipOver(text) {
  let reversed = ''
  for (let i = text.length - 1; i >= 0; i--) {
    reversed += text[i]
  }

  return reversed
}

/** 7. Array of the numbers of an inclusive [start, end] range. */
export function makeListFromRange([start, end]) {
  const list = []
  for (let number = start; number <= end; number++) {
    list.push(number)
  }

  return list
}

/** 8. Values of one key from an array of objects; the original array is not changed. */
export function getArrayOfKeys(array, key) {
  const values = []
  executeforEach(array, (item) => {
    values.push(item[key])
  })

  return values
}

/** 9. Total weight of the groceries in the basket. */
export function getTotalWeight(basket) {
  let totalWeight = 0
  executeforEach(basket, (item) => {
    totalWeight += item.weight
  })

  return totalWeight
}

function getDateBefore(date, days) {
  // A copy, so the source date is not changed.
  const pastDate = new Date(date.getTime())
  pastDate.setDate(pastDate.getDate() - days)

  return pastDate
}

/** 10. Day of the month some days before the date; the source date is not changed. */
export function getPastDay(date, days) {
  return getDateBefore(date, days).getDate()
}

/** 10. Rika's diligent extra: the exact look of the task example, e.g. "31, (31 Dec 2019)". */
export function describePastDay(date, days) {
  const pastDate = getDateBefore(date, days)
  const day = pastDate.getDate()
  const month = SHORT_MONTH_NAMES[pastDate.getMonth()]

  return `${day}, (${day} ${month} ${pastDate.getFullYear()})`
}

function padZero(number) {
  return number < PADDING_LIMIT ? `0${number}` : String(number)
}

/** 11. Formats the date as "YYYY/MM/DD HH:mm". */
export function formatDate(date) {
  const year = date.getFullYear()
  const month = padZero(date.getMonth() + MONTH_OFFSET)
  const day = padZero(date.getDate())
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())

  return `${year}/${month}/${day} ${hours}:${minutes}`
}
