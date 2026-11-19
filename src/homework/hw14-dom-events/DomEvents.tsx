import { useState } from 'react'
import { cx, Panel } from '../../components/ui'
import { Basketball } from './Basketball'
import { ColorTable } from './ColorTable'
import { PhoneChecker } from './PhoneChecker'

const tasks = [
  { label: 'Table clicking', Component: ColorTable },
  { label: 'Phone number checker', Component: PhoneChecker },
  { label: 'Basketball', Component: Basketball },
]

export default function DomEvents() {
  const [active, setActive] = useState(0)
  const ActiveTask = (tasks[active] ?? tasks[0])?.Component

  return (
    <Panel>
      <p className="mb-3 text-center font-semibold text-link">Rika’s playground</p>
      <div role="tablist" className="mb-6 flex flex-wrap justify-center gap-1">
        {tasks.map((task, index) => (
          <button
            key={task.label}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            className={cx(
              'cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold',
              index === active
                ? 'bg-accent text-white'
                : 'text-link hover:bg-accent-soft dark:hover:bg-slate-800',
            )}
          >
            {task.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="flex justify-center">
        {ActiveTask && <ActiveTask />}
      </div>
    </Panel>
  )
}
