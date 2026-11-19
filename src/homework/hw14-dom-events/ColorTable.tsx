import { useState } from 'react'
import { cx } from '../../components/ui'

const ROWS = 3
const COLUMNS = 3
const SPECIAL = { row: 1, column: 1 }

type Color = 'yellow' | 'blue' | 'green' | 'white'

const colorClass: Record<Color, string> = {
  yellow: 'bg-[#edf371]',
  blue: 'bg-[#5e81f3]',
  green: 'bg-[#00ff77]',
  white: 'bg-white',
}

/** Priority of the colors: yellow > blue > green. */
export function cellColor(selected: boolean, rowSelected: boolean, tableSelected: boolean): Color {
  if (selected) {
    return 'yellow'
  }
  if (rowSelected) {
    return 'blue'
  }
  return tableSelected ? 'green' : 'white'
}

export function ColorTable() {
  const [yellowCells, setYellowCells] = useState<ReadonlySet<string>>(() => new Set())
  const [blueRows, setBlueRows] = useState<ReadonlySet<number>>(() => new Set())
  const [green, setGreen] = useState(false)

  function handleClick(row: number, column: number) {
    if (row === SPECIAL.row && column === SPECIAL.column) {
      setGreen((value) => !value)
    } else if (column === 0) {
      setBlueRows((rows) => toggle(rows, row))
    } else {
      setYellowCells((cells) => toggle(cells, `${row}-${column}`))
    }
  }

  return (
    // The original look: a table with border="1", so every cell has a double border.
    <table
      className={cx(
        'border-separate border-spacing-[2px] border border-black bg-white text-black',
        green && colorClass.green,
      )}
    >
      <tbody>
        {Array.from({ length: ROWS }, (_, row) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size grid, the index is the identity
          <tr key={row}>
            {Array.from({ length: COLUMNS }, (_, column) => {
              const isSpecial = row === SPECIAL.row && column === SPECIAL.column
              const color = cellColor(yellowCells.has(`${row}-${column}`), blueRows.has(row), green)
              return (
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-size grid, the index is the identity
                <td key={column} className="border border-black p-0">
                  <button
                    type="button"
                    data-color={color}
                    onClick={() => handleClick(row, column)}
                    className={cx(
                      'size-20 cursor-pointer text-lg sm:size-28 md:size-32',
                      colorClass[color],
                    )}
                  >
                    {isSpecial ? 'Special cell' : 'Cell'}
                  </button>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function toggle<T>(set: ReadonlySet<T>, value: T) {
  const next = new Set(set)
  if (!next.delete(value)) {
    next.add(value)
  }
  return next
}
