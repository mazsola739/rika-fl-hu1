import { createExamples } from './examples.js'
import {
  addThousandsSeparators,
  capitalize,
  getHexadecimalColors,
  isValidAudioFile,
  isValidIdentifier,
  isValidPassword,
} from './validators.js'

const VALIDATORS = {
  isValidIdentifier,
  capitalize,
  isValidAudioFile,
  getHexadecimalColors,
  isValidPassword,
  addThousandsSeparators,
}

/** Shows a value the way it would be written in code: strings quoted, arrays in brackets. */
function formatValue(value) {
  if (Array.isArray(value)) {
    return `[${value.map(formatValue).join(', ')}]`
  }
  if (typeof value === 'string') {
    return `'${value}'`
  }

  return String(value)
}

function createCodeCell(text) {
  const cell = document.createElement('td')
  const code = document.createElement('code')
  code.textContent = text
  cell.append(code)

  return cell
}

function createStatusCell(example) {
  const cell = document.createElement('td')
  cell.className = 'status'
  if (!('expected' in example)) {
    // Depends on the real date, nothing to compare with.
    cell.textContent = '–'

    return cell
  }

  const isCorrect = formatValue(example.result) === formatValue(example.expected)
  cell.textContent = isCorrect ? '✓' : '✗'
  cell.classList.add(isCorrect ? 'status--pass' : 'status--fail')

  return cell
}

function createRow(example) {
  const row = document.createElement('tr')
  row.append(
    createCodeCell(example.call),
    createCodeCell(formatValue(example.result)),
    createStatusCell(example),
  )

  return row
}

function renderExamples() {
  const tableBody = document.querySelector('.results tbody')
  tableBody.replaceChildren(...createExamples().map(createRow))
}

function updatePlayground(form) {
  const validatorName = form.elements.validator.value
  const input = form.elements.input.value
  const result = VALIDATORS[validatorName](input)
  form.querySelector('.playground__call').textContent = `${validatorName}('${input}')`
  form.elements.result.value = formatValue(result)
}

function setUpPlayground() {
  const form = document.querySelector('.playground')
  form.addEventListener('input', () => updatePlayground(form))
  form.addEventListener('submit', (event) => event.preventDefault())
  updatePlayground(form)
}

renderExamples()
setUpPlayground()
