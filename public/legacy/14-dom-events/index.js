import {
  addPoint,
  BALL_START,
  getBallPosition,
  getCellAction,
  getCellColor,
  getCourtPoint,
  isValidPhone,
  toggleInSet,
  toPercent,
} from './logic.js'

/* Tabs: one task is shown at a time, the others keep their state. */

const tabButtons = document.querySelectorAll('.tabs__button')

function showTask(taskId) {
  for (const button of tabButtons) {
    const isActive = button.dataset.task === taskId
    button.setAttribute('aria-pressed', String(isActive))
    document.getElementById(button.dataset.task).hidden = !isActive
  }
}

for (const button of tabButtons) {
  button.addEventListener('click', () => showTask(button.dataset.task))
}

/* START TASK 1 */

const table = document.querySelector('.color-table')
const tableState = {
  selectedCells: new Set(),
  selectedRows: new Set(),
  isTableSelected: false,
}

function renderTable() {
  table.classList.toggle('color-table--green', tableState.isTableSelected)
  for (const cell of table.querySelectorAll('.color-table__cell')) {
    const td = cell.parentElement
    const rowIndex = td.parentElement.rowIndex
    const color = getCellColor({
      isCellSelected: tableState.selectedCells.has(`${rowIndex}-${td.cellIndex}`),
      isRowSelected: tableState.selectedRows.has(rowIndex),
      isTableSelected: tableState.isTableSelected,
    })
    cell.dataset.color = color
  }
}

table.addEventListener('click', (event) => {
  const cell = event.target.closest('.color-table__cell')
  if (cell === null) {
    return
  }
  const td = cell.parentElement
  const rowIndex = td.parentElement.rowIndex
  const action = getCellAction({
    column: td.cellIndex,
    isSpecial: cell.dataset.special === 'true',
  })

  if (action === 'table') {
    tableState.isTableSelected = !tableState.isTableSelected
  } else if (action === 'row') {
    tableState.selectedRows = toggleInSet(tableState.selectedRows, rowIndex)
  } else {
    tableState.selectedCells = toggleInSet(tableState.selectedCells, `${rowIndex}-${td.cellIndex}`)
  }
  renderTable()
})

renderTable()

/* END TASK 1 */

/* START TASK 2 */

const phoneForm = document.querySelector('#phone-form')
const phoneInput = document.querySelector('#phone')
const sendButton = phoneForm.querySelector('.phone-form__button')
const phoneNotification = document.querySelector('#phone-notification')

const PHONE_MESSAGE = {
  invalid: 'Type number does not follow format +380*********',
  sent: 'Data was successfully sent',
}

function showPhoneNotification(type, text) {
  phoneNotification.className = `notification notification--${type}`
  phoneNotification.textContent = text
  phoneNotification.hidden = false
}

function hidePhoneNotification() {
  phoneNotification.hidden = true
  phoneNotification.textContent = ''
}

phoneInput.addEventListener('input', () => {
  const isValid = isValidPhone(phoneInput.value)
  sendButton.disabled = !isValid
  phoneInput.classList.toggle('phone-form__input--invalid', !isValid)
  phoneInput.setAttribute('aria-invalid', String(!isValid))
  if (isValid) {
    hidePhoneNotification()
  } else {
    showPhoneNotification('error', PHONE_MESSAGE.invalid)
  }
})

phoneForm.addEventListener('submit', (event) => {
  event.preventDefault()
  if (isValidPhone(phoneInput.value)) {
    showPhoneNotification('success', PHONE_MESSAGE.sent)
  }
})

/* END TASK 2 */

/* START TASK 3 */

const NOTIFICATION_DURATION_MS = 3000
const GOAL_EVENT = 'goal'

const court = document.querySelector('#court')
const ball = document.querySelector('#ball')
const scoreAlert = document.querySelector('#score-alert')
const scoreboard = {
  A: document.querySelector('#score-A'),
  B: document.querySelector('#score-B'),
}
let scores = { A: 0, B: 0 }
let alertTimer

function placeBall(position) {
  const { left, top } = toPercent(position)
  ball.style.left = `${left}%`
  ball.style.top = `${top}%`
}

court.addEventListener('click', (event) => {
  const point = getCourtPoint(event.clientX, event.clientY, court.getBoundingClientRect())
  placeBall(getBallPosition(point))
})

// The scoring zones only announce the goal; the scoreboard reacts to the custom event.
for (const zone of court.querySelectorAll('.court__zone')) {
  zone.addEventListener('click', () => {
    zone.dispatchEvent(
      new CustomEvent(GOAL_EVENT, { bubbles: true, detail: { team: zone.dataset.team } }),
    )
  })
}

court.addEventListener(GOAL_EVENT, (event) => {
  const { team } = event.detail
  scores = addPoint(scores, team)
  scoreboard[team].textContent = String(scores[team])

  scoreAlert.textContent = `Team ${team} score!`
  scoreAlert.dataset.team = team
  scoreAlert.classList.add('score-alert--visible')
  // A new goal restarts the 3 seconds of the notification.
  clearTimeout(alertTimer)
  alertTimer = setTimeout(() => {
    scoreAlert.classList.remove('score-alert--visible')
  }, NOTIFICATION_DURATION_MS)
})

placeBall(BALL_START)

/* END TASK 3 */
