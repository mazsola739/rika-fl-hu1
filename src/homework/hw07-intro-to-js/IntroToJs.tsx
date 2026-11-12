import { type FormEvent, useState } from 'react'
import { Button, Output, Panel, TextField } from '../../components/ui'
import { checkBatteries, formatBatteryReport, getMiddle } from './logic'

export default function IntroToJs() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <BatteryCalculator />
      <MiddleCharacter />
    </div>
  )
}

function BatteryCalculator() {
  const [batteries, setBatteries] = useState('')
  const [rate, setRate] = useState('')
  const [result, setResult] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setResult(formatBatteryReport(checkBatteries(batteries, rate)))
  }

  return (
    <Panel title="Task 1 – Defective batteries">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextField
          label="Amount of batteries"
          inputMode="decimal"
          value={batteries}
          onChange={(event) => setBatteries(event.target.value)}
        />
        <TextField
          label="Defective rate (%)"
          inputMode="decimal"
          value={rate}
          onChange={(event) => setRate(event.target.value)}
        />
        <Button type="submit" className="self-start">
          Calculate
        </Button>
        {result && (
          <Output tone={result === 'Invalid input data' ? 'error' : 'neutral'}>{result}</Output>
        )}
      </form>
    </Panel>
  )
}

function MiddleCharacter() {
  const [word, setWord] = useState('')
  const [result, setResult] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setResult(getMiddle(word))
  }

  return (
    <Panel title="Task 2 – Middle character">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <TextField label="Word" value={word} onChange={(event) => setWord(event.target.value)} />
        <Button type="submit" className="self-start">
          Find the middle
        </Button>
        {result && (
          <Output tone={result === 'Invalid value' ? 'error' : 'neutral'}>{result}</Output>
        )}
      </form>
    </Panel>
  )
}
