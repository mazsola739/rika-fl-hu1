/** A user error in the expression: its message is shown to the user. */
export class ExpressionError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ExpressionError'
  }
}

// A number (12, 1.5, .5) or one operator / bracket, after optional whitespace.
const TOKEN = /\s*(?:(\d+(?:\.\d+)?|\.\d+)|([-+*/()]))/y
// Rounds away floating point noise like 0.1 + 0.2 = 0.30000000000000004.
const SIGNIFICANT_DIGITS = 12

/** Splits the expression into numbers and operator strings. */
export function tokenize(expression) {
  const tokens = []
  TOKEN.lastIndex = 0
  while (expression.slice(TOKEN.lastIndex).trim() !== '') {
    const start = TOKEN.lastIndex
    const match = TOKEN.exec(expression)
    if (match === null) {
      throw new ExpressionError(`Unexpected character "${expression.slice(start).trim()[0]}"`)
    }
    tokens.push(match[1] === undefined ? match[2] : Number(match[1]))
  }

  return tokens
}

/**
 * Evaluates + - * / with brackets and unary signs, without eval(). Recursive descent:
 * expression = term (("+" | "-") term)*, term = factor (("*" | "/") factor)*,
 * factor = number | ("+" | "-") factor | "(" expression ")"
 */
export function evaluate(expression) {
  const tokens = tokenize(expression)
  if (tokens.length === 0) {
    throw new ExpressionError('The expression is empty')
  }

  let position = 0

  function peek() {
    return tokens[position]
  }

  function next() {
    position += 1

    return tokens[position - 1]
  }

  function parseFactor() {
    const token = next()
    if (typeof token === 'number') {
      return token
    }
    if (token === '-') {
      return -parseFactor()
    }
    if (token === '+') {
      return parseFactor()
    }
    if (token === '(') {
      const value = parseExpression()
      if (next() !== ')') {
        throw new ExpressionError('A closing bracket is missing')
      }

      return value
    }
    if (token === undefined) {
      throw new ExpressionError('The expression is incomplete')
    }
    throw new ExpressionError(`Unexpected "${token}"`)
  }

  function parseTerm() {
    let value = parseFactor()
    while (peek() === '*' || peek() === '/') {
      value = next() === '*' ? value * parseFactor() : value / parseFactor()
    }

    return value
  }

  function parseExpression() {
    let value = parseTerm()
    while (peek() === '+' || peek() === '-') {
      value = next() === '+' ? value + parseTerm() : value - parseTerm()
    }

    return value
  }

  const result = parseExpression()
  if (position < tokens.length) {
    throw new ExpressionError(`Unexpected "${peek()}"`)
  }
  if (Number.isNaN(result)) {
    throw new ExpressionError('The result is not a number (NaN)')
  }
  if (!Number.isFinite(result)) {
    throw new ExpressionError('Division by zero')
  }

  return Number(result.toPrecision(SIGNIFICANT_DIGITS))
}

/** The text of the alert for the entered expression and whether it was valid. */
export function calculate(input) {
  const expression = input.trim()
  // Easter egg: some things cannot be calculated.
  if (expression.toLowerCase() === 'rika') {
    return { isValid: true, message: 'Rika = priceless ✨' }
  }
  try {
    return { isValid: true, message: `${expression} = ${evaluate(expression)}` }
  } catch (error) {
    if (error instanceof ExpressionError) {
      return { isValid: false, message: `Invalid expression: ${error.message}. Please try again.` }
    }
    throw error
  }
}
