import { describe, expect, it } from 'vitest'
import { taskSamples } from './taskSamples'

describe('taskSamples', () => {
  it('lists the sample pictures of a homework in order, with captions', () => {
    expect(taskSamples(5).map((sample) => sample.caption)).toEqual([
      'Desktop',
      'Tablet',
      'Mobile',
      'Hover effects',
    ])
  })

  it('numbers the detail pictures', () => {
    expect(taskSamples(2).map((sample) => sample.caption)).toContain('Detail 11')
  })

  it('gives a preview of every picture, the animation of HW13 too', () => {
    for (const sample of taskSamples(13)) {
      expect(sample.thumb).toMatch(/thumbs\/.+\.webp/)
    }
  })

  it('is empty for a task without samples', () => {
    expect(taskSamples(7)).toEqual([])
  })
})
