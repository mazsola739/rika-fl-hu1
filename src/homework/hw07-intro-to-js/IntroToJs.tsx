import { useState } from 'react'
import { BrowserDialog } from '../../components/BrowserDialog'
import { Panel } from '../../components/ui'
import { checkBatteries, formatBatteryReport, getMiddle } from './logic'

// Both tasks run like the original scripts: prompt() for every input, alert() for the result.
// Cancel makes prompt() return null, which the validation treats as invalid input.

export default function IntroToJs() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <BatteryCalculator />
      <MiddleCharacter />
    </div>
  )
}

type BatteryStep =
  | { step: 'batteries' }
  | { step: 'rate'; batteries: string | null }
  | { step: 'result'; message: string }

function BatteryCalculator() {
  const [state, setState] = useState<BatteryStep>({ step: 'batteries' })
  // The first prompt does not grab the focus on page load, only when the script starts again.
  const [started, setStarted] = useState(false)

  function report(batteries: string | null, rate: string | null) {
    return formatBatteryReport(checkBatteries(batteries ?? '', rate ?? ''))
  }

  return (
    <Panel title="Task 1 – Defective batteries">
      {state.step === 'batteries' && (
        <BrowserDialog
          key="batteries"
          kind="prompt"
          call="prompt('Enter the amount of batteries')"
          message="Enter the amount of batteries"
          autoFocus={started}
          onOk={(batteries) => setState({ step: 'rate', batteries })}
          onCancel={() => setState({ step: 'rate', batteries: null })}
        />
      )}
      {state.step === 'rate' && (
        <BrowserDialog
          key="rate"
          kind="prompt"
          call="prompt('Enter the percentage of defective batteries')"
          message="Enter the percentage of defective batteries"
          autoFocus
          onOk={(rate) => setState({ step: 'result', message: report(state.batteries, rate) })}
          onCancel={() => setState({ step: 'result', message: report(state.batteries, null) })}
        />
      )}
      {state.step === 'result' && (
        <BrowserDialog
          key="result"
          kind="alert"
          call="alert(message)"
          message={state.message}
          autoFocus
          onOk={() => {
            setStarted(true)
            setState({ step: 'batteries' })
          }}
        />
      )}
    </Panel>
  )
}

function MiddleCharacter() {
  const [result, setResult] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  return (
    <Panel title="Task 2 – Middle character">
      {result === null ? (
        <BrowserDialog
          key="word"
          kind="prompt"
          call="prompt('Enter a word', 'Rika')"
          message="Enter a word"
          defaultValue="Rika"
          autoFocus={started}
          onOk={(word) => setResult(getMiddle(word))}
          onCancel={() => setResult(getMiddle(''))}
        />
      ) : (
        <BrowserDialog
          key="result"
          kind="alert"
          call="alert(getMiddle(word))"
          message={result}
          autoFocus
          onOk={() => {
            setStarted(true)
            setResult(null)
          }}
        />
      )}
    </Panel>
  )
}
