export class ExpressionError extends Error {
  override name = 'ExpressionError'
}

type Token = number | '+' | '-' | '*' | '/' | '(' | ')'

const SIGNIFICANT_DIGITS = 12
const TOKEN_PATTERN = /\s*(?:(\d+(?:\.\d+)?|\.\d+)|([-+*/()]))/y

function tokenize(expression: string): Token[] {
  const tokens: Token[] = []
  TOKEN_PATTERN.lastIndex = 0

  while (TOKEN_PATTERN.lastIndex < expression.length) {
    const start = TOKEN_PATTERN.lastIndex
    const match = TOKEN_PATTERN.exec(expression)

    if (!match) {
      const rest = expression.slice(start).trim()
      if (rest === '') {
        break
      }
      throw new ExpressionError(`Unexpected character "${rest[0]}"`)
    }

    tokens.push(match[1] === undefined ? (match[2] as Token) : Number(match[1]))
  }

  return tokens
}

/**
 * Evaluates + - * / with brackets and unary minus, without eval().
 * Recursive descent: expression = term (("+" | "-") term)*, term = factor (("*" | "/") factor)*
 */
export function evaluate(expression: string) {
  const tokens = tokenize(expression)
  let position = 0

  if (tokens.length === 0) {
    throw new ExpressionError('The expression is empty')
  }

  const peek = () => tokens[position]
  const next = () => tokens[position++]

  function parseFactor(): number {
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
        throw new ExpressionError('Missing closing bracket')
      }
      return value
    }
    throw new ExpressionError(
      token === undefined ? 'The expression is incomplete' : `Unexpected "${token}"`,
    )
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
  if (!Number.isFinite(result)) {
    throw new ExpressionError('The result is not a number (e.g. 0/0 or division by zero)')
  }

  return Number(result.toPrecision(SIGNIFICANT_DIGITS))
}
