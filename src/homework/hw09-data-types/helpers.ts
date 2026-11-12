// Restriction of the task: no built-in array, object or string methods,
// except push, length, parseInt and Date methods.

function toNumber(value: number | string) {
  return typeof value === 'string' ? Number.parseInt(value, 10) : value
}

/** 1. Strings become numbers, numbers become strings. */
export function convert(...values: (number | string)[]) {
  const result: (number | string)[] = []
  for (let i = 0; i < values.length; i++) {
    const value = values[i] as number | string
    result.push(typeof value === 'string' ? Number.parseInt(value, 10) : `${value}`)
  }
  return result
}

/** 2. Runs the callback on every element. */
export function executeforEach<T>(
  array: readonly T[],
  callback: (element: T, index: number) => void,
) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i] as T, i)
  }
}

/** 3. Maps the array; numeric strings are converted to numbers first. */
export function mapArray<R>(array: readonly (number | string)[], callback: (element: number) => R) {
  const result: R[] = []
  executeforEach(array, (element) => {
    result.push(callback(toNumber(element)))
  })
  return result
}

/** 4. Keeps the elements for which the callback returns true. */
export function filterArray<T>(array: readonly T[], callback: (element: T) => boolean) {
  const result: T[] = []
  executeforEach(array, (element) => {
    if (callback(element)) {
      result.push(element)
    }
  })
  return result
}

/** 5. Position (1-based) of the value, or false when it is missing. */
export function getValuePosition<T>(array: readonly T[], value: T) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return i + 1
    }
  }
  return false
}

/** 6. Reverses a string. */
export function flipOver(text: string) {
  let reversed = ''
  for (let i = text.length - 1; i >= 0; i--) {
    reversed += text[i]
  }
  return reversed
}

/** 7. Array from an inclusive [start, end] range. */
export function makeListFromRange([start, end]: readonly [number, number]) {
  const result: number[] = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

/** 8. Values of one key from an array of objects (the original array is not changed). */
export function getArrayOfKeys<T, K extends keyof T>(array: readonly T[], key: K) {
  const result: T[K][] = []
  executeforEach(array, (item) => {
    result.push(item[key])
  })
  return result
}

/** 9. Total weight of the basket. */
export function getTotalWeight(basket: readonly { weight: number }[]) {
  let total = 0
  executeforEach(basket, (item) => {
    total += item.weight
  })
  return total
}

/** 10. Day of the month some days before the date (the source date is not changed). */
export function getPastDay(date: Date, days: number) {
  const pastDate = new Date(date.getTime())
  pastDate.setDate(pastDate.getDate() - days)
  return pastDate.getDate()
}

function padZero(number: number) {
  return number < 10 ? `0${number}` : `${number}`
}

/** 11. Formats a date as "YYYY/MM/DD HH:mm". */
export function formatDate(date: Date) {
  const day = `${date.getFullYear()}/${padZero(date.getMonth() + 1)}/${padZero(date.getDate())}`
  return `${day} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`
}
