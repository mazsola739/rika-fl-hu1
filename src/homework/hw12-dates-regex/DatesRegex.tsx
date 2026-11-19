import { useId, useState } from 'react'
import { CodeBlock, CodeToggleButton } from '../../components/CodeToggle'
import { ExampleTable, formatValue } from '../../components/ExampleTable'
import { functionSource } from '../../components/sourceCode'
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
import source from './helpers.ts?raw'

export default function DatesRegex() {
  return (
    <div className="flex flex-col gap-6">
      <Playground />
      <ExampleTable examples={examples} source={source} />
    </div>
  )
}

function Playground() {
  const [text, setText] = useState('Rika007 #3f3 1234567')

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
      <dl className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 font-mono text-sm">
        {results.map(([name, result]) => (
          <PlaygroundRow key={name} name={name} result={result} />
        ))}
      </dl>
    </Panel>
  )
}

function PlaygroundRow({ name, result }: { name: string; result: unknown }) {
  const [open, setOpen] = useState(false)
  const codeId = useId()
  const code = functionSource(source, name)

  return (
    <div className="contents">
      <dt className="text-slate-500 dark:text-slate-400">{name}</dt>
      <dd className="break-all">{formatValue(result)}</dd>
      <dd>
        {code && (
          <CodeToggleButton
            name={name}
            open={open}
            controls={codeId}
            onToggle={() => setOpen(!open)}
          />
        )}
      </dd>
      {open && code && (
        <dd id={codeId} className="col-span-full mb-2">
          <CodeBlock code={code} />
        </dd>
      )}
    </div>
  )
}
