// Restriction of the task: the Math object must not be used.

const POINTS_FOR_WIN = 3
const POINTS_FOR_DRAW = 1
const SCORE_SEPARATOR = ':'

/** Task 1: strict equality of two values. */
export function isEquals(first, second) {
  return first === second
}

/** The example of task 1 checks this one; tasks 4 and 7 reuse it. */
export function isBigger(first, second) {
  return first > second
}

/** Task 2: a number as a string. */
export function numberToString(number) {
  return String(number)
}

/** Task 3: any number of names collected into an array. */
export function storeNames(...names) {
  return names
}

/** Task 4: the bigger number divided by the smaller one, so the result is never below 1. */
export function getDivision(first, second) {
  if (isBigger(second, first)) {
    return second / first
  }

  return first / second
}

/** Task 5: how many negative numbers the array has. */
export function negativeCount(numbers) {
  let count = 0
  for (const number of numbers) {
    if (number < 0) {
      count += 1
    }
  }

  return count
}

/** Task 6: how many times the letter occurs in the text. */
export function letterCount(text, letter) {
  let count = 0
  for (const character of text) {
    if (character === letter) {
      count += 1
    }
  }

  return count
}

/** Task 7: championship points from "ours:theirs" scores – win 3, draw 1, loss 0. */
export function countPoints(scores) {
  let points = 0
  for (const score of scores) {
    const [ours, theirs] = score.split(SCORE_SEPARATOR).map(Number)
    if (isBigger(ours, theirs)) {
      points += POINTS_FOR_WIN
    } else if (isEquals(ours, theirs)) {
      points += POINTS_FOR_DRAW
    }
  }

  return points
}
