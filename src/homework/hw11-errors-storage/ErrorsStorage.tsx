import { type ReactNode, useState } from 'react'
import { NavLink, Route, Routes, useParams } from 'react-router'
import { BrowserDialog } from '../../components/BrowserDialog'
import { cx, Panel } from '../../components/ui'
import { ExpressionError, evaluate } from './calculator'
import { PAGES, type PageName, viewResults, visitLink } from './visits'

const BASE = '/hw/11-errors-storage'

export default function ErrorsStorage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <VisitCounter />
      <Calculator />
    </div>
  )
}

/**
 * A small website in the frame of the quiz (homework 08): the page links are counted in
 * localStorage, and the results come in an alert(), like in the original.
 */
function VisitCounter() {
  return (
    <Panel title="Task 1 – Page visit counter">
      <div className="rounded-2xl bg-linear-to-br from-[#fc098f] via-[#39c2d7] to-[#a3c644] p-2 sm:p-3">
        <div className="min-h-72 overflow-hidden rounded-xl bg-white text-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.35)]">
          <nav className="flex flex-wrap gap-1 border-b border-slate-200 px-3 py-2">
            <PageLink to={BASE} end>
              Home
            </PageLink>
            {PAGES.map((page, index) => (
              <PageLink key={page} to={`${BASE}/page/${index + 1}`} onClick={() => visitLink(page)}>
                Page {index + 1}
              </PageLink>
            ))}
          </nav>
          <div className="p-4">
            <Routes>
              <Route index element={<VisitHome />} />
              <Route path="page/:number" element={<VisitPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Panel>
  )
}

function PageLink({
  to,
  end,
  onClick,
  children,
}: {
  to: string
  end?: boolean
  onClick?: () => void
  children: ReactNode
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cx(
          'rounded-lg px-3 py-1 font-semibold text-sm',
          isActive ? 'bg-[#b22746] text-white' : 'text-[#b22746] hover:bg-[#b22746]/10',
        )
      }
    >
      {children}
    </NavLink>
  )
}

function VisitHome() {
  const [results, setResults] = useState<string[] | null>(null)

  if (results) {
    return (
      <BrowserDialog
        kind="alert"
        call="alert(results)"
        message={results.join('\n')}
        autoFocus
        onOk={() => setResults(null)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xl font-bold text-[#fc098f]">Home</h3>
      <p>Click the page links above, then come back and check the counts.</p>
      <button
        type="button"
        onClick={() => setResults(viewResults())}
        className="cursor-pointer self-start rounded-lg bg-[#b22746] px-4 py-2 text-sm font-semibold text-white hover:bg-[#8e244d]"
      >
        View page visits results
      </button>
    </div>
  )
}

function VisitPage() {
  const { number } = useParams()
  const page = PAGES[Number(number) - 1] as PageName | undefined

  return page ? (
    <div className="flex flex-col gap-3">
      <h3 className="text-xl font-bold text-[#fc098f]">Page {number}</h3>
      <p>
        Welcome to {page.replace('Page', 'Page ')}. This visit has been counted in localStorage.
      </p>
    </div>
  ) : (
    <p>There is no such page.</p>
  )
}

type CalculatorStep = { step: 'prompt' } | { step: 'alert'; message: string }

/**
 * Runs like the original script: prompt() for the expression, alert() for the result or the
 * error, then it asks again. Cancel makes prompt() return null, which stops the calculator.
 */
function Calculator() {
  const [state, setState] = useState<CalculatorStep>({ step: 'prompt' })
  // The first prompt does not grab the focus on page load, only when the script asks again.
  const [started, setStarted] = useState(false)

  function calculate(expression: string) {
    // Easter egg: some things cannot be calculated.
    if (expression.trim().toLowerCase() === 'rika') {
      return 'Rika = priceless ✨'
    }
    try {
      return `${expression.trim()} = ${evaluate(expression)}`
    } catch (error) {
      if (!(error instanceof ExpressionError)) {
        throw error
      }
      return `Invalid expression: ${error.message}. Please try again.`
    }
  }

  return (
    <Panel title="Task 2 – Calculator">
      {state.step === 'prompt' ? (
        <BrowserDialog
          key="prompt"
          kind="prompt"
          call="prompt('Enter a mathematical expression', '2 + 3 * (4 - 1)')"
          message="Enter a mathematical expression"
          defaultValue="2 + 3 * (4 - 1)"
          autoFocus={started}
          onOk={(expression) => setState({ step: 'alert', message: calculate(expression) })}
          onCancel={() =>
            setState({ step: 'alert', message: 'Calculator closed. Press OK to start it again.' })
          }
        />
      ) : (
        <BrowserDialog
          key="alert"
          kind="alert"
          call="alert(message)"
          message={state.message}
          autoFocus
          onOk={() => {
            setStarted(true)
            setState({ step: 'prompt' })
          }}
        />
      )}
    </Panel>
  )
}
