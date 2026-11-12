import { useState } from 'react'
import { ExampleTable, formatValue } from '../../components/ExampleTable'
import { Panel, TextField } from '../../components/ui'
import { examples } from './examples'
import {
  addThousandsSeparators,
  capitalize,
  getHexadecimalColors,
  isValidAudioFile,
  isValidIdentifier,
  isValidPassword,
} from './helpers'

export default function DatesRegex() {
  return (
    <div className="flex flex-col gap-6">
      <Playground />
      <ExampleTable examples={examples} />
    </div>
  )
}

function Playground() {
  const [text, setText] = useState('Agent007 #3f3 1234567')

  const results = [
    ['isValidIdentifier', isValidIdentifier(text)],
    ['isValidAudioFile', isValidAudioFile(text)],
    ['isValidPassword', isValidPassword(text)],
    ['getHexadecimalColors', getHexadecimalColors(text)],
    ['capitalize', capitalize(text)],
    ['addThousandsSeparators', addThousandsSeparators(text)],
  ] as const

  return (
    <Panel title="Try the regular expressions">
      <TextField label="Text" value={text} onChange={(event) => setText(event.target.value)} />
      <dl className="mt-4 grid gap-x-4 gap-y-1 font-mono text-sm sm:grid-cols-[auto_1fr]">
        {results.map(([name, result]) => (
          <div key={name} className="contents">
            <dt className="text-slate-500 dark:text-slate-400">{name}</dt>
            <dd className="break-all">{formatValue(result)}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}
