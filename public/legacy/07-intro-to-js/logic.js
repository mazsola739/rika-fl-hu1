const PERCENT = 100
const DECIMAL_PLACES = 2
const HALF = 2

export const INVALID_INPUT = 'Invalid input data'
export const INVALID_VALUE = 'Invalid value'
export const SAME_MIDDLE = 'Middle characters are the same'

/** Parses a prompt() answer; `null` for cancel, empty or non-numeric input. */
export function parseNumber(input) {
  if (input === null || input.trim() === '') {
    return null
  }
  const number = Number(input)

  return Number.isFinite(number) ? number : null
}

/** An amount of batteries can't be negative. */
export function isValidBatteryAmount(amount) {
  return amount !== null && amount >= 0
}

/** A defective rate is a percentage between 0 and 100. */
export function isValidDefectiveRate(rate) {
  return rate !== null && rate >= 0 && rate <= PERCENT
}

// Number() after toFixed() drops the trailing zeros: 2 numbers after the comma only if needed.
function roundToCents(value) {
  return Number(value.toFixed(DECIMAL_PLACES))
}

/** Splits the batteries into defective and working ones. */
export function calcBatteries(amount, rate) {
  const defective = (amount * rate) / PERCENT

  return {
    amount,
    rate,
    defective: roundToCents(defective),
    working: roundToCents(amount - defective),
  }
}

/** Runs task 1 on the two prompt() answers and returns the alert() message. */
export function createBatteryMessage(amountInput, rateInput) {
  const amount = parseNumber(amountInput)
  const rate = parseNumber(rateInput)
  if (!isValidBatteryAmount(amount) || !isValidDefectiveRate(rate)) {
    return INVALID_INPUT
  }
  const { defective, working } = calcBatteries(amount, rate)

  return [
    'Rika calculated for you that:',
    `Amount of batteries: ${amount}`,
    `Defective rate: ${rate}%`,
    `Amount of defective batteries: ${defective}`,
    `Amount of working batteries: ${working}`,
  ].join('\n')
}

/** Middle character of an odd word, middle two characters of an even one. */
export function getMiddle(input) {
  const word = (input ?? '').trim()
  if (word === '') {
    return INVALID_VALUE
  }
  const middleIndex = Math.floor(word.length / HALF)
  if (word.length % HALF !== 0) {
    return word.charAt(middleIndex)
  }
  const middle = word.slice(middleIndex - 1, middleIndex + 1)

  return middle.charAt(0) === middle.charAt(1) ? SAME_MIDDLE : middle
}

/** Runs task 2 on the prompt() answer and returns the alert() message. */
export function createMiddleMessage(input) {
  const result = getMiddle(input)
  if (result === INVALID_VALUE || result === SAME_MIDDLE) {
    return result
  }

  return `Rika checked it for you!\nThe middle of "${input.trim()}" is: ${result}`
}
