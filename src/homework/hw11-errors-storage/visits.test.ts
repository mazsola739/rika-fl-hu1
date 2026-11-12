import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY, viewResults, visitLink } from './visits'

describe('page visits', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('counts every click and resets after viewing the results', () => {
    visitLink('Page1')
    visitLink('Page1')
    visitLink('Page3')

    expect(viewResults()).toEqual([
      'You visited Page1 2 time(s)',
      'You visited Page2 0 time(s)',
      'You visited Page3 1 time(s)',
    ])
    expect(viewResults()[0]).toBe('You visited Page1 0 time(s)')
  })

  it('only clears its own storage key', () => {
    localStorage.setItem('something-else', 'keep me')
    visitLink('Page2')
    viewResults()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem('something-else')).toBe('keep me')
  })
})
