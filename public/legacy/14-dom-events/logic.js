/* Pure logic of the three tasks: no DOM here, so it can be tested on its own. */

/* Task 1: table */

export const CELL_COLOR = {
  yellow: 'yellow',
  blue: 'blue',
  green: 'green',
  white: 'white',
}

/** Priority of the colors: yellow (cell) > blue (row) > green (table) > white. */
export function getCellColor({ isCellSelected, isRowSelected, isTableSelected }) {
  if (isCellSelected) {
    return CELL_COLOR.yellow
  }
  if (isRowSelected) {
    return CELL_COLOR.blue
  }

  return isTableSelected ? CELL_COLOR.green : CELL_COLOR.white
}

/** What a click on a cell toggles: the whole table, the row (first column) or the cell. */
export function getCellAction({ column, isSpecial }) {
  if (isSpecial) {
    return 'table'
  }

  return column === 0 ? 'row' : 'cell'
}

/** Returns a new set with the value added, or removed when it was already there. */
export function toggleInSet(set, value) {
  const next = new Set(set)
  if (next.has(value)) {
    next.delete(value)
  } else {
    next.add(value)
  }

  return next
}

/* Task 2: phone number */

const PHONE_PATTERN = /^\+380\d{9}$/

/** A valid number is +380 followed by exactly nine digits. */
export function isValidPhone(value) {
  return PHONE_PATTERN.test(value.trim())
}

/* Task 3: basketball */

const COURT_WIDTH = 600
const COURT_HEIGHT = 330
const BALL_SIZE = 40
const PERCENT = 100

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Converts a click in a (possibly scaled down) court to the 600×330 court coordinates.
 * `rect` is the court's bounding rectangle on the screen.
 */
export function getCourtPoint(clientX, clientY, rect) {
  return {
    x: ((clientX - rect.left) * COURT_WIDTH) / rect.width,
    y: ((clientY - rect.top) * COURT_HEIGHT) / rect.height,
  }
}

/** The top-left corner of the ball centred on the point, kept inside the court. */
export function getBallPosition({ x, y }) {
  const half = BALL_SIZE / 2

  return {
    left: clamp(x - half, 0, COURT_WIDTH - BALL_SIZE),
    top: clamp(y - half, 0, COURT_HEIGHT - BALL_SIZE),
  }
}

/** Court coordinates as percentages, so the ball stays in place when the court scales. */
export function toPercent({ left, top }) {
  return {
    left: (left / COURT_WIDTH) * PERCENT,
    top: (top / COURT_HEIGHT) * PERCENT,
  }
}

/** The ball's starting position: the centre of the court. */
export const BALL_START = getBallPosition({ x: COURT_WIDTH / 2, y: COURT_HEIGHT / 2 })

/** Returns a new scoreboard with one more point for the team. */
export function addPoint(scores, team) {
  return { ...scores, [team]: scores[team] + 1 }
}
