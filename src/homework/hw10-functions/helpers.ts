// Restriction of the task: the Math object must not be used.

const POINTS_FOR_WIN = 3
const POINTS_FOR_DRAW = 1

/** 1. Strict equality check. */
export function isEquals(a: unknown, b: unknown) {
  return a === b
}

/** Helper used by tasks 4 and 7. */
export function isBigger(a: number, b: number) {
  return a > b
}

/** 2. Number to string. */
export function numberToString(number: number) {
  return `${number}`
}

/** 3. Any number of names collected into an array. */
export function storeNames(...names: string[]) {
  return names
}

/** 4. The bigger number divided by the smaller one, so the result is never below 1. */
export function getDivision(a: number, b: number) {
  return isBigger(b, a) ? b / a : a / b
}

/** 5. Count of negative numbers. */
export function negativeCount(numbers: readonly number[]) {
  let count = 0
  for (const number of numbers) {
    if (number < 0) {
      count++
    }
  }
  return count
}

/** 6. How many times the letter appears in the text. */
export function letterCount(text: string, letter: string) {
  let count = 0
  for (const character of text) {
    if (character === letter) {
      count++
    }
  }
  return count
}

/** 7. Championship points from "ours:theirs" scores: win 3, draw 1, loss 0. */
export function countPoints(scores: readonly string[]) {
  let points = 0
  for (const score of scores) {
    const [ours = 0, theirs = 0] = score.split(':').map(Number)
    if (isBigger(ours, theirs)) {
      points += POINTS_FOR_WIN
    } else if (isEquals(ours, theirs)) {
      points += POINTS_FOR_DRAW
    }
  }
  return points
}
