import { EXAMPLES } from './examples.js'

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

function createRow({ call, result, expected }) {
  const row = document.createElement('tr')
  const isCorrect = formatValue(result) === formatValue(expected)
  const status = document.createElement('td')
  status.textContent = isCorrect ? '✓' : '✗'
  status.className = isCorrect ? 'status status--pass' : 'status status--fail'
  row.append(createCodeCell(call), createCodeCell(formatValue(result)), status)

  return row
}

function renderExamples() {
  const tableBody = document.querySelector('.results tbody')
  tableBody.replaceChildren(...EXAMPLES.map(createRow))
}

renderExamples()
