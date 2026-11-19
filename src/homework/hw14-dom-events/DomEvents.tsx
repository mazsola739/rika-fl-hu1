import { useState } from 'react'
import { cx } from '../../components/ui'
import { Basketball } from './Basketball'
import { ColorTable } from './ColorTable'
import { PhoneChecker } from './PhoneChecker'

const tasks = [
  { label: 'Table-clicking', Component: ColorTable },
  { label: 'Phonenumber checker', Component: PhoneChecker },
  { label: 'Basketball', Component: Basketball },
]

export default function DomEvents() {
  const [active, setActive] = useState(0)

  return (
    // The original page: mint, in Times New Roman, with "Rika's playground" over a turquoise tab
    // bar. It stays light in the dark theme too, like the other original pages.
    <div className="flex flex-col items-center overflow-hidden rounded-lg bg-[#dcfcf6] px-4 pt-6 pb-10 font-times text-black">
      <p className="mb-7 text-[1.6rem]">Rika’s playground</p>
      <div
        role="tablist"
        className="mb-12 flex flex-wrap justify-center gap-x-7 gap-y-1 bg-[#8eebdc] px-4 py-3 text-[1.35rem] sm:mb-16"
      >
        {tasks.map((task, index) => (
          <button
            key={task.label}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            className={cx(
              'cursor-pointer underline-offset-4 hover:underline',
              index === active && 'underline',
            )}
          >
            {task.label}
          </button>
        ))}
      </div>
      {/* All three tasks sit in the same grid cell, the inactive ones invisible and inert: the box
          is as big as the biggest task, so the page does not jump when the tab changes, and every
          task keeps its state. */}
      <div className="grid max-w-full items-start justify-items-center">
        {tasks.map(({ label, Component }, index) => (
          <div
            key={label}
            role={index === active ? 'tabpanel' : undefined}
            aria-hidden={index === active ? undefined : true}
            inert={index !== active}
            className={cx(
              'flex max-w-full justify-center [grid-area:1/1]',
              index !== active && 'invisible',
            )}
          >
            <Component />
          </div>
        ))}
      </div>
    </div>
  )
}
