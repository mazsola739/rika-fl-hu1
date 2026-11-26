import { calculate } from './expression.js'

const TITLE = "Rika's CALCULATOR"
const PROMPT_TEXT = `${TITLE}\nType your expression below`
const DEFAULT_EXPRESSION = '2 + 3 * (4 - 1)'

/** Asks until a valid expression is entered or the prompt is cancelled; returns the last message. */
function runCalculator() {
  let input = prompt(PROMPT_TEXT, DEFAULT_EXPRESSION)
  while (input !== null) {
    const { isValid, message } = calculate(input)
    alert(`${TITLE}\n${message}`)
    if (isValid) {
      return message
    }
    input = prompt(PROMPT_TEXT, input)
  }

  return 'The calculator was closed.'
}

function setUpCalculator() {
  const result = document.querySelector('.calculator-result')
  document.querySelector('.start-calculator').addEventListener('click', () => {
    result.value = runCalculator()
  })
}

setUpCalculator()
