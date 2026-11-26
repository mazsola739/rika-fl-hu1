import {
  createBatteryMessage,
  createMiddleMessage,
  INVALID_INPUT,
  isValidBatteryAmount,
  parseNumber,
} from './logic.js'

const batteryButton = document.querySelector('.js-start-batteries')
const batteryOutput = document.querySelector('.js-batteries-result')
const middleButton = document.querySelector('.js-start-middle')
const middleOutput = document.querySelector('.js-middle-result')

// The task asks for prompt() and alert(); the last answer also stays on the page.
function showResult(message, output) {
  alert(message)
  output.textContent = message
}

function runBatteryTask() {
  const amountInput = prompt('How many batteries do you have?')
  // No point in asking for the rate when the amount is already wrong.
  if (!isValidBatteryAmount(parseNumber(amountInput))) {
    showResult(INVALID_INPUT, batteryOutput)
    return
  }
  const rateInput = prompt('What percentage of the batteries are defective?')
  showResult(createBatteryMessage(amountInput, rateInput), batteryOutput)
}

function runMiddleTask() {
  const word = prompt('Type your word', 'Rika')
  showResult(createMiddleMessage(word), middleOutput)
}

batteryButton.addEventListener('click', runBatteryTask)
middleButton.addEventListener('click', runMiddleTask)
