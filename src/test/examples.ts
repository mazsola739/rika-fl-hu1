import { expect, it } from 'vitest'
import type { Example } from '../components/ExampleTable'

/** One test per example of a task; examples without an expected value only have to run. */
export function testExamples(examples: Example[]) {
  for (const example of examples) {
    it(example.call, () => {
      if ('expected' in example) {
        expect(example.actual).toEqual(example.expected)
      } else {
        expect(example.actual).toBeDefined()
      }
    })
  }
}
