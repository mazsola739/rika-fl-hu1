import { describe, expect, it } from 'vitest'
import {
  addPoint,
  BALL_START,
  CELL_COLOR,
  getBallPosition,
  getCellAction,
  getCellColor,
  getCourtPoint,
  isValidPhone,
  toggleInSet,
  toPercent,
} from '../public/legacy/14-dom-events/logic.js'

describe('HW14 task 1: color table', () => {
  it('keeps the priority yellow > blue > green > white', () => {
    const all = { isCellSelected: true, isRowSelected: true, isTableSelected: true }
    expect(getCellColor(all)).toBe(CELL_COLOR.yellow)
    expect(getCellColor({ ...all, isCellSelected: false })).toBe(CELL_COLOR.blue)
    expect(
      getCellColor({ isCellSelected: false, isRowSelected: false, isTableSelected: true }),
    ).toBe(CELL_COLOR.green)
    expect(
      getCellColor({ isCellSelected: false, isRowSelected: false, isTableSelected: false }),
    ).toBe(CELL_COLOR.white)
  })

  it('toggles the table on the special cell, the row in the first column, else the cell', () => {
    expect(getCellAction({ column: 1, isSpecial: true })).toBe('table')
    expect(getCellAction({ column: 0, isSpecial: false })).toBe('row')
    expect(getCellAction({ column: 2, isSpecial: false })).toBe('cell')
  })

  it('toggles a value in a new set', () => {
    const selected = toggleInSet(new Set(), '0-1')
    expect(selected.has('0-1')).toBe(true)
    expect(toggleInSet(selected, '0-1').has('0-1')).toBe(false)
  })
})

describe('HW14 task 2: phone validation', () => {
  it.each(['+380123456789', ' +380987654321 '])('accepts %j', (value) => {
    expect(isValidPhone(value)).toBe(true)
  })

  it.each([
    '',
    '+38012345678',
    '+3801234567890',
    '380123456789',
    '+381123456789',
    '+380 12 345 67 89',
    '+38012345678a',
  ])('rejects %j', (value) => {
    expect(isValidPhone(value)).toBe(false)
  })
})

describe('HW14 task 3: basketball', () => {
  it('starts the ball in the centre of the 600×330 court', () => {
    expect(BALL_START).toEqual({ left: 280, top: 145 })
  })

  it('centres the ball on the click and keeps it inside the court', () => {
    expect(getBallPosition({ x: 100, y: 50 })).toEqual({ left: 80, top: 30 })
    expect(getBallPosition({ x: 5, y: 5 })).toEqual({ left: 0, top: 0 })
    expect(getBallPosition({ x: 600, y: 330 })).toEqual({ left: 560, top: 290 })
  })

  it('maps a click on a scaled down court to court coordinates', () => {
    const rect = { left: 10, top: 20, width: 300, height: 165 }
    expect(getCourtPoint(160, 102.5, rect)).toEqual({ x: 300, y: 165 })
  })

  it('converts court coordinates to percentages', () => {
    expect(toPercent({ left: 300, top: 165 })).toEqual({ left: 50, top: 50 })
  })

  it('adds a point to the scoring team only', () => {
    const scores = { A: 0, B: 0 }
    expect(addPoint(scores, 'B')).toEqual({ A: 0, B: 1 })
    expect(scores).toEqual({ A: 0, B: 0 })
  })
})
